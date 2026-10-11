# Style Atlas

基于 React、TypeScript 与 Vite 构建的前端视觉风格图鉴。项目通过实时组件展示 12 种网页视觉语言，并提供筛选、搜索、收藏、主题切换、减少动画、配色复制与 CSS Token 导出。

## 在线地址

GitHub Pages：<https://weepwood.github.io/style-atlas/>


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
