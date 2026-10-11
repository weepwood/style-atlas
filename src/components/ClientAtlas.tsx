import { useEffect, useMemo, useRef, useState } from 'react'
import { clientCategories, clientPatterns, researchDate } from '../data/clientPatterns'
import type { ClientPattern } from '../data/clientPatterns'
import './clientAtlas.css'

function MiniApplication({ item, compact = false }: { item: ClientPattern; compact?: boolean }) {
  const [active, setActive] = useState(0)
  const [search, setSearch] = useState(false)
  const [term, setTerm] = useState('')
  const [items, setItems] = useState(['设计规范整理', '组件行为分析', '客户端交互研究'])
  const [selected, setSelected] = useState(0)
  const [playing, setPlaying] = useState(false)
  const dark = ['linear', 'vscode', 'discord', 'spotify'].includes(item.id)
  const isMobile = item.layout === 'mobile'
  const rows = items.filter(label => label.toLowerCase().includes(term.toLowerCase()))
  return (
    <div className={`ca-mock ca-${item.id} ${compact ? 'ca-compact' : ''} ${isMobile ? 'ca-mobile' : ''}`}
      style={{ '--ca-accent': item.accent, '--ca-bg': item.bg, '--ca-panel': item.panel, '--ca-text': item.text, '--ca-radius': `${item.radius}px` } as React.CSSProperties}>
      <header className="ca-windowbar"><span className="ca-windowdots">● ● ●</span><span>{item.subtitle}</span><button aria-label="搜索示例" onClick={() => setSearch(s=>!s)}>⌕</button></header>
      <div className="ca-appbody">
        <aside className="ca-appnav">
          <div className="ca-app-logo"><span>◈</span> {item.name.split(' · ')[0]}</div>
          {item.nav.map((label, index) => <button type="button" key={label} className={active === index ? 'selected' : ''} onClick={() => { setActive(index); setTerm(''); setSelected(0) }}><span>{['▦','◉','◇'][index]}</span>{label}</button>)}
          <small>INTERACTIVE SAMPLE</small>
        </aside>
        <div className="ca-appmain">
          <div className="ca-appheading"><div><small>WORKSPACE / {item.category}</small><h3>{item.nav[active]}</h3></div><button type="button" onClick={() => setSearch(v => !v)} aria-label="展开搜索">⌕</button></div>
          {search && <input aria-label="搜索示例项目" className="ca-appsearch" placeholder="搜索当前项目…" autoFocus value={term} onChange={e => setTerm(e.target.value)} />}
          {item.layout === 'media' ? (
            <div className="ca-media"><h4>精选播放列表</h4><div className="ca-media-tiles">{['夜间灵感','创意工作','深度专注'].map((t,i)=><button key={t} onClick={() => setSelected(i)} className={selected === i ? 'on' : ''}><span className="ca-cover">{['♫','◈','✺'][i]}</span>{t}</button>)}</div><div className="ca-player"><span>♪ 正在播放：{['夜间灵感','创意工作','深度专注'][selected]}</span><button onClick={() => setPlaying(v=>!v)}>{playing ? 'Ⅱ 暂停' : '▶ 播放'}</button></div></div>
          ) : item.layout === 'editor' ? (
            <div className="ca-editor"><div className="ca-tabs"><button className="on">README.md ×</button><button onClick={() => setSelected(v => (v+1)%3)}>＋ 新建</button></div><div className="ca-code"><span>01</span><em># {item.nav[active]}</em><span>02</span><p>欢迎使用 UI 风格实验室</p><span>03</span><p>选择控件体验不同状态。</p><span>04</span><p className="ca-code-hi">const selected = {selected + 1}</p></div><footer>✓ Ready &nbsp; · &nbsp;  UTF-8 &nbsp; · &nbsp; UI Atlas</footer></div>
          ) : item.layout === 'native' ? (
            <div className="ca-native"><div className="ca-feature"><span>✦</span><div><small>精选内容</small><h4>{item.nav[active]}工作台</h4><p>一个简单、自然且易于操作的界面。</p></div></div><div className="ca-feature-grid">{['最近项目','快速操作','我的收藏'].map((label,i)=><button key={label} onClick={() => setSelected(i)} className={selected === i ? 'on' : ''}><span>{['▤','✦','♡'][i]}</span><strong>{label}</strong></button>)}</div></div>
          ) : item.layout === 'mobile' ? (
            <div className="ca-mobilecontent"><div className="ca-mobilehero"><span>✦</span><h4>你的每日灵感</h4><p>按自己的节奏，发现新内容。</p><button onClick={() => setItems(v=>[...v, `新任务 ${v.length+1}`])}>＋ 新建任务</button></div><h4>接下来</h4>{rows.map((label,i)=><button key={label} onClick={()=>setSelected(i)} className={selected===i?'on':''}>◉ &nbsp; {label}</button>)}</div>
          ) : (
            <div className="ca-generic"><div className="ca-metrics"><div><small>进行中的项目</small><strong>{items.length * 8 + active}</strong><span>↗ 持续更新</span></div><div><small>设计探索</small><strong>{item.characteristics.length * 12}</strong><span>本周进度</span></div><div><small>待处理</small><strong>{Math.max(0, items.length - selected)}</strong><span>操作队列</span></div></div><div className="ca-sectionbar"><strong>最近项目</strong><button onClick={() => setItems(v=>[...v,`新项目 ${v.length+1}`])}>＋ 新建</button></div><div className="ca-table">{rows.map((label,i)=><button key={label} className={selected===i?'active':''} onClick={()=>setSelected(i)}><span>◫</span><span>{label}</span><small>{i % 2 ? '待处理' : '进行中'}</small><span>→</span></button>)}</div>{rows.length===0 && <p>没有匹配的示例记录</p>}</div>
          )}
        </div>
      </div>
      {!compact && <div className="ca-mockfooter">交互演示 · 点击导航 / 搜索 / 卡片 / 按钮可体验状态变化 <span>{dark ? '● DARK' : '○ LIGHT'}</span></div>}
    </div>
  )
}

