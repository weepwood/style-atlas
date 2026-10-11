import { useState } from 'react'
import './motion-lab.css'

const motionRules = [
  { id: 'feedback', label: '即时反馈', time: '120–160ms', use: '按钮、收藏、开关', ease: 'ease-out' },
  { id: 'navigation', label: '导航与选择', time: '180–240ms', use: '选项卡、筛选、选中态', ease: 'standard' },
  { id: 'surface', label: '容器展开', time: '240–320ms', use: '抽屉、弹窗、内容面板', ease: 'emphasized' },
  { id: 'status', label: '状态提示', time: '160–220ms', use: '成功反馈、通知、保存', ease: 'ease-out' },
]

type MotionLabProps = { reducedMotion: boolean; onToggleMotion: () => void }

export function MotionLab({ reducedMotion, onToggleMotion }: MotionLabProps) {
  const [pressed, setPressed] = useState(false)
  const [tab, setTab] = useState(0)
  const [open, setOpen] = useState(false)
  const [notice, setNotice] = useState(false)
  return <section className="motion-lab" aria-labelledby="motion-lab-title" id="motion-lab">
    <div className="motion-heading">
      <div><span className="motion-eyebrow">MOTION DESIGN / INTERACTION PRINCIPLES</span>
        <h2 id="motion-lab-title">动效不是装饰，<em>而是行为的解释。</em></h2>
        <p>动效要交代因果关系、视觉层级和操作结果。下方的四种模式可以实际点击体验；所有反馈保持短促，不阻塞下一次操作。</p>
      </div>
      <button className="motion-setting" type="button" aria-pressed={reducedMotion} onClick={onToggleMotion}>
        <span aria-hidden="true">{reducedMotion ? '◻' : '◉'}</span>{reducedMotion ? '已减少动画 · 点击启用' : '动画已启用 · 点击减少'}
      </button>
    </div>
    <div className="motion-rules">{motionRules.map(rule => <div key={rule.id}><small>{rule.label}</small><strong>{rule.time}</strong><span>{rule.use}</span><code>{rule.ease}</code></div>)}</div>
    <div className="motion-demos">
      <article className="motion-demo">
        <div className="motion-demo-title"><span>01 / FEEDBACK</span><strong>按钮的触感</strong></div>
        <div className="motion-demo-stage"><button type="button" aria-pressed={pressed} className={`motion-press ${pressed ? 'is-pressed' : ''}`} onClick={() => setPressed(x=>!x)}>{pressed ? '✓ 已添加收藏' : '♡ 添加收藏'}</button></div>
        <p>按下时使用极短的缩放与颜色变化；完成后提供文字确认，不依赖动画表达状态。</p>
      </article>
      <article className="motion-demo">
        <div className="motion-demo-title"><span>02 / NAVIGATION</span><strong>导航的空间连续性</strong></div>
        <div className="motion-demo-stage motion-tab-stage"><div role="tablist" aria-label="动效选项卡实验">{['总览','项目','活动'].map((t,i)=><button role="tab" type="button" key={t} aria-selected={tab===i} className={tab===i?'is-selected':''} onClick={()=>setTab(i)}>{t}</button>)}</div><div className="motion-tab-copy" role="tabpanel" key={tab}><strong>{['12 个进行中项目','项目列表已更新','最近 24 小时活动'][tab]}</strong><span>你的选择已生效</span></div></div>
        <p>保留清晰的选中态，过渡只在局部组件内完成，避免切换整页时的跳动。</p>
      </article>
      <article className="motion-demo">
        <div className="motion-demo-title"><span>03 / SURFACE</span><strong>面板的来源与去向</strong></div>
        <div className="motion-demo-stage motion-drawer-stage"><button type="button" aria-expanded={open} aria-controls="motion-demo-drawer" onClick={()=>setOpen(v=>!v)}>{open?'关闭面板 ×':'打开详情 ↗'}</button><div id="motion-demo-drawer" className={`motion-drawer ${open?'is-open':''}`} inert={!open}><strong>设置面板</strong><p>从右侧展开 · 层级清晰</p><span>◉　已启用</span></div></div>
        <p>进入稍慢、离开稍快，运动方向与面板位置一致；减少动画时直接显示结果。</p>
      </article>
      <article className="motion-demo">
        <div className="motion-demo-title"><span>04 / STATUS</span><strong>明确的结果反馈</strong></div>
        <div className="motion-demo-stage motion-toast-stage"><button type="button" onClick={()=>setNotice(v=>!v)}>{notice?'清除提示':'保存更改'}</button>{notice && <div role="status" className="motion-notice">✓　设置已保存</div>}</div>
        <p>提示用淡入替代夸张滑动，文字和图标都能独立传达结果。</p>
      </article>
    </div>
    <div className="motion-guideline"><strong>统一原则</strong><span>仅用 transform / opacity 表达移动与淡入；颜色与阴影做状态补充。短路径更快、较大的容器更慢。支持系统 <code>prefers-reduced-motion</code> 和网站手动覆盖设置；暂停无必要的循环动画。</span></div>
  </section>
}
