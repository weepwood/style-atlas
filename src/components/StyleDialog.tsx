import { useEffect, useRef } from 'react'
import type { VisualStyle } from '../types/style'
import { StylePreview } from './StylePreview'

interface StyleDialogProps {
  style: VisualStyle | null
  onClose: () => void
  onCopy: (text: string, message: string) => void
}

function cssTokenText(style: VisualStyle) {
  const lines = Object.entries(style.tokens).map(([key, value]) => {
    const normalizedKey = key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
    return `  --${style.id}-${normalizedKey}: ${value};`
  })
  return `:root {\n${lines.join('\n')}\n}`
}

export function StyleDialog({ style, onClose, onCopy }: StyleDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (style && !dialog.open) dialog.showModal()
    if (!style && dialog.open) dialog.close()
  }, [style])

  return (
    <dialog
      ref={dialogRef}
      className="style-dialog"
      aria-labelledby="dialog-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      {style && (
        <>
          <button className="dialog-close" type="button" aria-label="关闭详情" onClick={onClose}>×</button>
          <div className={`dialog-preview preview-${style.id}`}><StylePreview styleId={style.id} /></div>
          <div className="dialog-content">
            <div className="dialog-kicker">{style.en.toUpperCase()} · {style.category.join(' / ')}</div>
            <h2 id="dialog-title">{style.name}</h2>
            <p className="dialog-lead">{style.lead}</p>

            <div className="detail-columns">
              <section><h3>适合场景</h3><ul>{style.bestFor.map((item) => <li key={item}>{item}</li>)}</ul></section>
              <section><h3>常见风险</h3><ul>{style.risks.map((item) => <li key={item}>{item}</li>)}</ul></section>
            </div>

            <section className="palette-section">
              <div className="detail-title-row"><h3>建议配色</h3><span>点击色块复制</span></div>
              <div className="palette-list">
                {style.palette.map((color) => (
                  <button
                    key={color}
                    className="palette-swatch"
                    type="button"
                    style={{ background: color }}
                    aria-label={`复制颜色 ${color}`}
                    onClick={() => onCopy(color, `已复制 ${color}`)}
                  >
                    <span>{color}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="token-section">
              <div className="detail-title-row">
                <h3>CSS Token</h3>
                <button type="button" onClick={() => onCopy(cssTokenText(style), 'CSS Token 已复制')}>复制全部</button>
              </div>
              <pre><code>{cssTokenText(style)}</code></pre>
            </section>
          </div>
        </>
      )}
    </dialog>
  )
}
