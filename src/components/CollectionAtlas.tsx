import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { collectionCategories, curatedEntries, isCollectionEntry, parseCollectionBackup, validWebUrl } from '../data/collectionEntries'
import type { CollectionCategory, CollectionEntry, CollectionStatus } from '../data/collectionEntries'
import { CollectionDetails } from './CollectionDetails'

const STORAGE_KEY = 'style-atlas-personal-collection-v1'
const FAVORITES_KEY = 'style-atlas-collection-favorites-v1'
const NOTES_KEY = 'style-atlas-entry-notes-v1'
const statuses: CollectionStatus[] = ['已收藏', '复刻中', '已实现']

interface EntryDraft {
  title: string
  category: CollectionCategory
  summary: string
  url: string
  tags: string
  note: string
  imageUrl: string
  status: CollectionStatus
}

const blankDraft = (): EntryDraft => ({
  title: '', category: '视觉风格', summary: '', url: '', tags: '', note: '', imageUrl: '', status: '已收藏',
})

function loadPersonalEntries(): CollectionEntry[] {
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]') as unknown
    return Array.isArray(stored)
      ? stored.filter(isCollectionEntry).filter((entry) => !curatedEntries.some((seed) => seed.id === entry.id)).slice(0, 500)
      : []
  } catch { return [] }
}

function loadFavorites(): string[] {
  try {
    const stored = JSON.parse(window.localStorage.getItem(FAVORITES_KEY) || '[]') as unknown
    return Array.isArray(stored) ? stored.filter((id): id is string => typeof id === 'string').slice(0, 1000) : []
  } catch { return [] }
}

function loadEntryNotes(): Record<string, string> {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(NOTES_KEY) || '{}') as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    const entries = Object.entries(parsed as Record<string, unknown>)
      .filter(([id, note]) => id.length > 0 && id.length <= 100 && typeof note === 'string' && note.length <= 2000)
      .slice(0, 600)
    return Object.fromEntries(entries)
  } catch { return {} }
}

function createId(): string {
  return 'personal-' + (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2))
}

