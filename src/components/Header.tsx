interface HeaderProps {
  dark: boolean
  reducedMotion: boolean
  onToggleTheme: () => void
  onToggleMotion: () => void
}

const NAV_LINKS = [
  { href: '#gallery', label: '风格图鉴' },
  { href: '#motion-lab', label: '动效实验室' },
  { href: '#client-atlas', label: '客户端图鉴' },
  { href: '#decision-guide', label: '选型指南' },
]

export function Header({ dark, reducedMotion, onToggleTheme, onToggleMotion }: HeaderProps) {
  return (
    <header className="topbar">
      <a className="brand" href="#top" aria-label="返回顶部">
        <span className="brand-mark" aria-hidden="true">SA</span>
        <span><strong>Style Atlas</strong><small>前端视觉风格图鉴</small></span>
      </a>
      <nav className="top-nav" aria-label="页面导航">
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href}>{link.label}</a>
        ))}
      </nav>
      <nav className="top-actions" aria-label="页面工具">
        <button className={`icon-button ${reducedMotion ? 'is-on' : ''}`} type="button" aria-pressed={reducedMotion} title="减少动画" onClick={onToggleMotion}>
          <span aria-hidden="true">◌</span><span className="button-label">动画</span>
        </button>
        <button className={`icon-button ${dark ? 'is-on' : ''}`} type="button" aria-pressed={dark} title="切换明暗主题" onClick={onToggleTheme}>
          <span aria-hidden="true">◐</span><span className="button-label">主题</span>
        </button>
      </nav>
    </header>
  )
}
