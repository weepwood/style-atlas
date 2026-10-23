import { useEffect, useMemo, useRef, useState } from 'react'
import { categories, styles } from './data/themeCatalog'
import type { VisualStyle } from './types/style'
import { useLocalStorage } from './hooks/useLocalStorage'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { FilterBar } from './components/FilterBar'
import { StyleCard } from './components/StyleCard'
import { StyleDialog } from './components/StyleDialog'
import { ClientAtlas } from './components/ClientAtlas'
import { MotionLab } from './components/MotionLab'
import { CollectionAtlas } from './components/CollectionAtlas'
import { ComponentPlayground } from './components/ComponentPlayground'

function getInitialTheme() {
  const saved = window.localStorage.getItem('style-atlas-theme')
  if (saved === 'dark' || saved === 'light') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function App() {
  const [activeCategory, setActiveCategory] = useState<string>('全部')
  const [query, setQuery] = useState('')
  const [activeStyle, setActiveStyle] = useState<VisualStyle | null>(null)
  const [favorites, setFavorites] = useLocalStorage<string[]>('style-atlas-favorites', [])
  const [selectedThemeId, setSelectedThemeId] = useLocalStorage<string | null>('style-atlas-selected-theme', null)
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme)
  const [motionOverride, setMotionOverride] = useLocalStorage<boolean | null>('style-atlas-motion-override', null)
  const [systemReducedMotion, setSystemReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const reducedMotion = motionOverride ?? systemReducedMotion
  const [toast, setToast] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const toastTimerRef = useRef<number | null>(null)

  const favoriteSet = useMemo(() => new Set(favorites), [favorites])
  const appliedStyle = useMemo(
    () => styles.find((style) => style.id === selectedThemeId) ?? null,
    [selectedThemeId],
  )

  const visibleStyles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return styles.filter((style) => {
      const matchesCategory = activeCategory === '全部'
        || (activeCategory === '收藏' && favoriteSet.has(style.id))
        || style.category.includes(activeCategory)
      const haystack = [style.name, style.en, style.summary, ...style.category, ...style.tags, ...style.bestFor]
        .join(' ')
        .toLowerCase()
      return matchesCategory && (!normalizedQuery || haystack.includes(normalizedQuery))
    })
  }, [activeCategory, favoriteSet, query])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('style-atlas-theme', theme)
  }, [theme])

  useEffect(() => {
    if (selectedThemeId) {
      document.documentElement.dataset.atlasTheme = selectedThemeId
    } else {
      delete document.documentElement.dataset.atlasTheme
    }
  }, [selectedThemeId])

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = String(reducedMotion)
  }, [reducedMotion])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setSystemReducedMotion(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.key === '/' && document.activeElement !== searchRef.current) {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleShortcut)
    return () => document.removeEventListener('keydown', handleShortcut)
  }, [])

  useEffect(() => () => {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current)
  }, [])

  const showToast = (message: string) => {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current)
    setToast(message)
    toastTimerRef.current = window.setTimeout(() => setToast(''), 1800)
  }

  const copyText = async (text: string, successMessage: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.append(textarea)
      textarea.select()
      document.execCommand('copy')
      textarea.remove()
    }
    showToast(successMessage)
  }

  const toggleFavorite = (id: string) => {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }

  const applyTheme = (style: VisualStyle) => {
    setSelectedThemeId(style.id)
    showToast(`已应用：${style.name}`)
  }

  const clearTheme = () => {
    setSelectedThemeId(null)
    showToast('已恢复默认图鉴样式')
  }

  const resetFilters = () => {
    setActiveCategory('全部')
    setQuery('')
    searchRef.current?.focus()
  }

  const openRandomStyle = () => {
    const candidates = visibleStyles.length ? visibleStyles : styles
    const style = candidates[Math.floor(Math.random() * candidates.length)]
    applyTheme(style)
    setActiveStyle(style)
  }

  return (
    <>
      <a className="skip-link" href="#gallery">跳到风格列表</a>
      <Header
        dark={theme === 'dark'}
        reducedMotion={reducedMotion}
        onToggleTheme={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}
        onToggleMotion={() => setMotionOverride(current => !(current ?? systemReducedMotion))}
      />

      <aside className={`theme-status ${appliedStyle ? 'active' : ''}`} aria-live="polite">
        <div className="theme-status-copy">
          <span>当前主题</span>
          <strong>{appliedStyle?.name ?? '默认图鉴'}</strong>
          <small>{appliedStyle?.en ?? 'Style Atlas Default'}</small>
        </div>
        {appliedStyle && (
          <div className="theme-status-palette" aria-hidden="true">
            {appliedStyle.palette.slice(0, 5).map((color) => <i key={color} style={{ background: color }} />)}
          </div>
        )}
        {selectedThemeId && <button type="button" onClick={clearTheme}>恢复默认</button>}
      </aside>

      <main id="top">
        <Hero styleCount={styles.length} onRandom={openRandomStyle} />
        <CollectionAtlas />
        <ComponentPlayground reducedMotion={reducedMotion} />
        <section aria-label="视觉与结构实验室" style={{ maxWidth: 1280, margin: '16px auto 34px', padding: '0 24px' }}>
          <a href={`${import.meta.env.BASE_URL}frame-lab/`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, padding: '22px 26px', borderRadius: 18, background: 'linear-gradient(115deg,#242238,#473a78)', color: '#fff', textDecoration: 'none', boxShadow: '0 10px 28px rgba(21,20,54,.15)' }}>
            <span style={{ display: 'grid', gap: 7 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: '#c6b9ff' }}>NEW · FRAME / LAB</span>
              <strong style={{ fontSize: 'clamp(18px,2.2vw,26px)', lineHeight: 1.3 }}>Dribbble 视觉 × Figma 设计结构</strong>
              <span style={{ fontSize: 13, color: '#e6e2fa' }}>12 种视觉语言 · 交互工作台 · Auto Layout 结构拆解 · 组件实验室</span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#34255c', borderRadius: 12, padding: '11px 17px', fontWeight: 700, fontSize: 13 }}>打开实验室 ↗</span>
          </a>
        </section>
        <FilterBar
          categories={categories}
          activeCategory={activeCategory}
          query={query}
          resultCount={visibleStyles.length}
          searchRef={searchRef}
          onCategoryChange={setActiveCategory}
          onQueryChange={setQuery}
        />

        <section className="gallery-section" id="gallery" aria-labelledby="gallery-title">
          <div className="section-heading">
            <div><p className="eyebrow">STYLE LIBRARY</p><h2 id="gallery-title">选择一种视觉语言</h2></div>
            <p>每款风格拥有独立组件布局与设计细节。悬停只高亮卡片，点击才应用全站主题；右下角可以查看动效节奏、风险、配色和 CSS Token。</p>
          </div>

          <div className="style-grid">
            {visibleStyles.map((style) => (
              <StyleCard
                key={style.id}
                style={style}
                index={styles.findIndex((item) => item.id === style.id) + 1}
                total={styles.length}
                favorite={favoriteSet.has(style.id)}
                selected={selectedThemeId === style.id}
                onApply={applyTheme}
                onOpen={setActiveStyle}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>

          {visibleStyles.length === 0 && (
            <div className="empty-state">
              <span>没有匹配的风格</span>
              <button type="button" onClick={resetFilters}>重置筛选</button>
            </div>
          )}
        </section>

        <MotionLab reducedMotion={reducedMotion} motionCustomized={motionOverride !== null} onToggleMotion={() => setMotionOverride(current => !(current ?? systemReducedMotion))} onFollowSystem={() => setMotionOverride(null)} />

        <ClientAtlas />

        <section className="decision-guide" aria-labelledby="guide-title">
          <div className="section-heading inverse">
            <div><p className="eyebrow">DECISION GUIDE</p><h2 id="guide-title">不要从“流行”开始选择</h2></div>
            <p>先判断内容密度、品牌气质和用户任务，再决定视觉表现。风格是解决问题的工具，不是页面表面的装饰。</p>
          </div>
          <div className="guide-grid">
            <article><span>01</span><h3>信息密度</h3><p>复杂产品优先考虑 Bento、Swiss 或数据仪表盘；内容稀疏时再使用强氛围风格。</p></article>
            <article><span>02</span><h3>品牌性格</h3><p>专业可信、年轻叛逆、未来科技或温和亲近，需要完全不同的字体、颜色与运动方式。</p></article>
            <article><span>03</span><h3>交互成本</h3><p>透明、3D、噪点与复杂动画会增加性能和可访问性成本，应保留降级方案。</p></article>
            <article><span>04</span><h3>长期维护</h3><p>把风格提炼为 Token、组件和约束，避免项目最终变成无法复用的视觉拼贴。</p></article>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div><strong>Style Atlas</strong><p>基于 React、TypeScript 与 Vite 的可扩展前端风格展示项目。</p></div>
        <a href="#top">回到顶部 ↑</a>
      </footer>

      <StyleDialog style={activeStyle} onClose={() => setActiveStyle(null)} onCopy={copyText} />
      <div className={`toast ${toast ? 'show' : ''}`} role="status" aria-live="polite">{toast}</div>
    </>
  )
}

export default App
