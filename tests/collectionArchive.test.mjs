import test from 'node:test'
import assert from 'node:assert/strict'
import JSZip from 'jszip'
import { generateCollectionArchive, parseCollectionArchive } from '../src/data/collectionArchive.ts'

const backup = { version: 1, entries: [], favorites: ['style-atlas'], notes: { 'style-atlas': 'Design note' } }
const fakeWebp = new Blob([new Uint8Array([
  82, 73, 70, 70, 12, 0, 0, 0, 87, 69, 66, 80, 86, 80, 56, 32, 0, 0, 0, 0,
])], { type: 'image/webp' })

test('完整 ZIP：图片、笔记与收藏数据能被无损打包和解包', async () => {
  const zip = await generateCollectionArchive(backup, [{ id: 'style-atlas', blob: fakeWebp }])
  assert.ok(zip.size > fakeWebp.size)
  const result = await parseCollectionArchive(zip)
  assert.deepEqual(result.backup, backup)
  assert.equal(result.images.length, 1)
  assert.equal(result.images[0].id, 'style-atlas')
  assert.deepEqual(
    new Uint8Array(await result.images[0].blob.arrayBuffer()),
    new Uint8Array(await fakeWebp.arrayBuffer()),
  )
})

test('完整 ZIP：不允许未知图片 ID、重复 ID 和超额截图', async () => {
  await assert.rejects(() => generateCollectionArchive(backup, [{ id: 'unknown-entry', blob: fakeWebp }]))
  await assert.rejects(() => generateCollectionArchive(backup, [
    { id: 'style-atlas', blob: fakeWebp }, { id: 'style-atlas', blob: fakeWebp },
  ]))
  await assert.rejects(() => generateCollectionArchive(backup, [{ id: 'style-atlas', blob: new Blob(['svg'], { type: 'image/svg+xml' }) }]))
})

test('导入 ZIP：拒绝恶意路径、伪造格式或损坏清单', async () => {
  const original = await generateCollectionArchive(backup, [{ id: 'style-atlas', blob: fakeWebp }])
  const zip = await JSZip.loadAsync(new Uint8Array(await original.arrayBuffer()))
  zip.file('manifest.json', JSON.stringify({
    format: 'weepwood-ui-atlas', version: 1,
    images: [{ id: 'style-atlas', file: '../escape.webp', type: 'image/webp' }],
  }))
  await assert.rejects(async () => parseCollectionArchive(await zip.generateAsync({ type: 'blob' })))
  zip.file('manifest.json', JSON.stringify({ format: 'wrong', version: 1, images: [] }))
  await assert.rejects(async () => parseCollectionArchive(await zip.generateAsync({ type: 'blob' })))
})

test('旧 JSON 备份仍无需升级为 ZIP', async () => {
  const zip = await generateCollectionArchive({ version: 1, entries: [], favorites: [] }, [])
  const result = await parseCollectionArchive(zip)
  assert.deepEqual(result.images, [])
})
