export type PlaygroundGroup = '按钮' | '卡片' | '输入与选择' | '动效'
export interface PlaygroundDemo {
  id: string
  name: string
  group: PlaygroundGroup
  description: string
  source: string
  html: string
  css: string
}
export const playgroundGroups: PlaygroundGroup[] = ['按钮', '卡片', '输入与选择', '动效']

// All snippets below are small, self-contained original teaching examples.
// Keep the iframe sandboxed and do not accept external HTML / CSS in this registry.
export const playgroundDemos: PlaygroundDemo[] = [
  {
    id: 'glow-button', name: '光晕渐变按钮', group: '按钮',
    description: '鼠标悬停时增强边缘光晕，适合重要操作入口。',
    source: 'original',
    html: '<button class="glow-btn">Explore design <span aria-hidden="true">↗</span></button>',
    css: `.glow-btn {
  padding: 15px 23px; border: 1px solid #b2b5ff; border-radius: 14px;
  background: linear-gradient(130deg,#665df2,#8b5cf6); color: white;
  font: 650 15px system-ui; cursor: pointer;
  box-shadow: 0 6px 20px #8b5cf63d;
  transition: transform .25s, box-shadow .25s;
}
.glow-btn span { margin-left: 15px; }
.glow-btn:hover { transform: translateY(-3px); box-shadow: 0 12px 38px #8b5cf67a; }
.glow-btn:focus-visible { outline: 3px solid #c3bcff; outline-offset: 4px; }
@media (prefers-reduced-motion: reduce) { .glow-btn { transition: none; } }`
  },
  {
    id: 'outline-button', name: '轮廓填充按钮', group: '按钮',
    description: '精简的双层轮廓按钮，背景颜色在悬停时过渡。',
    source: 'original',
    html: '<button class="outline-btn">Create collection <span aria-hidden="true">＋</span></button>',
    css: `.outline-btn {
  padding: 15px 22px; border: 1px solid #94a3b8; border-radius: 10px;
  color: #273449; background: transparent; font: 600 14px system-ui;
  cursor: pointer; transition: color .2s, background .2s, border-color .2s;
}
.outline-btn span { margin-left: 14px; }
.outline-btn:hover { color: #fff; background: #273449; border-color: #273449; }
.outline-btn:focus-visible { outline: 3px solid #a3b8d2; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { .outline-btn { transition: none; } }`
  },
  {
    id: 'glass-card', name: '霜玻璃信息卡', group: '卡片',
    description: '背景模糊、半透明边缘和柔和阴影的组合。',
    source: 'original',
    html: '<article class="glass-card"><span class="eyebrow">DESIGN SYSTEM</span><h2>Liquid Surface</h2><p>Clarity meets subtle depth.</p><span class="glass-tag">Explore →</span></article>',
    css: `.glass-card {
  width: min(260px,90vw); padding: 23px; border-radius: 22px;
  background: #ffffff96; border: 1px solid #fff;
  box-shadow: 0 18px 48px #25385b20;
  backdrop-filter: blur(18px) saturate(1.5); color: #243148;
}
.glass-card .eyebrow { letter-spacing: .16em; color: #526783; font: 700 10px system-ui; }
.glass-card h2 { margin: 18px 0 5px; font: 700 23px system-ui; letter-spacing: -.04em; }
.glass-card p { margin: 0 0 26px; font: 13px system-ui; color: #546479; }
.glass-tag { display: inline-block; border-radius: 99px; padding: 8px 12px; background: #fff9; font: 600 11px system-ui; }`
  },
  {
    id: 'editorial-card', name: '编辑排版卡片', group: '卡片',
    description: '强调字号比例、标签秩序与高对比排版。',
    source: 'original',
    html: '<article class="editorial"><header><span>NO. 004</span><span>UI / 2026</span></header><h2>FORM<br>FOLLOWS<br>IDEA<span>.</span></h2><footer>STUDIES IN VISUAL LANGUAGE ↗</footer></article>',
    css: `.editorial {
  width: 272px; padding: 19px; background: #f3ede2; color: #202020; border-radius: 3px;
  box-shadow: 0 10px 30px #0000001c;
}
.editorial header { display: flex; justify-content: space-between; font: 700 10px monospace; }
.editorial h2 { margin: 33px 0 37px; font: 900 35px/0.96 Arial,sans-serif; letter-spacing: -.06em; }
.editorial h2 span { color: #df6540; }
.editorial footer { border-top: 1px solid #333; padding-top: 10px; font: 700 9px monospace; }`
  },
  {
    id: 'pill-switch', name: '弹性胶囊开关', group: '输入与选择',
    description: '仅使用 CSS 的原生复选框，完整保留键盘与语义。',
    source: 'original',
    html: '<label class="switch-label"><input type="checkbox" checked><span class="track" aria-hidden="true"></span><span>Enable effects</span></label>',
    css: `.switch-label { display:flex; align-items:center; gap:12px; cursor:pointer; font:600 14px system-ui; color:#273449; }
.switch-label input { position:absolute; opacity:0; width:1px; height:1px; }
.switch-label .track { position:relative; width:56px; height:31px; border-radius:99px; background:#bdc6d5; transition:background .2s; }
.switch-label .track::before { content:""; position:absolute; top:4px; left:4px; width:23px; height:23px; border-radius:50%; background:white; box-shadow:0 2px 7px #0002; transition:transform .2s; }
.switch-label input:checked + .track { background:#665df2; }
.switch-label input:checked + .track::before { transform:translateX(25px); }
.switch-label input:focus-visible + .track { outline:3px solid #a99ff9; outline-offset:3px; }
@media (prefers-reduced-motion: reduce) { .switch-label .track, .switch-label .track::before { transition:none; } }`
  },
  {
    id: 'gradient-loader', name: '柔和脉冲加载器', group: '动效',
    description: '低开销 CSS 脉冲动画，兼容系统减少动态效果。',
    source: 'original',
    html: '<div class="pulse" role="status" aria-label="正在加载"><span></span><span></span><span></span><strong>Loading</strong></div>',
    css: `.pulse { display:flex; align-items:center; gap:8px; font:700 13px system-ui; color:#35415f; }
.pulse span { display:block; width:10px; height:10px; border-radius:50%; background:#7463ea; animation:breathe 1.2s ease-in-out infinite; }
.pulse span:nth-child(2) { animation-delay:.16s; }
.pulse span:nth-child(3) { animation-delay:.32s; }
.pulse strong { margin-left:10px; }
@keyframes breathe { 0%,60%,100% { transform:scale(.65); opacity:.45; } 30% { transform:scale(1); opacity:1; } }
@media (prefers-reduced-motion:reduce) { .pulse span { animation:none; } }`
  },
]

export function createPlaygroundDocument(demo: PlaygroundDemo, dark: boolean, reducedMotion: boolean): string {
  // Source registry is trusted and static. Never pass arbitrary user strings to this function.
  const background = dark ? '#171b28' : '#e3ebf7'
  const foreground = dark ? '#f1f2f7' : '#273449'
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
*{box-sizing:border-box}body{min-height:100vh;margin:0;display:grid;place-items:center;padding:24px;font-family:system-ui;color:${foreground};background:radial-gradient(circle at 30% 20%,#b4a7ee60,transparent 58%),${background}}
${reducedMotion ? '*,*::before,*::after{animation:none!important;transition:none!important}' : ''}
${demo.css}
</style></head><body>${demo.html}</body></html>`
}
