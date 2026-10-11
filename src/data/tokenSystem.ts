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

// Design Token Studio v2: modes + component states + strict, lossless Studio DTCG round-trip.
export type TokenMode = 'light' | 'dark'
export const tokenModes: TokenMode[] = ['light', 'dark']
export type ComponentSettings = {
  hoverMix: number
  focusWidth: number
  disabledOpacity: number
  controlHeight: number
}
export type TokenProfile = {
  modes: Record<TokenMode, TokenSettings>
  component: ComponentSettings
}
export const defaultComponents: ComponentSettings = { hoverMix: 0.12, focusWidth: 2, disabledOpacity: 0.5, controlHeight: 36 }

export function isTokenProfile(value: unknown): value is TokenProfile {
  if (!value || typeof value !== 'object') return false
  const p = value as Record<string, unknown>
  return !!p.modes && typeof p.modes === 'object' && !!p.component && typeof p.component === 'object'
}
function onAccent(accent: string) { return contrast('#FFFFFF', accent) >= contrast('#111111', accent) ? '#FFFFFF' : '#111111' }
export function getDefaultProfile(style: VisualStyle): TokenProfile {
  const base = getDefaultSettings(style)
  const baseIsDark = luminance(base.colors.canvas) < 0.22
  const dark: TokenSettings = {
    ...base, colors: baseIsDark ? { ...base.colors } : {
      canvas: '#121821', surface: '#1D2632', text: '#F2F4F7', muted: '#B2BECD',
      border: '#405064', accent: contrast(base.colors.accent, '#121821') >= 3 ? base.colors.accent : '#9AB7FF',
      onAccent: '#111111',
    },
  }
  dark.colors.onAccent = onAccent(dark.colors.accent)
  const light: TokenSettings = baseIsDark ? {
    ...base, colors: {
      canvas: '#F8F9FA', surface: '#FFFFFF', text: '#1C2430', muted: '#556275', border: '#C7CED8',
      accent: contrast(base.colors.accent, '#FFFFFF') >= 3 ? base.colors.accent : '#3659A3',
      onAccent: '#FFFFFF',
    },
  } : { ...base, colors: { ...base.colors } }
  light.colors.onAccent = onAccent(light.colors.accent)
  return { modes: { light, dark }, component: { ...defaultComponents } }
}
export function profileFromLegacy(settings: TokenSettings, style: VisualStyle): TokenProfile {
  const profile = getDefaultProfile(style)
  // Retain all previous user edits in the mode matching the original preset.
  const mode = luminance(settings.colors.canvas) < 0.22 ? 'dark' : 'light'
  profile.modes[mode] = settings
  return profile
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
const name = (k: string) => k.replace(/([A-Z])/g, '-$1').toLowerCase()
export function hoverColor(s: TokenSettings, component: ComponentSettings) {
  return blend(s.colors.accent, luminance(s.colors.accent) > 0.35 ? '#000000' : '#FFFFFF', component.hoverMix)
}

// Emits official-format Token objects. App-specific metadata lives under a dollar-prefixed extension group.
export function exportDtcg(profile: TokenProfile | TokenSettings, styleName: string): string {
  const p = isTokenProfile(profile) ? profile : { modes: { light: profile, dark: profile }, component: defaultComponents }
  const primitiveMode = (mode: TokenMode) => Object.fromEntries(colorRoles.map(key => [key, leaf('color', dtcgColor(p.modes[mode].colors[key]))]))
  const semanticMode = (mode: TokenMode) => ({
    color: Object.fromEntries(colorRoles.map(key => [key, leaf('color', `{primitive.color.${mode}.${key}}`)])),
    spacing: { controlGap: leaf('dimension', `{primitive.spacing.${mode}.step2}`), sectionGap: leaf('dimension', `{primitive.spacing.${mode}.step5}`) },
    radius: { control: leaf('dimension', `{primitive.radius.${mode}.md}`), card: leaf('dimension', `{primitive.radius.${mode}.lg}`) },
    typography: { fontFamily: leaf('fontFamily', `{primitive.typography.${mode}.fontFamily}`) },
    motion: { fast: leaf('duration', `{primitive.motion.${mode}.fast}`), regular: leaf('duration', `{primitive.motion.${mode}.regular}`) },
  })
  const componentMode = (mode: TokenMode) => ({
    button: { primary: {
      background: leaf('color', `{semantic.${mode}.color.accent}`),
      foreground: leaf('color', `{semantic.${mode}.color.onAccent}`),
      hoverBackground: leaf('color', dtcgColor(hoverColor(p.modes[mode], p.component))),
      focusRing: leaf('color', `{semantic.${mode}.color.accent}`),
      disabledOpacity: leaf('number', p.component.disabledOpacity),
      radius: leaf('dimension', `{semantic.${mode}.radius.control}`),
    } },
    input: {
      background: leaf('color', `{semantic.${mode}.color.surface}`),
      foreground: leaf('color', `{semantic.${mode}.color.text}`),
      border: leaf('color', `{semantic.${mode}.color.border}`),
      focusRing: leaf('color', `{semantic.${mode}.color.accent}`),
      disabledOpacity: leaf('number', p.component.disabledOpacity),
      radius: leaf('dimension', `{semantic.${mode}.radius.control}`),
    },
  })
  const doc = {
    $schema: 'https://www.designtokens.org/schemas/2025.10/format.json',
    $description: `${styleName} · Style Atlas · 双模式与组件状态`,
    $extensions: { 'com.style-atlas': {
      version: 2,
      modes: tokenModes,
      density: { light: p.modes.light.density, dark: p.modes.dark.density },
      font: { light: p.modes.light.font, dark: p.modes.dark.font },
      motion: { light: p.modes.light.motion, dark: p.modes.dark.motion },
      radius: { light: p.modes.light.radius, dark: p.modes.dark.radius },
      components: p.component,
    } },
    primitive: {
      color: { light: primitiveMode('light'), dark: primitiveMode('dark') },
      spacing: Object.fromEntries(tokenModes.map(mode => [mode, Object.fromEntries(steps(p.modes[mode]).map((size, i) => [`step${i + 1}`, dim(size)]))])),
      radius: Object.fromEntries(tokenModes.map(mode => [mode, { sm: dim(p.modes[mode].radius / 2), md: dim(p.modes[mode].radius), lg: dim(p.modes[mode].radius * 2) }])),
      typography: Object.fromEntries(tokenModes.map(mode => [mode, { fontFamily: leaf('fontFamily', fontStacks[p.modes[mode].font].split(',').map(v => v.trim().replace(/^"|"$/g, ''))),
        fontSize: { sm: dim(12), md: dim(14), lg: dim(18), title: dim(28) } }])),
      motion: Object.fromEntries(tokenModes.map(mode => [mode, { fast: leaf('duration', { value: p.modes[mode].motion ? 150 : 0, unit: 'ms' }), regular: leaf('duration', { value: p.modes[mode].motion ? 240 : 0, unit: 'ms' }) }])),
    },
    semantic: { light: semanticMode('light'), dark: semanticMode('dark') },
    component: { light: componentMode('light'), dark: componentMode('dark'),
      control: { height: dim(p.component.controlHeight), focusWidth: dim(p.component.focusWidth) } },
  }
  return JSON.stringify(doc, null, 2) + '\n'
}
function cssMode(p: TokenProfile, mode: TokenMode): string {
  const s = p.modes[mode], c = s.colors, sp = steps(s)
  return `${colorRoles.map(k => `  --ui-${name(k)}: ${c[k]};`).join('\n')}
${sp.map((v, i) => `  --ui-space-${i + 1}: ${v}px;`).join('\n')}
  --ui-radius-sm: ${Math.round(s.radius / 2)}px;
  --ui-radius-md: ${s.radius}px;
  --ui-radius-lg: ${s.radius * 2}px;
  --ui-font-family: ${fontStacks[s.font]};
  --ui-motion-fast: ${s.motion ? 150 : 0}ms;
  --ui-motion-normal: ${s.motion ? 240 : 0}ms;
  --ui-button-bg: var(--ui-accent);
  --ui-button-fg: var(--ui-on-accent);
  --ui-button-hover-bg: ${hoverColor(s, p.component)};
  --ui-input-bg: var(--ui-surface);
  --ui-input-fg: var(--ui-text);
  --ui-input-border: var(--ui-border);`
}
export function exportCss(profile: TokenProfile | TokenSettings): string {
  const p = isTokenProfile(profile) ? profile : { modes: { light: profile, dark: profile }, component: defaultComponents }
  return `/* Style Atlas UI Tokens v2 · add data-ui-mode="dark" to html for dark mode */
:root, [data-ui-mode="light"] {
${cssMode(p, 'light')}
}
[data-ui-mode="dark"] {
${cssMode(p, 'dark')}
}
:root {
  --ui-control-height: ${p.component.controlHeight}px;
  --ui-focus-width: ${p.component.focusWidth}px;
  --ui-disabled-opacity: ${p.component.disabledOpacity};
  --ui-ease: cubic-bezier(.2,.8,.2,1);
}
/* Use these reusable classes or copy the state declarations into your component library. */
.ui-button {
  min-height: var(--ui-control-height);
  background: var(--ui-button-bg);
  color: var(--ui-button-fg);
  border: 1px solid transparent;
  border-radius: var(--ui-radius-md);
  padding: 0 var(--ui-space-4);
  font-family: var(--ui-font-family);
  transition: background var(--ui-motion-fast) var(--ui-ease);
  cursor: pointer;
}
.ui-button:hover:not(:disabled) { background: var(--ui-button-hover-bg); }
.ui-button:focus-visible, .ui-input:focus-visible {
  outline: var(--ui-focus-width) solid var(--ui-accent);
  outline-offset: 2px;
}
.ui-button:disabled, .ui-input:disabled { opacity: var(--ui-disabled-opacity); cursor: not-allowed; }
.ui-input {
  min-height: var(--ui-control-height);
  background: var(--ui-input-bg);
  color: var(--ui-input-fg);
  border: 1px solid var(--ui-input-border);
  border-radius: var(--ui-radius-md);
  padding: 0 var(--ui-space-3);
  font-family: var(--ui-font-family);
}
.ui-input:hover:not(:disabled) { border-color: var(--ui-accent); }
@media (prefers-reduced-motion: reduce) {
  :root { --ui-motion-fast: 0ms; --ui-motion-normal: 0ms; }
}
`
}
export function exportTailwind(profile: TokenProfile | TokenSettings): string {
  const p = isTokenProfile(profile) ? profile : { modes: { light: profile, dark: profile }, component: defaultComponents }
  return `${exportCss(p)}
/* Tailwind CSS v4: put this alongside @import "tailwindcss" in app.css */
@theme inline {
${colorRoles.map(k => `  --color-ui-${name(k)}: var(--ui-${name(k)});`).join('\n')}
  --font-ui: var(--ui-font-family);
  --radius-ui: var(--ui-radius-md);
  --spacing-ui-control: var(--ui-control-height);
}
`
}
export function exportWpf(profile: TokenProfile | TokenSettings): string {
  const p = isTokenProfile(profile) ? profile : { modes: { light: profile, dark: profile }, component: defaultComponents }
  const nameMap: Record<ColorRole, string> = { canvas: 'Canvas', surface: 'Surface', text: 'Text', muted: 'Muted', border: 'Border', accent: 'Accent', onAccent: 'OnAccent' }
  // WPF ResourceDictionary has no CSS-style mode selector: export two explicitly keyed palettes.
  const modeColors = (mode: TokenMode) => colorRoles.map(k => `  <Color x:Key="Ui${mode === 'light' ? 'Light' : 'Dark'}${nameMap[k]}Color">${p.modes[mode].colors[k]}</Color>\n  <SolidColorBrush x:Key="Ui${mode === 'light' ? 'Light' : 'Dark'}${nameMap[k]}Brush" Color="{StaticResource Ui${mode === 'light' ? 'Light' : 'Dark'}${nameMap[k]}Color}" />`).join('\n')
  return `<!-- Style Atlas: explicitly choose UiLight* or UiDark* resources in WPF. -->
<ResourceDictionary xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation" xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" xmlns:sys="clr-namespace:System;assembly=mscorlib">
${modeColors('light')}
${modeColors('dark')}
  <CornerRadius x:Key="UiLightControlRadius">${p.modes.light.radius}</CornerRadius>
  <CornerRadius x:Key="UiDarkControlRadius">${p.modes.dark.radius}</CornerRadius>
  <Color x:Key="UiLightButtonHoverColor">${hoverColor(p.modes.light, p.component)}</Color>
  <Color x:Key="UiDarkButtonHoverColor">${hoverColor(p.modes.dark, p.component)}</Color>
  <sys:Double x:Key="UiControlHeight">${p.component.controlHeight}</sys:Double>
  <sys:Double x:Key="UiDisabledOpacity">${p.component.disabledOpacity}</sys:Double>
</ResourceDictionary>
`
}

// Intentionally reject foreign/partial DTCG files: silently fabricating missing tokens would break designs.
type Dict = Record<string, unknown>
function object(value: unknown, path: string): Dict {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${path} 应为对象`)
  return value as Dict
}
function field(parent: unknown, key: string, path: string): unknown { return object(parent, path)[key] }
function finite(value: unknown, path: string, min: number, max: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) throw new Error(`${path} 必须是 ${min}–${max} 范围内的数字`)
  return value
}
function choice<T extends string>(value: unknown, options: readonly T[], path: string): T {
  if (typeof value !== 'string' || !options.includes(value as T)) throw new Error(`${path} 不支持该值`)
  return value as T
}
function readColor(value: unknown, path: string): string {
  const leafNode = object(value, path)
  if (leafNode.$type !== 'color') throw new Error(`${path} 需要 $type: color`)
  const v = leafNode.$value
  if (typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v)) return v.toUpperCase()
  const color = object(v, `${path}.$value`)
  const raw = color.hex
  if (typeof raw !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(raw)) throw new Error(`${path} 颜色须包含有效的 #RRGGBB hex`)
  if (color.colorSpace !== 'srgb' || !Array.isArray(color.components) || color.components.length !== 3 ||
      color.components.some(n => typeof n !== 'number' || !Number.isFinite(n) || n < 0 || n > 1)) throw new Error(`${path} 颜色空间/分量非法`)
  const expected = rgb(raw).map(v => v / 255)
  if (expected.some((v, i) => Math.abs(v - (color.components as number[])[i]) > 0.00002)) throw new Error(`${path} hex 与 components 不一致`)
  return raw.toUpperCase()
}
export function importDtcg(input: string): TokenProfile {
  if (input.length > 512_000) throw new Error('文件太大（最大 500 KiB）')
  let root: Dict
  try { root = object(JSON.parse(input) as unknown, '根节点') }
  catch (e) { throw new Error(e instanceof Error ? `JSON 解析失败：${e.message}` : 'JSON 解析失败') }
  const extension = object(field(field(root, '$extensions', '$extensions'), 'com.style-atlas', '$extensions'), '$extensions.com.style-atlas')
  if (extension.version !== 2) throw new Error('只接受 Style Atlas v2 导出的 DTCG JSON；外部文件需先做格式映射')
  const primitive = object(root.primitive, 'primitive')
  const modes = {} as Record<TokenMode, TokenSettings>
  for (const mode of tokenModes) {
    const colors = {} as TokenColors
    const leafGroup = field(primitive.color, mode, `primitive.color`)
    for (const role of colorRoles) colors[role] = readColor(field(leafGroup, role, `primitive.color.${mode}`), `primitive.color.${mode}.${role}`)
    const radius = finite(field(extension.radius, mode, 'extension.radius'), `extension.radius.${mode}`, 0, 24)
    const density = choice(field(extension.density, mode, 'extension.density'), ['compact', 'balanced', 'relaxed'], `extension.density.${mode}`)
    const font = choice(field(extension.font, mode, 'extension.font'), ['sans', 'serif', 'mono'], `extension.font.${mode}`)
    const motion = field(extension.motion, mode, 'extension.motion')
    if (typeof motion !== 'boolean') throw new Error(`extension.motion.${mode} 必须为布尔值`)
    modes[mode] = { colors, radius, density, font, motion }
  }
  const c = object(extension.components, 'extension.components')
  const component = {
    hoverMix: finite(c.hoverMix, 'hoverMix', 0, 0.4),
    focusWidth: finite(c.focusWidth, 'focusWidth', 1, 6),
    disabledOpacity: finite(c.disabledOpacity, 'disabledOpacity', 0.2, 0.8),
    controlHeight: finite(c.controlHeight, 'controlHeight', 28, 60),
  }
  // Validate the semantic aliases (and component structure) exist; do not attempt to evaluate arbitrary references.
  for (const mode of tokenModes) {
    const sem = field(field(root.semantic, mode, 'semantic'), 'color', `semantic.${mode}`)
    for (const role of colorRoles) {
      const v = object(field(sem, role, `semantic.${mode}.color`), `semantic.${mode}.color.${role}`)
      if (v.$type !== 'color' || v.$value !== `{primitive.color.${mode}.${role}}`) throw new Error(`semantic.${mode}.color.${role} 引用无效`)
    }
    const comp = object(field(root.component, mode, 'component'), `component.${mode}`)
    const btn = object(field(field(comp, 'button', `component.${mode}`), 'primary', `component.${mode}.button`), `component.${mode}.button.primary`)
    const input = object(field(comp, 'input', `component.${mode}`), `component.${mode}.input`)
    const verify = (token: unknown, type: string, expected: string | number, path: string) => {
      const t = object(token, path)
      if (t.$type !== type || t.$value !== expected) throw new Error(`${path} Token 不符合该导出格式`)
    }
    verify(btn.background, 'color', `{semantic.${mode}.color.accent}`, `component.${mode}.button.primary.background`)
    verify(btn.foreground, 'color', `{semantic.${mode}.color.onAccent}`, `component.${mode}.button.primary.foreground`)
    verify(btn.focusRing, 'color', `{semantic.${mode}.color.accent}`, `component.${mode}.button.primary.focusRing`)
    verify(input.background, 'color', `{semantic.${mode}.color.surface}`, `component.${mode}.input.background`)
    verify(input.foreground, 'color', `{semantic.${mode}.color.text}`, `component.${mode}.input.foreground`)
    verify(input.border, 'color', `{semantic.${mode}.color.border}`, `component.${mode}.input.border`)
    verify(input.focusRing, 'color', `{semantic.${mode}.color.accent}`, `component.${mode}.input.focusRing`)
    verify(btn.radius, 'dimension', `{semantic.${mode}.radius.control}`, `component.${mode}.button.primary.radius`)
    verify(input.radius, 'dimension', `{semantic.${mode}.radius.control}`, `component.${mode}.input.radius`)
    verify(btn.disabledOpacity, 'number', component.disabledOpacity, `component.${mode}.button.primary.disabledOpacity`)
    verify(input.disabledOpacity, 'number', component.disabledOpacity, `component.${mode}.input.disabledOpacity`)
    if (readColor(btn.hoverBackground, `component.${mode}.button.primary.hoverBackground`) !== hoverColor(modes[mode], component)) throw new Error(`component.${mode}.button.primary.hoverBackground 与设定不一致`)
  }
  const control = object(field(root.component, 'control', 'component'), 'component.control')
  const validateDim = (token: unknown, value: number, path: string) => {
    const t = object(token, path)
    const d = object(t.$value, `${path}.$value`)
    if (t.$type !== 'dimension' || d.unit !== 'px' || d.value !== value) throw new Error(`${path} 数值不匹配`)
  }
  validateDim(control.height, component.controlHeight, 'component.control.height')
  validateDim(control.focusWidth, component.focusWidth, 'component.control.focusWidth')
  // Verify both modes are complete and the Studio extension cannot contradict its leaves.
  for (const mode of tokenModes) {
    const semantic = object(field(root.semantic, mode, 'semantic'), `semantic.${mode}`)
    if (!semantic.color) throw new Error(`semantic.${mode}.color 缺失`)
    const spacing = object(field(primitive.spacing, mode, 'primitive.spacing'), `primitive.spacing.${mode}`)
    steps(modes[mode]).forEach((value, i) => validateDim(spacing[`step${i + 1}`], value, `primitive.spacing.${mode}.step${i + 1}`))
    const radius = object(field(primitive.radius, mode, 'primitive.radius'), `primitive.radius.${mode}`)
    validateDim(radius.md, modes[mode].radius, `primitive.radius.${mode}.md`)
    validateDim(radius.lg, modes[mode].radius * 2, `primitive.radius.${mode}.lg`)
    const semSpacing = object(semantic.spacing, `semantic.${mode}.spacing`)
    const semRadius = object(semantic.radius, `semantic.${mode}.radius`)
    const tokenAlias = (token: unknown, type: string, expected: string, path: string) => {
      const t = object(token, path)
      if (t.$type !== type || t.$value !== expected) throw new Error(`${path} 引用无效`)
    }
    tokenAlias(semSpacing.controlGap, 'dimension', `{primitive.spacing.${mode}.step2}`, `semantic.${mode}.spacing.controlGap`)
    tokenAlias(semSpacing.sectionGap, 'dimension', `{primitive.spacing.${mode}.step5}`, `semantic.${mode}.spacing.sectionGap`)
    tokenAlias(semRadius.control, 'dimension', `{primitive.radius.${mode}.md}`, `semantic.${mode}.radius.control`)
    tokenAlias(semRadius.card, 'dimension', `{primitive.radius.${mode}.lg}`, `semantic.${mode}.radius.card`)
  }
  return { modes, component }
}