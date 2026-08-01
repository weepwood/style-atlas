import type { FocusEvent } from 'react'
import type { VisualStyle } from '../types/style'
import { StylePreview } from './StylePreview'

interface StyleCardProps {
  style: VisualStyle
  index: number
  total: number
  favorite: boolean
  selected: boolean
  previewing: boolean
  onApply: (style: VisualStyle) => void
  onOpen: (style: VisualStyle) => void
  onPreview: (id: string | null) => void
  onToggleFavorite: (id: string) => void
}

export function StyleCard({
  style,
  index,
  total,
  favorite,
  selected,
  previewing,
  onApply,
  onOpen,
  onPreview,
  onToggleFavorite,
}: StyleCardProps) {
  const stopPreviewWhenFocusLeaves = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) onPreview(null)
  }

  return (
    <article
      className={`style-card ${selected ? 'selected' : ''} ${previewing ? 'previewing' : ''}`}
      data-style={style.id}
      onMouseEnter={() => onPreview(style.id)}
      onMouseLeave={() => onPreview(null)}
      onFocus={() => onPreview(style.id)}
      onBlur={stopPreviewWhenFocusLeaves}
    >
      <button
        className={`favorite-button ${favorite ? 'active' : ''}`}
        type="button"
        aria-label={`${favorite ? '取消收藏' : '收藏'} ${style.name}`}
        aria-pressed={favorite}
        onClick={() => onToggleFavorite(style.id)}
      >
        {favorite ? '♥' : '♡'}
      </button>

      <button
        className="style-apply"
        type="button"
        aria-label={`应用${style.name}主题`}
        aria-pressed={selected}
        onClick={() => onApply(style)}
      >
        <div className={`style-preview preview-${style.id}`}><StylePreview styleId={style.id} /></div>
        <div className="style-meta">
          <div className="style-meta-top">
            <span className="style-index">{String(index).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
            <div className="style-tags">{style.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          </div>
          <div className="style-title-row">
            <div><h3>{style.name}</h3><small>{style.en}</small></div>
            <span className="apply-hint">{selected ? '已应用' : previewing ? '预览中' : '应用主题'}</span>
          </div>
          <p className="style-summary">{style.summary}</p>
        </div>
      </button>

      <button className="detail-button" type="button" aria-label={`查看${style.name}详情`} onClick={() => onOpen(style)}>
        设计详情 <span aria-hidden="true">↗</span>
      </button>
    </article>
  )
}
