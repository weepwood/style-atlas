import type { VisualStyle } from '../types/style'
import { StylePreview } from './StylePreview'

interface StyleCardProps {
  style: VisualStyle
  index: number
  total: number
  favorite: boolean
  onOpen: (style: VisualStyle) => void
  onToggleFavorite: (id: string) => void
}

export function StyleCard({ style, index, total, favorite, onOpen, onToggleFavorite }: StyleCardProps) {
  return (
    <article className="style-card" data-style={style.id}>
      <button
        className={`favorite-button ${favorite ? 'active' : ''}`}
        type="button"
        aria-label={`${favorite ? '取消收藏' : '收藏'} ${style.name}`}
        aria-pressed={favorite}
        onClick={() => onToggleFavorite(style.id)}
      >
        {favorite ? '♥' : '♡'}
      </button>
      <button className="style-open" type="button" aria-label={`查看${style.name}详情`} onClick={() => onOpen(style)}>
        <div className={`style-preview preview-${style.id}`}><StylePreview styleId={style.id} /></div>
        <div className="style-meta">
          <div className="style-meta-top">
            <span className="style-index">{String(index).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
            <div className="style-tags">{style.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          </div>
          <div className="style-title-row">
            <div><h3>{style.name}</h3><small>{style.en}</small></div>
            <span className="card-arrow" aria-hidden="true">↗</span>
          </div>
          <p className="style-summary">{style.summary}</p>
        </div>
      </button>
    </article>
  )
}
