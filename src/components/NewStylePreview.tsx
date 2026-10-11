/** 纯 CSS 原创样机：每种风格使用不同信息架构，避免仅替换颜色。 */
export function NewStylePreview({ styleId }: { styleId: string }) {
  switch (styleId) {
    case 'fluent-mica': return <div className="mini-window nsp-fluent">
      <div className="nsp-window-top"><span className="nsp-traffic">⊞</span><b>Workspace</b><span>— □ ×</span></div>
      <div className="nsp-fluent-content"><aside><div className="nsp-fluent-profile">◎ Studio</div><span className="is-active">▣　总览</span><span>▤　文件</span><span>☆　收藏</span><span className="nsp-fluent-settings">⚙　设置</span></aside><section><small>今天 · 欢迎回来</small><h4>你的工作空间</h4><div className="nsp-fluent-card">✦ <strong>继续你的创作</strong><p>最近编辑 · UI Motion Kit</p></div><div className="nsp-fluent-tiles"><span>⌘<br/>快捷操作</span><span>▦<br/>应用列表</span></div></section></div>
    </div>
    case 'notion-workspace': return <div className="mini-window nsp-notion">
      <aside><div className="nsp-notion-workspace">▣　Personal Space <b>⌄</b></div><small>✳　搜索</small><small>▤　首页</small><small>▥　收件箱</small><span>私有页面　＋</span><small className="is-active">▥　设计灵感</small><small>▤　视觉图鉴</small></aside>
      <main><div className="nsp-notion-breadcrumb">Personal / 设计灵感 <span>···</span></div><div className="nsp-notion-body"><span className="nsp-notion-emoji">✳</span><h4>设计灵感</h4><p>收集、整理和发现优秀的界面语言。</p><div className="nsp-notion-rule"/><b>▸ 进行中的研究</b><p>☑　整理设计系统</p><p>☐　完成动画规范</p><span className="nsp-notion-tip">按 / 进入命令菜单</span></div></main>
    </div>
    case 'liquid': return <div className="mini-window nsp-liquid">
      <div className="nsp-liquid-ambient"/>
      <div className="nsp-liquid-head"><span>◈　PRISM OS</span><span>⌁ &nbsp; ◉</span></div>
      <div className="nsp-liquid-orb"><span>✦</span></div>
      <div className="nsp-liquid-floating"><small>CREATIVE FLOW / 2026</small><h4>See things<br/><i>differently.</i></h4><p>Discover a softer dimension.</p></div>
      <div className="nsp-liquid-dock"><span>⌕</span><span>✺</span><span>◈</span><span>⚙</span></div>
    </div>
    case 'halftone': return <div className="mini-window nsp-halftone">
      <div className="nsp-half-heading"><span>PRINT / STUDY Nº 06</span><span>2026</span></div><div className="nsp-half-orb"><span>✳</span></div>
      <h4>THE<br/>FUTURE<br/><i>IS PRINT.</i></h4><div className="nsp-half-footer"><span>EXPLORE THE IN-BETWEEN</span><strong>↗</strong></div>
    </div>
    case 'command': return <div className="mini-window nsp-command">
      <div className="nsp-command-top"><span>◫　CONTROL / NORTH</span><span>● SYSTEM HEALTHY</span></div><div className="nsp-command-metrics"><div><small>ACTIVE NODES</small><strong>128</strong><em>↗ 12%</em></div><div><small>UPTIME</small><strong>99.9%</strong><em>STABLE</em></div><div><small>REQUESTS</small><strong>48.2K</strong><em>24 HRS</em></div></div>
      <div className="nsp-command-charts"><section><small>LIVE PERFORMANCE</small><div className="nsp-command-bars">{[38,67,48,82,60,76,94,65,81,98].map((v,i)=><i key={i} style={{height:`${v}%`}} />)}</div></section><section><small>EVENT LOG</small><p>● &nbsp; Sync complete</p><p>● &nbsp; Cluster online</p><p>◯ &nbsp; Pending task</p></section></div>
    </div>
    case 'oled': return <div className="mini-window nsp-oled">
      <div className="nsp-oled-top"><span>NOIR / AUDIO</span><span>● 48 kHz</span></div><div className="nsp-oled-art"><div className="nsp-oled-ring">◉</div></div><div className="nsp-oled-track"><div><small>NOW PLAYING</small><h4>After Hours</h4><p>Late Night Signals</p></div><span>▶</span></div><div className="nsp-oled-timeline"><i /></div>
    </div>
    case 'soft-gradient': return <div className="mini-window nsp-soft">
      <div className="nsp-soft-top"><span>well / being</span><span>☼</span></div><h4>A softer way<br/>to begin.</h4><p>Today is a good day to create space for yourself.</p>
      <div className="nsp-soft-sun">✺</div><div className="nsp-soft-note"><small>YOUR DAILY MOMENT</small><strong>Make room to breathe</strong><div className="nsp-soft-track"><i /></div></div>
      <span className="nsp-soft-pills">BREATHE　 ·　 REFLECT　 ·　 GROW</span>
    </div>
    case 'papercut': return <div className="mini-window nsp-paper">
      <div className="nsp-paper-nav"><span>PAPER / 01</span><span>SCULPTED IDEAS</span></div><div className="nsp-paper-sheets"><span className="layer one"/><span className="layer two"/><span className="layer three"/><span className="layer four"/></div><h4>Layers<br/>of wonder.</h4><p>A tactile collection of playful ideas.</p><span className="nsp-paper-stamp">✦</span>
    </div>
    case 'ink-wash': return <div className="mini-window nsp-ink">
      <div className="nsp-ink-nav"><span>墨间 / MOKAN</span><span>第〇七期</span></div><div className="nsp-ink-art"><span className="nsp-ink-moon" /><span className="nsp-ink-mountain a" /><span className="nsp-ink-mountain b" /></div><div className="nsp-ink-copy"><small>墨 · 留白 · 设计</small><h4>山水之间，<br/>自有章法。</h4><p>探索视觉语言中的静与动。</p></div><div className="nsp-ink-mark">印</div>
    </div>
    case 'isometric': return <div className="mini-window nsp-iso">
      <div className="nsp-iso-top"><span>VECTOR / INFRA</span><span>● LIVE 2026</span></div>
      <div className="nsp-iso-scene"><div className="nsp-iso-floor"/><div className="nsp-iso-tower a"/><div className="nsp-iso-tower b"/><div className="nsp-iso-tower c"/><div className="nsp-iso-beacon"/></div>
      <div className="nsp-iso-caption"><h4>Systems<br/>in focus.</h4><p>Mapping complexity into clarity.</p></div><span className="nsp-iso-coords">X:240 / Y:081 / Z:019</span>
    </div>
    default: return <div className="mini-window" aria-label="主题样式尚未实现"/>
  }
}