export function CollectionAtlas() {
  const [personalEntries, setPersonalEntries] = useState<CollectionEntry[]>(loadPersonalEntries)
  const [favorites, setFavorites] = useState<string[]>(loadFavorites)
  const [entryNotes, setEntryNotes] = useState<Record<string, string>>(loadEntryNotes)
  const [detailEntry, setDetailEntry] = useState<CollectionEntry | null>(null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CollectionCategory | '全部'>('全部')
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [draft, setDraft] = useState<EntryDraft>(blankDraft)
  const [feedback, setFeedback] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(personalEntries)) }
    catch { setFeedback('浏览器存储空间不足，请导出备份并清理存储空间。') }
  }, [personalEntries])
  useEffect(() => {
    try { window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites)) }
    catch { setFeedback('收藏状态未能保存，请导出备份。') }
  }, [favorites])

  useEffect(() => {
    try { window.localStorage.setItem(NOTES_KEY, JSON.stringify(entryNotes)) }
    catch { setFeedback('设计笔记保存失败，请尝试导出 JSON 备份。') }
  }, [entryNotes])

  const allEntries = useMemo(() => [...personalEntries, ...curatedEntries], [personalEntries])
  const visibleEntries = useMemo(() => {
    const text = query.trim().toLocaleLowerCase()
    return allEntries.filter((entry) => {
      if (category !== '全部' && entry.category !== category) return false
      if (onlyFavorites && !favorites.includes(entry.id)) return false
      return !text || [entry.title, entry.summary, entry.note, entry.category, ...entry.tags]
        .join(' ').toLocaleLowerCase().includes(text)
    })
  }, [allEntries, category, favorites, onlyFavorites, query])

  const updateDraft = <K extends keyof EntryDraft>(key: K, value: EntryDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  function closeEditor() {
    setEditorOpen(false)
    setEditId(null)
    setDraft(blankDraft())
  }

  function startAdd() {
    setFeedback('')
    setEditId(null)
    setDraft(blankDraft())
    setEditorOpen(true)
  }

  function startEdit(entry: CollectionEntry) {
    setFeedback('')
    setEditId(entry.id)
    setDraft({ ...entry, tags: entry.tags.join(', '), imageUrl: entry.imageUrl || '' })
    setEditorOpen(true)
  }

  function saveEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const title = draft.title.trim()
    const url = draft.url.trim()
    const imageUrl = draft.imageUrl.trim()
    if (!title || !validWebUrl(url) || (imageUrl && !validWebUrl(imageUrl))) {
      setFeedback('请填写名称和有效的 http(s) 来源链接；预览图片也必须是 http(s) 地址。')
      return
    }
    if (personalEntries.some((entry) => entry.url === url && entry.id !== editId)) {
      setFeedback('这个链接已经在你的个人收藏中。')
      return
    }
    if (!editId && personalEntries.length >= 500) {
      setFeedback('本地收藏已达 500 条上限，请先导出备份。')
      return
    }
    const item: CollectionEntry = {
      id: editId || createId(),
      title: title.slice(0, 120),
      category: draft.category,
      url,
      summary: draft.summary.trim().slice(0, 600),
      tags: [...new Set(draft.tags.split(/[,，]/).map((tag) => tag.trim()).filter(Boolean))].slice(0, 15).map((tag) => tag.slice(0, 30)),
      note: draft.note.trim().slice(0, 2000),
      imageUrl: imageUrl || undefined,
      status: draft.status,
    }
    setPersonalEntries((current) => editId
      ? current.map((entry) => entry.id === editId ? item : entry)
      : [item, ...current])
    closeEditor()
    setFeedback(editId ? '设计收藏已更新。' : '设计已保存到此浏览器，建议定期导出 JSON 备份。')
  }

  function removeEntry(id: string) {
    if (!window.confirm('删除这条个人收藏？此操作不能撤销，除非你保存了备份。')) return
    setPersonalEntries((current) => current.filter((entry) => entry.id !== id))
    setFavorites((current) => current.filter((value) => value !== id))
    setEntryNotes((current) => Object.fromEntries(Object.entries(current).filter(([key]) => key !== id)))
    if (editId === id) closeEditor()
    setFeedback('个人收藏已删除。')
  }

  function toggleFavorite(id: string) {
    setFavorites((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id])
  }

  function exportBackup() {
    const content = JSON.stringify({ version: 1, entries: personalEntries, favorites, notes: entryNotes }, null, 2)
    const href = URL.createObjectURL(new Blob([content], { type: 'application/json;charset=utf-8' }))
    const anchor = document.createElement('a')
    anchor.href = href
    anchor.download = 'weepwood-ui-atlas-collection.json'
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    window.setTimeout(() => URL.revokeObjectURL(href), 3000)
    setFeedback('已生成 JSON 备份文件；内置案例会随网站自动提供，不重复导出。')
  }

  async function importBackup(file: File | undefined) {
    if (!file) return
    try {
      if (file.size > 2 * 1024 * 1024) throw new Error('备份文件不能超过 2 MB')
      const backup = parseCollectionBackup(JSON.parse(await file.text()) as unknown)
      const knownIds = new Set(personalEntries.map((entry) => entry.id))
      const nextEntries = [...personalEntries.filter((entry) => !backup.entries.some((incoming) => incoming.id === entry.id)), ...backup.entries]
      if (nextEntries.length > 500) throw new Error('合并后超过 500 条上限')
      setPersonalEntries(nextEntries)
      const validIds = new Set([...curatedEntries.map((entry) => entry.id), ...nextEntries.map((entry) => entry.id)])
      setFavorites((current) => [...new Set([...current, ...backup.favorites])].filter((id) => validIds.has(id)))
      if (backup.notes) {
        setEntryNotes((current) => Object.fromEntries(Object.entries({ ...current, ...backup.notes }).filter(([id]) => validIds.has(id))))
      }
      setFeedback('导入成功：恢复/更新 ' + backup.entries.length + ' 条个人收藏，其中 ' + backup.entries.filter((entry) => !knownIds.has(entry.id)).length + ' 条为新增。')
    } catch (error) {
      setFeedback(error instanceof Error ? '导入失败：' + error.message : '导入失败：文件内容无效')
    } finally {
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <section className="collection-atlas" id="collection" aria-labelledby="collection-title">
      <div className="collection-heading">
        <div>
          <p className="eyebrow">PERSONAL UI COLLECTION / 01</p>
          <h2 id="collection-title">喜欢的设计，集中收藏。</h2>
          <p className="collection-lead">从自己的 GitHub 仓库开始，保存值得研究的视觉、组件和交互。收藏只代表灵感归档，复用代码前仍需核对原作者与许可证。</p>
        </div>
        <div className="collection-total" aria-label="收藏总量"><strong>{allEntries.length}</strong><span>条精选与个人收藏</span></div>
      </div>

      <div className="collection-toolbar">
        <label className="collection-search">
          <span aria-hidden="true">⌕</span>
          <input aria-label="搜索 UI 收藏" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索名称、风格、标签、备注…" />
        </label>
        <select aria-label="按设计分类筛选" value={category} onChange={(event) => setCategory(event.target.value as CollectionCategory | '全部')}>
          <option value="全部">全部分类</option>
          {collectionCategories.map((item) => <option value={item} key={item}>{item}</option>)}
        </select>
        <button type="button" aria-pressed={onlyFavorites} className={onlyFavorites ? 'is-active' : ''} onClick={() => setOnlyFavorites((current) => !current)}>
          {onlyFavorites ? '♥ 已喜欢' : '♡ 仅看喜欢'}
        </button>
        <button type="button" className="collection-primary" onClick={startAdd}>＋ 收藏设计</button>
      </div>

      <div className="collection-tools">
        <span>显示 {visibleEntries.length} 条 · 个人新增 {personalEntries.length} 条</span>
        <div>
          <button type="button" onClick={exportBackup}>导出 JSON</button>
          <button type="button" onClick={() => fileRef.current?.click()}>导入备份</button>
          <input ref={fileRef} type="file" accept=".json,application/json" hidden aria-label="选择收藏备份 JSON 文件" onChange={(event) => void importBackup(event.target.files?.[0])} />
        </div>
      </div>

      {editorOpen && (
        <form className="collection-editor" onSubmit={saveEntry}>
          <div className="collection-editor-title"><h3>{editId ? '编辑个人收藏' : '添加你喜欢的 UI'}</h3><button type="button" onClick={closeEditor} aria-label="关闭编辑器">✕</button></div>
          <div className="collection-fields">
            <label>名称 <input required maxLength={120} value={draft.title} onChange={(event) => updateDraft('title', event.target.value)} placeholder="例如 Liquid Glass Dock" /></label>
            <label>来源链接 <input required type="url" value={draft.url} onChange={(event) => updateDraft('url', event.target.value)} placeholder="https://…" /></label>
            <label>分类 <select value={draft.category} onChange={(event) => updateDraft('category', event.target.value as CollectionCategory)}>{collectionCategories.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>进度 <select value={draft.status} onChange={(event) => updateDraft('status', event.target.value as CollectionStatus)}>{statuses.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="collection-wide">标签（逗号分隔）<input value={draft.tags} onChange={(event) => updateDraft('tags', event.target.value)} placeholder="Glass, Navigation, Desktop" /></label>
            <label className="collection-wide">简述 <textarea rows={2} maxLength={600} value={draft.summary} onChange={(event) => updateDraft('summary', event.target.value)} placeholder="这条设计吸引你的地方…" /></label>
            <label className="collection-wide">个人备注 <textarea rows={2} maxLength={2000} value={draft.note} onChange={(event) => updateDraft('note', event.target.value)} placeholder="想复刻的交互、实现想法、注意事项…" /></label>
            <label className="collection-wide">预览图片 URL（可选）<input type="url" value={draft.imageUrl} onChange={(event) => updateDraft('imageUrl', event.target.value)} placeholder="https://example.com/preview.webp" /></label>
          </div>
          <p>所有新增数据仅保存在当前浏览器的 localStorage，不会自动同步到 GitHub。外部预览图会向图片服务器发起请求。</p>
          <div className="collection-editor-actions"><button type="button" onClick={closeEditor}>取消</button><button type="submit" className="collection-primary">{editId ? '保存修改' : '加入收藏馆'}</button></div>
        </form>
      )}

      {feedback && <p className="collection-feedback" role="status">{feedback}</p>}

      <div className="collection-grid">
        {visibleEntries.map((entry) => {
          const personal = personalEntries.some((item) => item.id === entry.id)
          const favorite = favorites.includes(entry.id)
          return (
            <article className="collection-card" key={entry.id}>
              <div className={'collection-art collection-art-' + collectionCategories.indexOf(entry.category)}>
                {entry.imageUrl ? <img loading="lazy" src={entry.imageUrl} alt={entry.title + ' 的预览图'} /> : (
                  <div className="collection-art-mock" aria-hidden="true"><i/><div><b/><b/><b/></div><span/></div>
                )}
                <span className="collection-category-tag">{entry.category}</span>
                <button type="button" className="collection-heart" aria-pressed={favorite} aria-label={(favorite ? '取消喜欢 ' : '标记喜欢 ') + entry.title} onClick={() => toggleFavorite(entry.id)}>{favorite ? '♥' : '♡'}</button>
              </div>
              <div className="collection-card-body">
                <div className="collection-card-heading"><h3>{entry.title}</h3><span>{personal ? 'PERSONAL' : 'GITHUB'}</span></div>
                <p>{entry.summary || '尚未添加设计说明。'}</p>
                <div className="collection-chips">{entry.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
                {entry.note && <p className="collection-note" title={entry.note}>{entry.note}</p>}
                <div className="collection-card-footer">
                  <button type="button" className="collection-detail-button" onClick={() => setDetailEntry(entry)}>查看详情 ↗</button>
                  {personal ? <div><button type="button" onClick={() => startEdit(entry)}>编辑</button><button type="button" onClick={() => removeEntry(entry.id)}>删除</button></div> : <small>{entry.status}</small>}
                </div>
              </div>
            </article>
          )
        })}
      </div>
      {visibleEntries.length === 0 && <div className="collection-empty">没有找到匹配的设计。试试其他搜索词或关闭筛选。</div>}
      {detailEntry && (
        <CollectionDetails
          entry={detailEntry}
          isPersonal={personalEntries.some((item) => item.id === detailEntry.id)}
          note={entryNotes[detailEntry.id] || ''}
          onSaveNote={(id, note) => {
            setEntryNotes((current) => ({ ...current, [id]: note }))
            setFeedback('设计笔记已保存到此浏览器。')
          }}
          onEdit={(entry) => { setDetailEntry(null); startEdit(entry) }}
          onClose={() => setDetailEntry(null)}
        />
      )}
      <p className="collection-footnote">这是设计灵感索引，不代表仓库代码已经合并，也不是可直接安装的组件包。组件化成果继续存放于 weepwood-UI。</p>
    </section>
  )
}
