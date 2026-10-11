# Style Atlas

基于 React、TypeScript 与 Vite 构建的前端视觉风格图鉴，当前收录 30 种视觉语言。支持实时预览、点击应用全站主题、筛选、搜索、收藏、减少动画、配色复制、动效实验室与 CSS Token 导出。

主题交互：**悬停或键盘聚焦风格卡片只触发局部高亮，点击卡片才会切换整个网站主题**。应用后会记住当前选择，可通过左下角「恢复默认」清除。

## 在线地址

GitHub Pages：<https://weepwood.github.io/style-atlas/>


## 主题与动效设计扩充（2026-10-11）

- **20 → 30 种独立视觉风格**：新增 Fluent 云母、文档工作台、液态光学玻璃、半调印刷、指挥仪表盘、OLED 深夜、柔雾渐层、纸雕层叠、水墨留白、等距科技空间。
- **原主题细化**：为原有 20 种主题补充差异化的字体权重、间距、边框、材质层级和控件交互样式。
- **动效实验室**：可操作地体验按钮反馈、导航切换、抽屉展开与通知反馈；统一节奏并支持系统与手动减少动画。
- **主题操作不变**：鼠标悬停只高亮卡片；点击才应用到全站并保持选择。
- 样例及资料：`src/data/newStyles.ts`、`src/components/NewStylePreview.tsx`、`src/styles/new-style-previews.css`、`src/styles/theme-refinements.css`、`docs/MOTION-DESIGN.md`。

## 客户端 UI 风格图鉴

2026-10-11 新增客户端交互研究区，在原有网页视觉风格图鉴基础上收录 **14 组客户端设计参考**，覆盖系统设计、效率工具、企业管理、内容社区与开发工具。

- **案例库**：Apple Liquid Glass、Fluent 2、Material 3、Notion、Linear、VS Code、Figma、Ant Design、Carbon、Atlassian、Primer、Shopify Polaris、Discord、Spotify。
- **可交互预览**：切换导航、搜索示例内容、新增列表项、选择卡片、播放器操作。
- **多维检索**：按产品/规范、分类、平台、信息密度及交互方式检索。
- **横向对比**：最多选择三种风格，比较适用场景、交互特点和设计风险。
- **研究资料**：包含官方设计规范、官方产品文档、开源项目以及 Figma 资源入口。
- **实现边界**：模拟窗口是原创教学样例，展示典型布局与状态变化；不是第三方客户端的原始源代码、官方截图或 1:1 界面复制。

### 数据维护

案例数据：`src/data/clientPatterns.ts`。界面与模拟交互：`src/components/ClientAtlas.tsx`。样式：`src/components/clientAtlas.css`。

每条案例分别记录平台、信息密度、视觉特征、交互方式、适合场景、设计风险和来源。**官方设计体系**表示存在官方规范，**产品设计观察**则是基于应用公开资料提炼出的设计范式；两者不可混为一谈。增加案例时请检查原始来源、标记资料日期并遵守图像和商标的授权限制。

未来可扩展：真实产品截图（仅限获得授权的素材）、更多系统级交互案例、可视化 Token 面板、动画曲线播放器、移动/桌面断点沙盒、Figma 文件可用性审核与自动化回归测试。

## Dribbble × Figma 视觉与结构实验室（2026-10-11）

- 独立页面：<https://weepwood.github.io/style-atlas/frame-lab/>
- 12 种常见客户端视觉语言，可筛选、搜索、收藏。
- 统一 Dashboard 风格工作台，支持主题、暗色预览、密度、圆角与 CSS Token 复制。
- Figma 结构解剖台：图层选取、Auto Layout 的 Gap / Padding 调节、Frame / Component / Instance 概念。
- 组件交互实验：按钮、Tabs、开关、输入校验、弹窗和动效时长。
- 源码为 `public/frame-lab/index.html`，独立原生 HTML/CSS/JavaScript；Vite 构建时原样复制到 `dist/frame-lab/index.html`。
- Dribbble 风格属于教学归纳，非实时热榜；界面是原创示例，附相关作品与 Figma 官方学习链接。

## 个人 Design Token Studio（2026-10-11）

- 主页面的 Design Token Studio 复用现有 30 种风格作为预设，不改变原有主题选择行为。
- 7 个可调整语义色，组件圆角、信息密度、字体、动效开关；浏览器本地保存配置。
- 包含可交互的 Dashboard / 组件预览与三组 WCAG 文字对比度检查。
- 导出 CSS Variables、DTCG JSON、Tailwind CSS v4 和 WPF XAML。
- 代码：`src/data/tokenSystem.ts`、`src/components/TokenStudio.tsx`、`src/components/token-studio.css`。
- 编辑器与预览相互隔离，调整工作台 Token 不会自动覆盖网站当前主题。

## 技术栈

- React 19
- TypeScript
- Vite 8
- 原生 CSS
- GitHub Actions + GitHub Pages

## 本地开发

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
npm run preview
```

## 目录结构

```text
src/
├── components/          # 页面与风格预览组件
├── data/styles.ts       # 风格元数据、配色和 CSS Token
├── hooks/               # 可复用 React Hooks
├── types/               # TypeScript 类型
├── App.tsx              # 应用状态与页面组合
└── styles.css           # 全局视觉系统和 12 套预览样式
```

## 扩展一种新风格

1. 在 `src/data/styles.ts` 增加一条风格数据。
2. 在 `src/components/StylePreview.tsx` 增加对应的预览 JSX。
3. 在 `src/styles.css` 增加 `.preview-<id>` 和预览内部样式。
4. 根据需要把新分类加入 `categories`。

页面数量、搜索、筛选、详情、收藏和 Token 导出会自动适配新增数据。

## GitHub Pages

推送到 `main` 后，`.github/workflows/deploy.yml` 会自动执行类型检查、Vite 构建并发布 `dist`。Vite 的 `base` 已配置为 `/style-atlas/`。
