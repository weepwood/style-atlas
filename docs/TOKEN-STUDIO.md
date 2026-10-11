# Design Token Studio v2 — 集成指南

## 使用顺序

1. 在 Style Atlas 页面进入 **Design Token Studio**，选择风格预设。
2. 选择 **浅色 / 深色**，分别调整语义颜色、字体、间距密度与圆角；控件状态的 Hover、Focus、Disabled 参数在两种模式间共用。
3. 打开右侧的「组件」预览，用鼠标悬停、Tab 键聚焦、查看禁用态；阅读 4.5:1 文本和 3:1 焦点轮廓检测提示。这里是辅助检查，不等于 WCAG 全站合规认证。
4. **下载 DTCG JSON** 并提交到仓库，作为可回溯的主数据源；同时导出 CSS / Tailwind v4 / WPF 辅助格式。
5. 要恢复参数，从同一工作台导入自身导出的 **v2 DTCG JSON**。文件校验失败时不会覆盖原配置。出于可靠性暂不自动识别任意第三方 DTCG 方言。

## Web / Tauri / React

将导出的 `.tokens.css` 引入全局样式：

```css
@import "./notion-workspace.tokens.css";
```

HTML 默认为 light。在根元素加上 `data-ui-mode="dark"` 则使用 dark：

```js
document.documentElement.setAttribute('data-ui-mode', 'dark');
```

CSS 提供 `--ui-canvas`, `--ui-surface`, `--ui-text`, `--ui-muted`, `--ui-border`, `--ui-accent`, `--ui-on-accent`、间距、圆角、字体、动效，以及 `.ui-button` 和 `.ui-input` 的 focus-visible、hover、disabled 示例规则。**工作台的预览样式和全站主题相互隔离**。

> CSS Variables 可以在 Tauri 2 的 React WebView 中直接使用。其他前端框架可以使用相同 CSS 文件。

## Tailwind CSS v4

将导出文件的内容接到含 `@import "tailwindcss";` 的主 CSS 中。`@theme inline` 会生成如 `bg-ui-canvas`、`text-ui-text`、`rounded-ui` 等候选类；按钮交互可直接用附带的 `.ui-button` CSS 或按需迁移到现有组件系统。

## WPF

导出 `.tokens.xaml` 是单个 `ResourceDictionary`，同时具有 `UiLight*` 和 `UiDark*` 画刷键。WPF **不会**自动根据应用主题选择资源，请由应用自行决定引用 `UiLightAccentBrush` 或 `UiDarkAccentBrush`，或在代码中配置别名资源。

## DTCG v2 交换约定

- `$schema` 指向 2025.10 的格式说明；颜色叶子使用 `srgb` 的 `hex + components` 格式。
- `primitive.color.light|dark` 是实际颜色，`semantic.light|dark.color.*` 用 `{...}` 别名引用。
- `component.light|dark.button.primary`, `input` 含基本交互 Token；工作台专属的共享配置在 `$extensions.com.style-atlas` 中。
- 为确保回写行为确定，导入仅支持工作台自己生成的版本 2 结构，并检查颜色一致性、别名、组件状态和参数范围。数据不会被上传到服务器；全部在浏览器内解析。
- 已有的 `style-atlas-token-overrides-v1` 本地配置仍会保留并在编辑时按原预设的明暗模式转为 v2 结构。

## 测试

```bash
npm run test:tokens
npm run build
```

单元测试覆盖 DTCG 导入导出回环、双模式、主要状态、旧数据迁移和异常文件处理；仍需通过浏览器执行不同窗口宽度、键盘导航和实际可读性验收。