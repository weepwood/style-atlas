interface HeroProps {
  styleCount: number
  onRandom: () => void
}

export function Hero({ styleCount, onRandom }: HeroProps) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">FRONTEND STYLE COLLECTION · 2026</p>
        <h1 id="hero-title">把视觉风格变成<br /><em>可运行的界面样本。</em></h1>
        <p className="hero-description">
          浏览 {styleCount} 种常见网页视觉语言，比较它们的布局、材质、字体、动效和适用场景。所有缩略界面都由 React 与 CSS 实时渲染。
        </p>
        <div className="hero-actions">
          <a className="primary-button" href="#gallery">开始浏览 <span aria-hidden="true">↘</span></a>
          <button className="secondary-button" type="button" onClick={onRandom}>随机探索</button>
        </div>
        <dl className="hero-stats" aria-label="图鉴统计">
          <div><dt>{styleCount}</dt><dd>视觉风格</dd></div>
          <div><dt>React</dt><dd>组件驱动</dd></div>
          <div><dt>100%</dt><dd>实时渲染</dd></div>
        </dl>
      </div>
      <div className="hero-stage" aria-hidden="true">
        <div className="orbit orbit-a" /><div className="orbit orbit-b" />
        <div className="floating-card card-glass"><span className="mini-pill">Glass</span><strong>Soft depth</strong><i /></div>
        <div className="floating-card card-brutal"><span>BRUTAL</span><b>RAW<br />ENERGY</b></div>
        <div className="floating-card card-grid"><i /><i /><i /><i /><i /></div>
        <div className="hero-cursor">VIEW</div>
      </div>
    </section>
  )
}
