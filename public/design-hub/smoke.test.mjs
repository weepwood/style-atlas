import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const folder = resolve(import.meta.dirname);
const data = readFileSync(resolve(folder, 'data.js'), 'utf8');
const script = readFileSync(resolve(folder, 'app.js'), 'utf8');
const html = readFileSync(resolve(folder, 'index.html'), 'utf8');
const css = readFileSync(resolve(folder, 'styles.css'), 'utf8');

assert.ok(html.includes('id="view-root"'));
assert.ok(css.includes('@media(prefers-reduced-motion:reduce)'));
assert.ok(!/<script[^>]+src="https?:/.test(html), 'core scripts must be local');

const elements = new Map(), handlers = {};
const storage = new Map();
function element(id) {
  if (!elements.has(id)) {
    const node = {
      innerHTML: '', textContent: '', hidden: false, value: '', srcdoc: '', style: {},
      dataset: {}, classList: { add() {}, remove() {}, toggle() {} },
      setAttribute() {}, close() {}, addEventListener(type, fn) { handlers[id + ':' + type] = fn; },
      querySelector() { return { textContent: '' }; }
    };
    elements.set(id, node);
  }
  return elements.get(id);
}
const document = {
  getElementById: element,
  querySelectorAll() { return []; },
  addEventListener(type, fn) { handlers['doc:' + type] = fn; },
  body: { style: {}, classList: { add() {}, toggle() {} } }
};
const localStorage = {
  getItem(key) { return storage.get(key) ?? null; },
  setItem(key, value) { storage.set(key, value); }
};
const context = vm.createContext({
  document, localStorage, window: { indexedDB: null, scrollTo() {} },
  navigator: {}, URL, Blob, indexedDB: null, console, setTimeout, clearTimeout
});
new vm.Script(data, { filename: 'data.js' }).runInContext(context);
new vm.Script(script, { filename: 'app.js' }).runInContext(context);

const seedCount = vm.runInContext('SEED_RESOURCES.length', context);
assert.equal(seedCount, 31);
assert.equal(vm.runInContext('new Set(SEED_RESOURCES.map(r => r.url)).size', context), 31);
assert.equal(element('nav-total').textContent, 31);
assert.equal((element('view-root').innerHTML.match(/class="resource-card"/g) || []).length, 9);

function click(dataset) {
  handlers['doc:click']({ target: { closest() { return { dataset, hasAttribute() { return false; } }; } } });
}
click({ view: 'library' });
assert.equal((element('view-root').innerHTML.match(/class="resource-card"/g) || []).length, 31);

click({ favorite: 'seed-10' });
click({ view: 'favorites' });
assert.equal((element('view-root').innerHTML.match(/class="resource-card"/g) || []).length, 1);
assert.ok(element('view-root').innerHTML.includes('Mobbin'));

click({ view: 'library' });
handlers['doc:input']({ isComposing: false, target: { id: 'resource-search', value: 'zzzz_no_match' } });
assert.ok(element('catalog-results').innerHTML.includes('这里暂时没有匹配资源'));
handlers['doc:input']({ isComposing: false, target: { id: 'resource-search', value: 'Mobbin' } });
assert.equal((element('catalog-results').innerHTML.match(/class="resource-card"/g) || []).length, 1);

click({ detail: 'seed-10' });
click({ tab: 'analysis' });
assert.ok(element('detail-drawer').innerHTML.includes('六维设计评价'));
handlers['doc:input']({ target: { id: '', dataset: { score: '0' }, value: '5', hasAttribute(name) { return name === 'data-score'; } } });
assert.equal(element('average-score').textContent, '5.0');

click({ view: 'replica' });
assert.ok(element('workbench-frame').srcdoc.includes('--accent:'));
click({ template: 'minimal' });
assert.ok(element('workbench-frame').srcdoc.includes('background:#f9f9f8'));
assert.ok(storage.get('weepwood-design-hub-v1')?.includes('minimal'));
const fields = { name: 'My UI Reference', url: 'https://design-reference.example', category: '可复用 UI 组件', description: '自定义来源' };
handlers['resource-form:submit']({
  preventDefault() {},
  target: { elements: { namedItem(name) { return { value: fields[name] }; } }, reset() {} }
});
assert.equal(element('nav-total').textContent, 32);
assert.ok(element('view-root').innerHTML.includes('My UI Reference'));
console.log('Design Hub smoke tests passed (seed, catalog, favorite, search, analysis, replica, add resource).');