export function ClientAtlas() {
  const [category, setCategory] = useState('全部')
  const [query, setQuery] = useState('')
  const [platform, setPlatform] = useState('全部平台')
  const [density, setDensity] = useState('全部密度')
  const [selected, setSelected] = useState<ClientPattern | null>(null)
  const [compare, setCompare] = useState<string[]>([])
  const dialogRef = useRef<HTMLDialogElement>(null)
  const filtered = useMemo(() => clientPatterns.filter(item => (category === '全部' || item.category===category) && (platform==='全部平台' || item.platform===platform) && (density==='全部密度' || item.density===density) && [item.name,item.summary,item.subtitle,...item.characteristics,...item.interactions].join(' ').toLowerCase().includes(query.trim().toLowerCase())), [category, query, platform, density])
  useEffect(() => { if(selected) dialogRef.current?.showModal(); else dialogRef.current?.close() },[selected])
  useEffect(() => { const node=dialogRef.current; const onClose=()=>setSelected(null); node?.addEventListener('close',onClose); return ()=>node?.removeEventListener('close',onClose) },[])
  const selectedComparison=compare.map(id=>clientPatterns.find(item=>item.id===id)).filter((item):item is ClientPattern=>Boolean(item))
  return (
    <section className="client-atlas" id="client-atlas" aria-labelledby="client-atlas-title">
      <div className="ca-intro"><div><span className="ca-eyebrow">CLIENT UI ATLAS / 2026</span><h2 id="client-atlas-title">主流客户端 <em>UI 风格图鉴</em></h2><p>不止是截图收集。拆解真实的布局、设计体系与交互方式，在浏览器中亲手体验和横向比较。</p></div><div className="ca-intro-stats"><strong>{clientPatterns.length}<small>设计案例</small></strong><strong>{clientCategories.length-1}<small>设计领域</small></strong><strong>{clientPatterns.reduce((acc,i)=>acc+i.sources.length,0)}<small>参考入口</small></strong></div></div>
      <div className="ca-controls"><input type="search" value={query} onChange={e=>setQuery(e.target.value)} aria-label="搜索客户端设计案例" placeholder="搜索风格、应用、交互方式…" /><select aria-label="按平台筛选" value={platform} onChange={e=>setPlatform(e.target.value)}>{['全部平台','Web','跨平台','桌面','移动端'].map(i=><option key={i}>{i}</option>)}</select><select aria-label="按信息密度筛选" value={density} onChange={e=>setDensity(e.target.value)}>{['全部密度','低','中','高'].map(i=><option key={i}>{i}</option>)}</select></div>
      <nav className="ca-categories" aria-label="设计类型">{clientCategories.map(c=><button type="button" key={c} aria-pressed={category===c} className={category===c?'active':''} onClick={()=>setCategory(c)}>{c}</button>)}</nav>
      <div className="ca-count">找到 {filtered.length} 个案例 <span>资料整理于 {researchDate} · 预览为原创简化模拟界面</span></div>
      <div className="ca-grid">{filtered.map(item=><article key={item.id} className="ca-card"><MiniApplication key={item.id} item={item} compact/><div className="ca-card-meta"><div className="ca-labels"><span>{item.category}</span><span>{item.platform}</span><span>{item.status}</span></div><h3>{item.name}</h3><p>{item.summary}</p><div className="ca-card-actions"><button type="button" onClick={()=>setSelected(item)}>探索交互 ↗</button><button type="button" disabled={!compare.includes(item.id) && compare.length >= 3} aria-pressed={compare.includes(item.id)} onClick={()=>setCompare(v=>v.includes(item.id)?v.filter(id=>id!==item.id):[...v,item.id])}>{compare.includes(item.id)?'✓ 已加入对比':'＋ 加入对比'}</button></div></div></article>)}</div>
      {filtered.length===0&&<div className="ca-empty">没有找到匹配的案例。<button onClick={()=>{setCategory('全部');setQuery('');setPlatform('全部平台');setDensity('全部密度')}}>清除筛选</button></div>}
      {compare.length>0&&<div className="ca-comparison"><div className="ca-comparison-head"><strong>风格横向对比</strong><span>已选 {compare.length}/3</span><button onClick={()=>setCompare([])}>清空</button></div><div className="ca-compare-table"><table><thead><tr><th>对比维度</th>{selectedComparison.map(i=><th key={i.id}>{i.name}</th>)}</tr></thead><tbody>{[ ['所属分类',(i:ClientPattern)=>i.category], ['信息密度',(i:ClientPattern)=>i.density], ['适合场景',(i:ClientPattern)=>i.suitableFor.join(' / ')], ['标志性特征',(i:ClientPattern)=>i.characteristics.join(' / ')], ['交互模式',(i:ClientPattern)=>i.interactions.join(' / ')], ['设计风险',(i:ClientPattern)=>i.cautions.join(' / ')] ].map(([label,getter])=><tr key={label as string}><th>{label as string}</th>{selectedComparison.map(i=><td key={i.id}>{(getter as (i:ClientPattern)=>string)(i)}</td>)}</tr>)}</tbody></table></div></div>}
      <dialog ref={dialogRef} className="ca-dialog" onClick={e=>{if(e.target===e.currentTarget)setSelected(null)}}>{selected&&<div className="ca-detail"><div className="ca-detailtop"><span>INTERACTIVE DESIGN RESEARCH / {selected.status}</span><button aria-label="关闭详情" onClick={()=>setSelected(null)}>×</button></div><div className="ca-detailheading"><div><h2>{selected.name}</h2><p>{selected.summary}</p></div><div className="ca-design-tags"><span>{selected.platform}</span><span>{selected.category}</span><span>信息密度 · {selected.density}</span></div></div><MiniApplication key={selected.id} item={selected}/><div className="ca-detailsections"><section><h3>视觉语言</h3><ul>{selected.characteristics.map(t=><li key={t}>{t}</li>)}</ul></section><section><h3>核心交互</h3><ul>{selected.interactions.map(t=><li key={t}>{t}</li>)}</ul></section><section><h3>推荐应用场景</h3><ul>{selected.suitableFor.map(t=><li key={t}>{t}</li>)}</ul></section><section><h3>实现注意事项</h3><ul>{selected.cautions.map(t=><li key={t}>{t}</li>)}</ul></section></div><div className="ca-references"><h3>参考资料与设计资源</h3>{selected.sources.map(s=><a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer"><span>{s.kind}</span>{s.label}<b>↗</b></a>)}</div><p className="ca-disclaimer">说明：以上是设计学习用途的简化交互样例，不是官方截图，也不构成原产品的 1:1 复刻。链接指向官方资料与开源资源。</p></div>}</dialog>
    </section>
  )
}
