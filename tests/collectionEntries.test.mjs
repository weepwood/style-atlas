import test from 'node:test'
import assert from 'node:assert/strict'
import { collectionCategories, curatedEntries, isCollectionEntry, parseCollectionBackup, validWebUrl } from '../src/data/collectionEntries.ts'

const item = {
  id: 'personal-test-1', title: 'Favorite UI', category: 'UI 组件',
  summary: 'A sample component', url: 'https://example.com/design',
  tags: ['Card', 'Glass'], note: 'For a personal reference', status: '已收藏',
}

test('内置分类和初始收藏保持稳定', () => {
  assert.equal(collectionCategories.length, 5)
  assert.equal(curatedEntries.length, 16)
  assert.equal(new Set(curatedEntries.map((entry) => entry.id)).size, curatedEntries.length)
  assert.ok(curatedEntries.every(isCollectionEntry))
})

test('只接受 HTTP / HTTPS 来源链接', () => {
  assert.equal(validWebUrl('https://github.com/weepwood/style-atlas'), true)
  assert.equal(validWebUrl('http://example.com'), true)
  for (const url of ['javascript:alert(1)', 'file:///tmp/file', 'data:text/html,a', 'https://', 'not a url']) {
    assert.equal(validWebUrl(url), false, url)
  }
})

test('个人收藏的数据校验涵盖核心字段和图片链接', () => {
  assert.equal(isCollectionEntry(item), true)
  assert.equal(isCollectionEntry({ ...item, category: '不存在的类别' }), false)
  assert.equal(isCollectionEntry({ ...item, tags: [33] }), false)
  assert.equal(isCollectionEntry({ ...item, imageUrl: 'javascript:alert(1)' }), false)
  assert.equal(isCollectionEntry({ ...item, note: 'x'.repeat(2001) }), false)
})

test('备份 v1 可正确解析并保持资料内容', () => {
  const backup = { version: 1, entries: [item], favorites: [item.id] }
  assert.deepEqual(parseCollectionBackup(backup), backup)
})

test('拒绝格式错误、重复 ID 和伪造的内置收藏 ID', () => {
  assert.throws(() => parseCollectionBackup({ version: 2, entries: [], favorites: [] }))
  assert.throws(() => parseCollectionBackup({ version: 1, entries: [item, item], favorites: [] }))
  assert.throws(() => parseCollectionBackup({ version: 1, entries: [{ ...item, id: curatedEntries[0].id }], favorites: [] }))
  assert.throws(() => parseCollectionBackup({ version: 1, entries: [item], favorites: [null] }))
})

test('限制备份大小与异常字段', () => {
  assert.throws(() => parseCollectionBackup({ version: 1, entries: Array(501).fill(item), favorites: [] }))
  assert.throws(() => parseCollectionBackup({ version: 1, entries: [null], favorites: [] }))
  assert.throws(() => parseCollectionBackup({ version: 1, entries: [], favorites: Array(1001).fill('test') }))
})
