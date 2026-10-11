import { useMemo, useState, type CSSProperties } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { VisualStyle } from '../types/style'
import {
  colorRoles, contrast, exportCss, exportDtcg, exportTailwind, exportWpf,
  getDefaultSettings, roleLabels, type ColorRole, type Density, type FontChoice, type TokenSettings,
} from '../data/tokenSystem'
import './token-studio.css'

type Format = 'css' | 'dtcg' | 'tailwind' | 'wpf'
const formats: { id: Format; name: string; ext: string }[] = [
  { id: 'css', name: 'CSS Variables', ext: 'css' },
  { id: 'dtcg', name: 'DTCG JSON', ext: 'json' },
  { id: 'tailwind', name: 'Tailwind v4', ext: 'css' },
  { id: 'wpf', name: 'WPF XAML', ext: 'xaml' },
]
const formatName: Record<Format, string> = { css: 'CSS Variables', dtcg: 'DTCG JSON', tailwind: 'Tailwind CSS v4', wpf: 'WPF ResourceDictionary' }

export function TokenStudio({ styles, selectedThemeId }: { styles: VisualStyle[]; selectedThemeId: string | null }) {
  const [chosenId, setChosenId] = useLocalStorage('style-atlas-token-style', 'notion-workspace')
  const [overrides, setOverrides] = useLocalStorage<Record<string, TokenSettings>>('style-atlas-token-overrides-v1', {})
  const [format, setFormat] = useState<Format>('css')
  const [previewTab, setPreviewTab] = useState<'overview' | 'components'>('overview')
  const [createdTask, setCreatedTask] = useState(false)
  const [checkedTasks, setCheckedTasks] = useState<string[]>(['Structure'])
  const [message, setMessage] = useState('')

  const style = styles.find(v => v.id === chosenId) ?? styles[0]
  const settings = overrides[style.id] ?? getDefaultSettings(style)
  const selectedAppliedStyle = selectedThemeId ? styles.find(v => v.id === selectedThemeId) : null
  const css = useMemo(() => exportCss(settings), [settings])
  const fileText = useMemo(() => ({ css, dtcg: exportDtcg(settings, style.name), tailwind: exportTailwind(settings), wpf: exportWpf(settings) }), [css, settings, style.name])
  const checks = [
    { name: '正文 / 页面', score: contrast(settings.colors.text, settings.colors.canvas), threshold: 4.5 },
    { name: '正文 / 卡片', score: contrast(settings.colors.text, settings.colors.surface), threshold: 4.5 },
    { name: '按钮 / 文字', score: contrast(settings.colors.onAccent, settings.colors.accent), threshold: 4.5 },
  ]
  const edit = (patch: Partial<TokenSettings>) => {
    setOverrides(current => ({ ...current, [style.id]: { ...settings, ...patch } }))
  }
  const updateColor = (role: ColorRole, value: string) => edit({ colors: { ...settings.colors, [role]: value } })
  const reset = () => {
    setOverrides(current => { const next = { ...current }; delete next[style.id]; return next })
    setMessage('已恢复该风格的默认 Token')
  }
  const copy = async () => {
    try { await navigator.clipboard.writeText(fileText[format]); setMessage(`已复制 ${formatName[format]}`) }
    catch { setMessage('复制被浏览器阻止，请使用下载按钮') }
  }
  const download = () => {
    const ext = formats.find(v => v.id === format)?.ext ?? 'txt'
    const blob = new Blob([fileText[format]], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `${style.id}.tokens.${ext}`
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
    setMessage(`已生成 ${style.id}.tokens.${ext}`)
  }
  const applyAtlasTheme = () => {
    if (selectedAppliedStyle) { setChosenId(selectedAppliedStyle.id); setMessage(`已载入 ${selectedAppliedStyle.name} 的设计参数`) }
  }
  const previewVars = {
    '--ts-canvas': settings.colors.canvas, '--ts-surface': settings.colors.surface,
    '--ts-ink': settings.colors.text, '--ts-muted': settings.colors.muted,
    '--ts-border': settings.colors.border, '--ts-accent': settings.colors.accent,
    '--ts-on-accent': settings.colors.onAccent,
    '--ts-radius': `${settings.radius}px`, '--ts-card-radius': `${settings.radius * 2}px`,
    '--ts-gap': settings.density === 'compact' ? '10px' : settings.density === 'relaxed' ? '21px' : '15px',
    '--ts-font': settings.font === 'serif' ? 'Georgia, "Songti SC", serif' : settings.font === 'mono' ? 'Consolas, monospace' : 'Inter, "Microsoft YaHei", system-ui, sans-serif',
    '--ts-time': settings.motion ? '180ms' : '0ms',
  } as CSSProperties
  const taskNames = [...(createdTask ? ['Review tokens'] : []), 'Structure', 'Design review', 'Interaction', 'Accessibility']
  const toggleTask = (task: string) => setCheckedTasks(v => v.includes(task) ? v.filter(t => t !== task) : [...v, task])

  return (
    <section id="token-studio" className="token-studio" aria-labelledby="token-studio-title">
      <header className="token-studio-heading">
        <div>
          <p className="ts-eyebrow"><span className="ts-live-dot" /> DESIGN SYSTEM / 01 — PERSONAL WORKSPACE</p>
          <h2 id="token-studio-title">把审美偏好，变成可以复用的设计语言<span>。</span></h2>
          <p className="ts-intro">选择风格、调整变量，在真实组件中即时验证，再导出到 React、Tauri、Tailwind 或 WPF 项目。不再从零重复调色与排版。</p>
        </div>
        <div className="ts-title-aside" aria-label="Design Token 层级">
          <span>01 / PRIMITIVE</span><i /> <span>02 / SEMANTIC</span><i /> <span>03 / COMPONENT</span>
        </div>
      </header>

      <div className="ts-toolbar">
        <label className="ts-preset-picker" htmlFor="ts-preset">
          <span>当前风格预设</span>
          <select id="ts-preset" value={style.id} onChange={e => { setChosenId(e.target.value); setCreatedTask(false); setMessage('') }}>
            {styles.map(v => <option key={v.id} value={v.id}>{v.name} · {v.en}</option>)}
          </select>
        </label>
        <div className="ts-palette-mini" aria-hidden="true">{colorRoles.slice(0, 6).map(key => <i key={key} style={{ background: settings.colors[key] }} />)}</div>
        <span className="ts-preset-count">{styles.length} 套基础风格 / 本地定制</span>
        {selectedAppliedStyle && <button className="ts-link-button" type="button" onClick={applyAtlasTheme}>载入全站当前主题 ↗</button>}
        <button className="ts-link-button" type="button" onClick={reset}>↺ 重置当前风格</button>
      </div>

      <div className="ts-workbench">
        <div className="ts-editor">
          <div className="ts-pane-heading"><div><span>01 / FOUNDATION</span><h3>设计变量</h3></div><small>修改自动保存于浏览器</small></div>
          <div className="ts-control-title"><strong>语义色彩</strong><span>7 TOKENS</span></div>
          <div className="ts-color-grid">
            {colorRoles.map(role => <label className="ts-color-control" key={role}>
              <input type="color" aria-label={`设置${roleLabels[role]}`} value={settings.colors[role]} onChange={e => updateColor(role, e.target.value.toUpperCase())} />
              <span><strong>{roleLabels[role]}</strong><code>{settings.colors[role]}</code></span>
            </label>)}
          </div>
          <div className="ts-control-title ts-divider-title"><strong>尺寸与密度</strong><span>LAYOUT</span></div>
          <label className="ts-field-row"><span>组件圆角 <code>{settings.radius}px</code></span><input type="range" min="0" max="24" step="2" value={settings.radius} onChange={e => edit({ radius: Number(e.target.value) })} /></label>
          <label className="ts-field-row"><span>布局密度</span><select value={settings.density} onChange={e => edit({ density: e.target.value as Density })}><option value="compact">紧凑 · Compact</option><option value="balanced">平衡 · Balanced</option><option value="relaxed">宽松 · Relaxed</option></select></label>
          <label className="ts-field-row"><span>字体气质</span><select value={settings.font} onChange={e => edit({ font: e.target.value as FontChoice })}><option value="sans">无衬线 · Sans</option><option value="serif">衬线 · Editorial</option><option value="mono">等宽 · Monospace</option></select></label>
          <label className="ts-switch-line"><span>界面过渡效果<small>遵守系统减少动画设置</small></span><input type="checkbox" checked={settings.motion} onChange={e => edit({ motion: e.target.checked })} /></label>
          <div className="ts-contrast-box"><div className="ts-control-title"><strong>文字对比度检查</strong><span>WCAG AA / 4.5:1</span></div>
            {checks.map(v => <div key={v.name} className="ts-contrast-row"><span>{v.name}</span><code>{v.score.toFixed(2)}:1</code><b className={v.score >= v.threshold ? 'ts-pass' : 'ts-fail'}>{v.score >= v.threshold ? '通过' : '偏低'}</b></div>)}
            <small>仅检查以上三组文字组合；完整无障碍验收仍需覆盖所有状态和图形控件。</small>
          </div>
        </div>

        <div className="ts-preview-panel">
          <div className="ts-preview-heading"><div><span>02 / LIVE PREVIEW</span><h3>真实组件环境</h3></div><div className="ts-preview-legend"><i /> 实时渲染</div></div>
          <div className="ts-stage-wrap">
            <div className="ts-stage" style={previewVars}>
              <div className="ts-window-bar"><div className="ts-window-dots"><i /><i /><i /></div><span>ATLAS STUDIO</span><span>↗ &nbsp; ◻ &nbsp; ×</span></div>
              <div className="ts-app-shell">
                <nav className="ts-app-sidebar" aria-label="组件预览菜单">
                  <div className="ts-app-logo"><span>◈</span> halcyon <small>PRO</small></div>
                  <div className="ts-side-caption">WORKSPACE</div>
                  <button className={previewTab === 'overview' ? 'current' : ''} onClick={() => setPreviewTab('overview')} type="button">◫ <span>概览</span></button>
                  <button className={previewTab === 'components' ? 'current' : ''} onClick={() => setPreviewTab('components')} type="button">▤ <span>组件</span></button>
                  <div className="ts-side-caption">PROJECTS</div><div className="ts-side-link">◇ &nbsp; Brand refresh</div><div className="ts-side-link">◇ &nbsp; Design system</div>
                  <div className="ts-side-profile"><div className="ts-avatar">W</div><span>My workspace<small>Free account</small></span><span>⌄</span></div>
                </nav>
                <main className="ts-app-main">
                  <div className="ts-app-top"><span>Workspace <b>/</b> {previewTab === 'overview' ? 'Overview' : 'Components'}</span><span>⌕ &nbsp; ◯</span></div>
                  {previewTab === 'overview' ? <>
                    <div className="ts-hero-title"><div><small>MONDAY · OCT 2026</small><h4>Good afternoon <span>✳</span></h4><p>精心整理每个想法，让设计持续进化。</p></div><button type="button" className="ts-primary-btn" onClick={() => setCreatedTask(true)}>{createdTask ? '✓ 已创建' : '+ 新建任务'}</button></div>
                    <div className="ts-stat-grid"><div><small>进行中项目</small><strong>12</strong><span>↗ +8.2% <em>本周</em></span></div><div><small>设计组件</small><strong>248</strong><span>↗ +12 <em>新增</em></span></div><div><small>完成进度</small><strong>86<span>%</span></strong><div className="ts-progress"><i /></div></div></div>
                    <div className="ts-task-card"><div className="ts-task-title"><div><strong>本周待办</strong><small>{checkedTasks.length} / {taskNames.length} 已完成</small></div><span>•••</span></div>
                      {taskNames.map((task, i) => <label key={task} className="ts-task-item"><input type="checkbox" checked={checkedTasks.includes(task)} onChange={() => toggleTask(task)} /><span className={checkedTasks.includes(task) ? 'done' : ''}>{task}</span><small>{i < 2 ? 'Today' : 'Upcoming'}</small></label>)}
                    </div>
                  </> : <div className="ts-components-page"><h4>组件状态</h4><p>真实按钮、输入框、徽标与反馈状态同步继承 Token。</p><div className="ts-component-demo"><button type="button" className="ts-primary-btn" onClick={() => setMessage('预览按钮已触发')}>Primary action</button><button type="button" className="ts-secondary-btn" onClick={() => setMessage('次级按钮已触发')}>Secondary</button><span className="ts-demo-badge">● Active</span></div><input type="text" placeholder="Try typing a component label..." aria-label="示例输入框" /><div className="ts-demo-note">✦ 设计组件的语义色、圆角、密度与字体都与左侧设置同步。</div></div>}
                </main>
              </div>
            </div>
          </div>
          <div className="ts-preview-footer"><span><i /> CSS Variables 绑定预览 · 不影响网站当前主题</span><span>{style.en} / {settings.density}</span></div>
        </div>
      </div>

      <div className="ts-export-panel">
        <div className="ts-export-info"><span>03 / DELIVERABLE</span><h3>一次配置，多端复用。</h3><p>基础 Token、语义映射和组件引用均可导出。推荐将 DTCG JSON 作为设计系统的主数据源。</p></div>
        <div className="ts-export-code">
          <div className="ts-format-tabs" role="tablist" aria-label="Token 导出格式">{formats.map(v => <button key={v.id} role="tab" type="button" aria-selected={format === v.id} onClick={() => setFormat(v.id)}>{v.name}</button>)}</div>
          <pre aria-label={`${formatName[format]} 代码预览`}><code>{fileText[format].split('\n').slice(0, 18).join('\n')}{fileText[format].split('\n').length > 18 ? '\n…' : ''}</code></pre>
          <div className="ts-export-actions"><span>{formatName[format]} · {fileText[format].split('\n').length} 行</span><button type="button" onClick={copy}>复制完整代码 ↗</button><button type="button" onClick={download}>↓ 下载文件</button></div>
        </div>
      </div>
      <p className="ts-status" role="status" aria-live="polite">{message || '所有定制保存在此浏览器中；导出的 Token 文件可提交到 Git 仓库统一管理。'}</p>
    </section>
  )
}