# Style Atlas

基于 React、TypeScript 与 Vite 构建的前端视觉风格图鉴。项目通过实时组件展示 12 种网页视觉语言，并提供筛选、搜索、收藏、主题切换、减少动画、配色复制与 CSS Token 导出。

## 在线地址

GitHub Pages：<https://weepwood.github.io/style-atlas/>

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
