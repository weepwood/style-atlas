# Weepwood UI Atlas — 个人 UI 收藏馆（P0）

## 目标与边界

本阶段将 Style Atlas 从单纯的「视觉风格图鉴」拓展为可长期积累个人 UI 灵感的入口；不更换现有技术栈，不重构旧风格库，也不把其他独立项目的源码合并进来。

- **设计收藏馆**：保存视觉风格、UI 组件、动效、桌面布局、设计资源。
- **设计资料**：名称、来源、说明、标签、个人备注、可选预览图、收藏进度。
- **来源可追溯**：种子数据只放仓库链接；不复制第三方仓库代码或图片。
- **复用组件独立**：可安装的 Vue 组件继续在 `weepwood/weepwood-UI` 实现，收藏馆仅保留链接。
- **并行 PR 隔离**：本期不修改 Design Token Studio 功能；请审查与其他未合并 PR 的可能冲突。

## 数据结构

`src/data/collectionEntries.ts` 定义 `CollectionEntry`：

| 字段 | 含义 |
| --- | --- |
| id | 独立稳定 ID；个人条目使用 personal- 前缀 |
| title / category | 设计名称和五大分类之一 |
| summary / tags / note | 简述、标签和个人备注 |
| url | 原始页面或仓库来源，要求 http(s) |
| imageUrl | 可选 http(s) 预览图链接 |
| status | 已收藏、复刻中、已实现（记录自己的收藏工作流状态） |

种子列表 `curatedEntries` 存储 16 个已经核对的 GitHub 项目，全部默认「已收藏」，不代表已移植到图鉴内。

## 收藏与备份

- 个人新增条目保存于当前浏览器 `localStorage`：`style-atlas-personal-collection-v1`。
- 喜欢状态保存于 `style-atlas-collection-favorites-v1`。
- 个人条目最大 500 条；导入 JSON 最大 2 MB；逐条校验字段、分类、URL 和 ID，不覆盖内置种子。
- 任意内置或个人条目均可以通过「查看详情」编写自己的设计笔记，存储于 `style-atlas-entry-notes-v1`。已知的部分在线演示链接可在详情内直接打开，其它项目不臆造在线地址。
- 备份仍采用 v1，新增可选 `notes` 字段。旧版没有 notes 的备份仍可导入，笔记最长 2000 字，最多 600 条。
- 导出 v1 JSON 包括个人条目和喜欢状态；不重复导出种子数据。
- 导入采取合并策略：相同 ID 更新、其他个人条目保留，喜欢状态合并去重。
- **GitHub Pages 没有写入权限**：浏览器里新增的收藏不会自动写入 GitHub，也不会跨设备同步。
- 清理浏览器数据或更换设备前必须手动导出 JSON。未来可以再开发经鉴权的 GitHub 同步功能。
- 外部 `imageUrl` 会向图片服务器加载资源，避免填入隐私图片 URL；导入文件按不可信输入处理。

## 页面交互

首页顶部增加「UI 收藏馆」入口，跳到 `#collection`。支持搜索、分类过滤、仅看喜欢、添加、编辑、删除、JSON 导入导出；响应式布局覆盖桌面和手机，搜索控件、卡片与表单提供键盘焦点指示。

没有提供原图的项目采用 CSS 抽象示意缩略图；**示意图不代表真实项目截图**。以后可以为具有授权的项目手动附上预览图片或独立截图资产。

## 独立 UI 元素实验室（已实现）

- `src/data/playgroundDemos.ts`：6 个自研示例，按按钮、卡片、输入与选择、动效分类。
- `src/components/ComponentPlayground.tsx`：可选示例、可交互 iframe、安全的 HTML/CSS 代码展示与一键复制。
- `src/styles/component-playground.css`：响应式实验台、代码区域与移动端适配。
- 预览使用静态可信的 HTML/CSS 生成 `srcDoc`，iframe 设置空 `sandbox` 和 `no-referrer`；不执行第三方 JS 或导入未知源代码。
- CI 运行 `tests/playgroundDemos.test.mjs`，检查示例数据、无脚本预览、备份兼容性。
- 现有全局 `/` 搜索快捷键跳过输入框及弹窗，避免打断收藏表单编辑。

## 下一阶段

1. 从 Design Style Library 迁移有许可的风格资料和设计提示词，建立来源映射。
2. 接入 UI Elements Showcase 与 CSS Effect Library 的可交互示例，采用 iframe 隔离 CSS、JS 和依赖，禁止直接注入未审核源码。
3. 增加批量导入、导出 Markdown、截图本地上传和设计对比。
4. 确定个人收藏的持久化策略（Git 仓库数据 / 自建同步 / 浏览器本地），再引入跨设备能力。

## 验收建议

- `npm run build`（TypeScript + Vite）
- 首页可通过导航跳转到收藏馆；按全部分类 / 喜欢 / 关键词筛选
- 新增收藏 -> 编辑 -> 刷新页面仍存在 -> 导出 JSON -> 删除 -> 导入后恢复
- 不合法 URL、无效 JSON、重复 ID/保留 ID、超过容量的导入应被拒绝
- 深浅色、键盘焦点、375px/768px/1440px 下显示正常
- 原有风格切换、动效实验室、客户端风格图鉴不受影响
