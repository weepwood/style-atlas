import assert from 'node:assert/strict'
import test from 'node:test'
import {
  getDefaultProfile, importDtcg, exportDtcg, exportCss, exportTailwind, exportWpf,
  profileFromLegacy, getDefaultSettings, contrast,
} from '../src/data/tokenSystem.ts'

const variants = [
  { id: 'notion-workspace', name: 'Document workspace', palette: ['#F7F7F5', '#222222', '#3567AF'] },
  { id: 'cyber', name: 'Cyber', palette: ['#070909', '#D5FF38', '#FF2FAC'] },
  { id: 'swiss', name: 'Swiss', palette: ['#F7F7F5', '#111111', '#D8241C'] },
]
for (const style of variants) {
  test(`DTCG import/export round trip: ${style.id}`, () => {
    const p = getDefaultProfile(style)
    p.modes.dark.radius = 22
    p.modes.light.density = 'relaxed'
    p.component.focusWidth = 5
    p.component.hoverMix = 0.22
    p.component.disabledOpacity = 0.35
    p.component.controlHeight = 42
    const dtcg = exportDtcg(p, style.name)
    const raw = JSON.parse(dtcg)
    assert.equal(raw.primitive.spacing.light.step1.$value.value, 5)
    assert.equal(raw.primitive.spacing.dark.step1.$value.value, 4)
    assert.equal(raw.primitive.radius.dark.md.$value.value, 22)
    assert.equal(raw.semantic.dark.radius.control.$value, '{primitive.radius.dark.md}')
    const actual = importDtcg(dtcg)
    assert.deepEqual(actual, p)
    const css = exportCss(actual)
    assert.match(css, /\[data-ui-mode="dark"\]/)
    assert.match(css, /--ui-focus-width: 5px/)
    assert.match(css, /\.ui-button:hover:not\(:disabled\)/)
    assert.match(css, /\.ui-button:focus-visible/)
    assert.match(css, /\.ui-button:disabled/)
    assert.match(exportTailwind(actual), /@theme inline/)
    assert.match(exportWpf(actual), /UiLightAccentColor/)
    assert.match(exportWpf(actual), /UiDarkAccentBrush/)
  })
}
test('Legacy v1 overrides are preserved in the matching mode', () => {
  const style = variants[1]
  const old = getDefaultSettings(style)
  old.radius = 17
  old.colors.accent = '#889922'
  const migrated = profileFromLegacy(old, style)
  assert.equal(migrated.modes.dark.radius, 17)
  assert.equal(migrated.modes.dark.colors.accent, '#889922')
  assert.equal(typeof migrated.modes.light.colors.text, 'string')
})
test('Import is rejected if JSON is corrupt, incomplete, inconsistent, or oversized', () => {
  const p = getDefaultProfile(variants[0])
  const raw = JSON.parse(exportDtcg(p, 'Check'))
  const brokenColor = structuredClone(raw)
  brokenColor.primitive.color.light.accent.$value.hex = 'invalid'
  const brokenAlias = structuredClone(raw)
  brokenAlias.component.light.button.primary.background.$value = '{semantic.dark.color.accent}'
  const brokenComponents = structuredClone(raw)
  delete brokenComponents.component.dark
  const wrongConfig = structuredClone(raw)
  wrongConfig.$extensions['com.style-atlas'].components.controlHeight = -100
  for (const input of ['not json', '{}', JSON.stringify(brokenColor), JSON.stringify(brokenAlias), JSON.stringify(brokenComponents), JSON.stringify(wrongConfig), ' '.repeat(512001)]) {
    assert.throws(() => importDtcg(input))
  }
})
test('Both modes remain distinct and have legible base text by default', () => {
  for (const style of variants) {
    const p = getDefaultProfile(style)
    assert.notEqual(p.modes.light.colors.canvas, p.modes.dark.colors.canvas)
    for (const mode of ['light', 'dark']) {
      assert.ok(contrast(p.modes[mode].colors.text, p.modes[mode].colors.canvas) >= 4.5)
    }
  }
})