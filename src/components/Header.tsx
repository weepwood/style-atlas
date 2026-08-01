interface HeaderProps {
  dark: boolean
  reducedMotion: boolean
  onToggleTheme: () => void
  onToggleMotion: () => void
}

export function Header({ dark, reducedMotion, onToggleTheme, onToggleMotion }: HeaderProps) {
  return (
    <header className="topbar">
      <a className="brand" href="#top" aria-label="返回顶部">
        <span className="brand-mark" aria-hidden="true">SA</span>
        <span><strong>Style Atlas</strong><small>前端视觉风格图鉴</small></span>
      </a>
      <nav className="top-actions" aria-label="页面工具">
        <button className="icon-button" type="button" aria-pressed={reducedMotion} title="减少动画" onClick={onToggleMotion}>
          <span aria-hidden="true">◌</span><span className="button-label">动画</span>
        </button>
        <button className="icon-button" type="button" aria-pressed={dark} title="切换明暗主题" onClick={onToggleTheme}>
          <span aria-hidden="true">◐</span><span className="button-label">主题</span>
        </button>
      </nav>
    </header>
  )
}
