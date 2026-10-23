import { useMemo, useState } from 'react'
import { createPlaygroundDocument, playgroundDemos, playgroundGroups } from '../data/playgroundDemos'
import type { PlaygroundGroup } from '../data/playgroundDemos'

export function ComponentPlayground({ reducedMotion }: { reducedMotion: boolean }) {
  const [group, setGroup] = useState<PlaygroundGroup | '全部'>('全部')
  const [selectedId, setSelectedId] = useState(playgroundDemos[0].id)
  const [dark, setDark] = useState(false)
  const [codeTab, setCodeTab] = useState<'html' | 'css'>('css')
  const [message, setMessage] = useState('')

  const demos = useMemo(() => playgroundDemos.filter((item) => group === '全部' || item.group === group), [group])
  const selected = playgroundDemos.find((item) => item.id === selectedId) || playgroundDemos[0]
  const selectedCode = codeTab === 'css' ? selected.css : selected.html

  function selectGroup(value: PlaygroundGroup | '全部') {
    setGroup(value)
    if (value !== '全部' && selected.group !== value) {
      const next = playgroundDemos.find((item) => item.group === value)
      if (next) setSelectedId(next.id)
    }
  }

  async function copySnippet() {
    try {
      await navigator.clipboard.writeText(selectedCode)
      setMessage((codeTab === 'css' ? 'CSS' : 'HTML') + ' 已复制')
    } catch {
      setMessage('复制失败：浏览器未授权剪贴板，可选中下方代码手动复制。')
    }
  }

  return (
    <section className="component-lab" id="component-lab" aria-labelledby="component-lab-title">
      <header className="component-lab-intro">
        <div>
          <p className="eyebrow">UI / EFFECTS · INTERACTIVE LAB</p>
          <h2 id="component-lab-title">从喜欢的设计，到可运行的元素。</h2>
          <p>这 6 个示例是为收藏馆独立编写的 HTML/CSS 教学实现，不直接复制参考网站源码。选择左侧条目，在隔离预览中体验交互并复制代码。</p>
        </div>
        <a href="https://github.com/weepwood/ui-elements-showcase" target="_blank" rel="noopener noreferrer">参考 UI Elements Showcase ↗</a>
      </header>
      <div className="component-lab-layout">
        <div className="component-lab-library">
          <div className="component-lab-tabs" aria-label="示例分类">
            {(['全部', ...playgroundGroups] as const).map((value) => (
              <button key={value} type="button" aria-pressed={group === value} onClick={() => selectGroup(value)}>{value}</button>
            ))}
          </div>
          <div className="component-lab-list" aria-label="可运行的 UI 示例">
            {demos.map((demo) => (
              <button key={demo.id} type="button" className="component-lab-list-item" aria-pressed={selected.id === demo.id} onClick={() => { setSelectedId(demo.id); setMessage('') }}>
                <span className="component-lab-list-icon" aria-hidden="true">{demo.group === '按钮' ? '↗' : demo.group === '卡片' ? '▧' : demo.group === '动效' ? '◌' : '◐'}</span>
                <span><strong>{demo.name}</strong><small>{demo.group} · 独立实现</small></span><span aria-hidden="true">›</span>
              </button>
            ))}
          </div>
          <p className="component-lab-hint">示例在无脚本沙盒中渲染，不会执行从外部网站抓取的代码。</p>
        </div>
        <div className="component-lab-workbench">
          <div className="component-lab-workbench-header">
            <div><small>LIVE PREVIEW / {selected.group}</small><h3>{selected.name}</h3></div>
            <button type="button" aria-pressed={dark} onClick={() => setDark((value) => !value)}>{dark ? '☀ 浅色背景' : '☾ 深色背景'}</button>
          </div>
          <div className="component-lab-canvas">
            <iframe title={selected.name + ' HTML CSS 安全交互预览'} sandbox="" referrerPolicy="no-referrer" srcDoc={createPlaygroundDocument(selected, dark, reducedMotion)} />
          </div>
          <div className="component-lab-code-heading">
            <div className="component-lab-code-tabs" aria-label="代码类型">
              <button type="button" aria-pressed={codeTab === 'html'} onClick={() => { setCodeTab('html'); setMessage('') }}>HTML</button>
              <button type="button" aria-pressed={codeTab === 'css'} onClick={() => { setCodeTab('css'); setMessage('') }}>CSS</button>
            </div>
            <button className="component-lab-copy" type="button" onClick={() => void copySnippet()}>复制 {codeTab.toUpperCase()} ↗</button>
          </div>
          <pre className="component-lab-code" tabIndex={0}><code>{selectedCode}</code></pre>
          <div className="component-lab-bottom"><p>{selected.description}</p><span role="status" aria-live="polite">{message}</span></div>
        </div>
      </div>
    </section>
  )
}
