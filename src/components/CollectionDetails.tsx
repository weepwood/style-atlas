import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, MouseEvent } from 'react'
import type { CollectionEntry } from '../data/collectionEntries'

// Preview links documented by their respective projects. Do not treat an official repo URL as a live demo.
const verifiedPreviews: Record<string, string> = {
  'style-atlas': 'https://weepwood.github.io/style-atlas/',
  'design-style-library': 'https://design-style-library.netlify.app/',
  'win11-glassmorphism': 'https://lively-chebakia-15f3dd.netlify.app/',
  'ui-elements-showcase': 'https://ui-elements-showcase.netlify.app/',
  'card-collection-hover-effects': 'https://card-collection-hover.netlify.app/',
  'design-weekly-hub': 'https://design-weekly-hub.netlify.app/',
}

interface DetailsProps {
  entry: CollectionEntry
  isPersonal: boolean
  note: string
  onSaveNote: (id: string, note: string) => void
  onEdit: (entry: CollectionEntry) => void
  onClose: () => void
  screenshotUrl?: string
  onPickScreenshot: (id: string) => void
  onRemoveScreenshot: (id: string) => void
}

export function CollectionDetails({ entry, isPersonal, note, onSaveNote, onEdit, onClose, screenshotUrl, onPickScreenshot, onRemoveScreenshot }: DetailsProps) {
  const [text, setText] = useState(note)
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const modalRef = useRef<HTMLElement>(null)
  const preview = verifiedPreviews[entry.id]
  const image = screenshotUrl || entry.imageUrl

  useEffect(() => { setText(note); setCopied(false) }, [entry.id, note])
  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
      previous?.focus()
    }
  }, [])

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape') { event.stopPropagation(); onClose(); return }
    if (event.key !== 'Tab') return
    const tabbable = modalRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],textarea:not([disabled]),input:not([disabled])')
    if (!tabbable?.length) return
    const first = tabbable[0], last = tabbable[tabbable.length - 1]
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
  }

  function backdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.currentTarget === event.target) onClose()
  }

  async function copyLink() {
    try { await navigator.clipboard.writeText(entry.url); setCopied(true) }
    catch { setCopied(false) }
  }

  return (
    <div className="collection-modal-backdrop" onMouseDown={backdropClick}>
      <section ref={modalRef} className="collection-modal" role="dialog" aria-modal="true" aria-labelledby="collection-detail-title" aria-describedby="collection-detail-summary" onKeyDown={handleKeyDown}>
        <header className="collection-modal-top">
          <div><span>{entry.category} · {isPersonal ? '个人收藏' : 'GitHub 项目'}</span><h2 id="collection-detail-title">{entry.title}</h2></div>
          <button ref={closeRef} type="button" aria-label="关闭设计详情" onClick={onClose}>✕</button>
        </header>
        <div className="collection-modal-content">
          {image ? <img className="collection-modal-image" loading="lazy" src={image} alt={entry.title + ' 的收藏预览图'} /> : (
            <div className="collection-modal-fallback" role="img" aria-label="未设置项目截图，使用抽象形状占位">
              <span>UI / {entry.category}</span><strong>{entry.title}</strong><i>VISUAL REFERENCE</i>
            </div>
          )}
          <div className="collection-image-tools">
            <span>{screenshotUrl ? '本地截图 · 已存入此浏览器' : entry.imageUrl ? '外部图片 URL · 由第三方服务器加载' : '未设置截图 · 显示原创占位示意'}</span>
            <div><button type="button" onClick={() => onPickScreenshot(entry.id)}>{screenshotUrl ? '替换本地截图' : '上传本地截图'}</button>
            {screenshotUrl && <button type="button" onClick={() => onRemoveScreenshot(entry.id)}>移除截图</button>}</div>
          </div>
          <p id="collection-detail-summary">{entry.summary || '暂无简介。'}</p>
          <div className="collection-modal-tags">{entry.tags.map((tag) => <span key={tag}>{tag}</span>)}<span>{entry.status}</span></div>
          {entry.note && <blockquote className="collection-modal-description">{entry.note}</blockquote>}
          <div className="collection-modal-links">
            <a href={entry.url} target="_blank" rel="noopener noreferrer">访问项目来源 ↗</a>
            {preview && <a href={preview} target="_blank" rel="noopener noreferrer">打开在线演示 ↗</a>}
            <button type="button" onClick={() => void copyLink()}>{copied ? '已复制' : '复制来源链接'}</button>
            {isPersonal && <button type="button" onClick={() => onEdit(entry)}>编辑收藏</button>}
          </div>
          <label className="collection-modal-note">我的设计笔记
            <textarea maxLength={2000} rows={4} value={text} onChange={(event) => { setText(event.target.value); setSaved(false) }} placeholder="记录喜欢的配色、动画细节、想要复刻的交互和实现想法……"/>
          </label>
          <div className="collection-modal-note-footer">
            <small>笔记保存在当前浏览器，可随 JSON 或 ZIP 备份导出；截图仅包含在 ZIP 中。</small>
            <button type="button" onClick={() => { onSaveNote(entry.id, text.trim()); setSaved(true) }}>{saved ? '✓ 已保存' : '保存笔记'}</button>
          </div>
        </div>
      </section>
    </div>
  )
}
