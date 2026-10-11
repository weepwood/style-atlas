import type { VisualStyle } from '../types/style'

export const colorRoles = ['canvas', 'surface', 'text', 'muted', 'border', 'accent', 'onAccent'] as const
export type ColorRole = typeof colorRoles[number]
export type TokenColors = Record<ColorRole, string>
export type Density = 'compact' | 'balanced' | 'relaxed'
export type FontChoice = 'sans' | 'serif' | 'mono'
export type TokenSettings = { colors: TokenColors; radius: number; density: Density; font: FontChoice; motion: boolean }

export const roleLabels: Record<ColorRole, string> = {
  canvas: '页面底色', surface: '容器表面', text: '主要文字', muted: '次要文字',
  border: '分割与边框', accent: '品牌强调', onAccent: '强调色文字',
}

const curated: Record<string, TokenColors> = {
  'notion-workspace': { canvas: '#F7F7F5', surface: '#FFFFFF', text: '#292929', muted: '#666666', border: '#E5E5E2', accent: '#2F65B9', onAccent: '#FFFFFF' },
  'fluent-mica': { canvas: '#E8EDF7', surface: '#FFFFFF', text: '#202E45', muted: '#52637D', border: '#C7D2E2', accent: '#2E64A5', onAccent: '#FFFFFF' },
  'command': { canvas: '#0C1724', surface: '#152538', text: '#DDE8F2', muted: '#9CB1C5', border: '#2C4257', accent: '#38D1BE', onAccent: '#092323' },
  'editorial': { canvas: '#F2EEE5', surface: '#FFFFFF', text: '#1B1B19', muted: '#645F58', border: '#CFC9BD', accent: '#C34423', onAccent: '#FFFFFF' },
  'cyber': { canvas: '#070909', surface: '#161C1A', text: '#F1F5EC', muted: '#A1BAAA', border: '#365038', accent: '#D5FF38', onAccent: '#101010' },
  'oled': { canvas: '#050505', surface: '#161616', text: '#E4E4E4', muted: '#AEAEAE', border: '#383838', accent: '#88F4C2', onAccent: '#111111' },
  'swiss': { canvas: '#F7F7F5', surface: '#FFFFFF', text: '#111111', muted: '#5D5D58', border: '#C9C9C5', accent: '#D8241C', onAccent: '#FFFFFF' },
  'halftone': { canvas: '#F2EFE4', surface: '#FFFFFF', text: '#162D5A', muted: '#475C7C', border: '#BCC4CE', accent: '#B9492F', onAccent: '#FFFFFF' },
}

