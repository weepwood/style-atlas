import test from 'node:test'
import assert from 'node:assert/strict'
import { playgroundDemos, playgroundGroups, createPlaygroundDocument } from '../src/data/playgroundDemos.ts'
import { parseCollectionBackup } from '../src/data/collectionEntries.ts'

test('示例 ID 唯一，内容可独立预览，均含完整 HTML 和 CSS', () => {
  assert.equal(new Set(playgroundDemos.map((item) => item.id)).size, playgroundDemos.length)
  assert.ok(playgroundDemos.length >= 6)
  for (const demo of playgroundDemos) {
    assert.ok(playgroundGroups.includes(demo.group))
    assert.ok(demo.html.length > 20)
    assert.ok(demo.css.length > 20)
    assert.equal(demo.source, 'original')
  }
})

test('生成的隔离文档有独立 CSS、响应式视口和降低动态效果支持', () => {
  const demo = playgroundDemos[0]
  const light = createPlaygroundDocument(demo, false, false)
  const dark = createPlaygroundDocument(demo, true, true)
  assert.ok(light.includes(demo.html))
  assert.ok(light.includes(demo.css))
  assert.match(light, /<meta name="viewport"/)
  assert.match(dark, /animation:none!important/)
  assert.match(dark, /#171b28/)
  assert.ok(!light.includes('<script'))
})

test('新旧版本 v1 备份兼容；笔记内容限制生效', () => {
  const oldBackup = { version: 1, entries: [], favorites: [] }
  assert.deepEqual(parseCollectionBackup(oldBackup), oldBackup)
  const withNotes = { ...oldBackup, notes: { 'style-atlas': '非常喜欢这个风格' } }
  assert.deepEqual(parseCollectionBackup(withNotes), withNotes)
  assert.throws(() => parseCollectionBackup({ ...oldBackup, notes: { broken: 'x'.repeat(2001) } }))
  assert.throws(() => parseCollectionBackup({ ...oldBackup, notes: ['oops'] }))
  assert.throws(() => parseCollectionBackup({ ...oldBackup, notes: null }))
})
