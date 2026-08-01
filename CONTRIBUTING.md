# 参与扩展 Style Atlas

Style Atlas 采用数据与预览组件分离的结构，新增视觉风格时不需要修改筛选、搜索、收藏或详情逻辑。

## 新增风格

1. 在 `src/data/styles.ts` 中添加 `VisualStyle` 数据。
2. 在 `src/components/StylePreview.tsx` 中增加对应的实时预览结构。
3. 在 `src/styles/previews-*.css` 中编写以 `.preview-<id>` 开头的独立样式。
4. 本地执行 `npm run build`，确保 TypeScript 与 Vite 构建通过。

## 设计约束

- 缩略预览应使用 HTML 与 CSS 实时渲染，不依赖远程图片。
- 保证卡片、弹窗和移动端三种尺寸下仍可辨识。
- 动画应兼容页面的“减少动画”模式。
- 配色需保证正文和关键操作的可读性。
- 新增 CSS Token 时使用可复用的语义名称。

## 提交建议

- 功能与样式修改尽量拆分提交。
- 提交信息使用简洁中文。
- Pull Request 应说明新增风格、适用场景和已验证的屏幕尺寸。