function rgb(hex: string): [number, number, number] {
  const value = hex.replace('#', '')
  return [0, 2, 4].map(i => parseInt(value.slice(i, i + 2), 16)) as [number, number, number]
}
function hex([r, g, b]: number[]): string {
  return '#' + [r, g, b].map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('').toUpperCase()
}
function blend(a: string, b: string, portion: number): string {
  const x = rgb(a), y = rgb(b)
  return hex(x.map((v, i) => v * (1 - portion) + y[i] * portion))
}
function luminance(c: string): number {
  const linear = rgb(c).map(v => { const s = v / 255; return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4 })
  return .2126 * linear[0] + .7152 * linear[1] + .0722 * linear[2]
}
export function contrast(a: string, b: string): number {
  const x = luminance(a), y = luminance(b)
  return (Math.max(x, y) + .05) / (Math.min(x, y) + .05)
}
function accentColor(colors: string[], canvas: string, fallback: string): string {
  const candidates = colors.filter(v => /^#[0-9a-f]{6}$/i.test(v) && contrast(v, canvas) >= 2.8)
  const chroma = (v: string) => { const c = rgb(v); return Math.max(...c) - Math.min(...c) }
  return candidates.sort((a, b) => chroma(b) - chroma(a))[0] || fallback
}
export function getDefaultSettings(style: VisualStyle): TokenSettings {
  const colors = curated[style.id]
  if (colors) return {
    colors: { ...colors }, radius: style.id === 'swiss' ? 2 : style.id === 'editorial' ? 4 : style.id === 'cyber' ? 6 : 12,
    density: ['command', 'oled'].includes(style.id) ? 'compact' : 'balanced',
    font: style.id === 'editorial' ? 'serif' : style.id === 'cyber' ? 'mono' : 'sans', motion: true,
  }
  const valid = style.palette.filter(c => /^#[0-9a-f]{6}$/i.test(c))
  const canvas = valid[0] ?? '#F7F7F7'
  const text = contrast('#17191E', canvas) > contrast('#F5F7FA', canvas) ? '#17191E' : '#F5F7FA'
  const surface = blend(canvas, text, luminance(canvas) > .4 ? .035 : .09)
  const accent = accentColor(valid.slice(1), canvas, luminance(canvas) > .4 ? '#3655A9' : '#8B9DFF')
  return { colors: { canvas, surface, text, muted: blend(text, canvas, .34), border: blend(text, canvas, .80), accent,
    onAccent: contrast('#FFFFFF', accent) >= contrast('#111111', accent) ? '#FFFFFF' : '#111111' },
    radius: 12, density: 'balanced', font: 'sans', motion: true }
}

const fontStacks: Record<FontChoice, string> = {
  sans: 'Inter, "Noto Sans SC", "Microsoft YaHei", system-ui, sans-serif',
  serif: 'Georgia, "Noto Serif SC", "Songti SC", serif',
  mono: '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
}
const densitySteps: Record<Density, number> = { compact: 0.75, balanced: 1, relaxed: 1.25 }
function steps(s: TokenSettings) { return [4, 8, 12, 16, 24, 32].map(v => Math.round(v * densitySteps[s.density])) }
function dtcgColor(color: string) { return { colorSpace: 'srgb', components: rgb(color).map(v => Number((v / 255).toFixed(5))), hex: color.toUpperCase() } }
function dim(value: number) { return { $type: 'dimension', $value: { value, unit: 'px' } } }
function leaf(type: string, value: unknown) { return { $type: type, $value: value } }

export function exportDtcg(s: TokenSettings, styleName: string): string {
  const c = s.colors, spacing = steps(s)
  const primitiveColors = Object.fromEntries(colorRoles.map(key => [key, leaf('color', dtcgColor(c[key]))]))
  const semanticColors = Object.fromEntries(colorRoles.map(key => [key, leaf('color', `{primitive.color.${key}}`)]))
  const doc = {
    $schema: 'https://www.designtokens.org/schemas/2025.10/format.json',
    $description: `${styleName} · Style Atlas 导出 · DTCG 2025.10`,
    primitive: {
      color: primitiveColors,
      spacing: Object.fromEntries(spacing.map((size, i) => [`${i + 1}`, dim(size)])),
      radius: { sm: dim(Math.max(0, Math.round(s.radius / 2))), md: dim(s.radius), lg: dim(s.radius * 2) },
      typography: { fontFamily: leaf('fontFamily', fontStacks[s.font].split(',').map(v => v.trim().replace(/^"|"$/g, ''))),
        fontSize: { sm: dim(12), md: dim(14), lg: dim(18), title: dim(28) } },
      motion: { fast: leaf('duration', { value: s.motion ? 150 : 0, unit: 'ms' }), regular: leaf('duration', { value: s.motion ? 240 : 0, unit: 'ms' }) },
    },
    semantic: {
      color: semanticColors,
      spacing: { controlGap: leaf('dimension', '{primitive.spacing.2}'), sectionGap: leaf('dimension', '{primitive.spacing.5}') },
      radius: { control: leaf('dimension', '{primitive.radius.md}'), card: leaf('dimension', '{primitive.radius.lg}') },
    },
    component: {
      button: { primary: { background: leaf('color', '{semantic.color.accent}'), text: leaf('color', '{semantic.color.onAccent}'),
        radius: leaf('dimension', '{semantic.radius.control}') } },
      card: { background: leaf('color', '{semantic.color.surface}'), text: leaf('color', '{semantic.color.text}'),
        border: leaf('color', '{semantic.color.border}'), radius: leaf('dimension', '{semantic.radius.card}') },
      input: { background: leaf('color', '{semantic.color.surface}'), border: leaf('color', '{semantic.color.border}') },
    },
  }
  return JSON.stringify(doc, null, 2) + '\n'
}

export function exportCss(s: TokenSettings): string {
  const sp = steps(s), c = s.colors
  return `/* Style Atlas · 可复制到任意网页项目 */\n:root {\n${colorRoles.map(k => `  --ui-primitive-${k}: ${c[k]};`).join('\n')}\n${sp.map((v, i) => `  --ui-space-${i + 1}: ${v}px;`).join('\n')}\n  --ui-radius-sm: ${Math.round(s.radius / 2)}px;\n  --ui-radius-md: ${s.radius}px;\n  --ui-radius-lg: ${s.radius * 2}px;\n  --ui-font-family: ${fontStacks[s.font]};\n  --ui-motion-fast: ${s.motion ? 150 : 0}ms;\n  --ui-motion-normal: ${s.motion ? 240 : 0}ms;\n  --ui-ease: cubic-bezier(.2, .8, .2, 1);\n${colorRoles.map(k => `  --ui-${k}: var(--ui-primitive-${k});`).join('\n')}\n  --ui-button-bg: var(--ui-accent);\n  --ui-button-text: var(--ui-onAccent);\n  --ui-card-bg: var(--ui-surface);\n  --ui-card-radius: var(--ui-radius-lg);\n}\n@media (prefers-reduced-motion: reduce) {\n  :root { --ui-motion-fast: 0ms; --ui-motion-normal: 0ms; }\n}\n`
}
export function exportTailwind(s: TokenSettings): string {
  return `${exportCss(s)}\n/* Tailwind CSS v4: 在 app.css 引入 Tailwind 后添加 */\n@theme inline {\n${colorRoles.map(k => `  --color-ui-${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: var(--ui-${k});`).join('\n')}\n  --font-ui: var(--ui-font-family);\n  --radius-ui: var(--ui-radius-md);\n}\n`
}
export function exportWpf(s: TokenSettings): string {
  const map = { canvas: 'Canvas', surface: 'Surface', text: 'Text', muted: 'Muted', border: 'Border', accent: 'Accent', onAccent: 'OnAccent' } as const
  return `<!-- Style Atlas / WPF ResourceDictionary：Color 与 SolidColorBrush -->\n<ResourceDictionary xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"\n                    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml">\n${colorRoles.map(k => `  <Color x:Key="Ui${map[k]}Color">${s.colors[k]}</Color>\n  <SolidColorBrush x:Key="Ui${map[k]}Brush" Color="{StaticResource Ui${map[k]}Color}" />`).join('\n')}\n  <CornerRadius x:Key="UiControlRadius">${s.radius}</CornerRadius>\n  <CornerRadius x:Key="UiCardRadius">${s.radius * 2}</CornerRadius>\n</ResourceDictionary>\n`
}