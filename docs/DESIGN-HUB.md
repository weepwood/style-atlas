# Design Hub · UI 设计资源平台（MVP）

本页是 [Style Atlas](../README.md) 的一个**独立静态入口**，访问路径为：

- 本地开发：打开 Vite Dev Server 的 **/design-hub/**。
- 主分支 GitHub Pages 成功发布后：https://weepwood.github.io/style-atlas/design-hub/
- 直接源码：public/design-hub/index.html、styles.css、data.js、app.js。

项目当前沿用已有 React + Vite 仓库，Design Hub 独立使用原生 HTML / CSS / JavaScript，无额外依赖，Vite 会原样复制 public 文件到 dist。它不会改动现有 30 种 Style Atlas 风格和 Storybook 项目。

## MVP 已实现

| 功能 | 实现 | 边界 |
|---|---|---|
| 资源目录 | 31 个去重站点，7 类，S/A/B/C 等级；搜索、分类、优先级、排序 | 初始数据为手工整理，非实时爬虫 |
| 收藏 | 本地收藏与专属筛选 | localStorage，换浏览器不会同步 |
| 详情 | 网站简介、标签、状态、来源链接 | 卡片为示意 UI，不是实际网页截图 |
| 网站预览 | 用户点击后才发起 iframe 请求；原站新标签直达 | 某些网站设置 CSP / X-Frame-Options，无法嵌入 |
| 个人截图 | 用户上传 PNG/JPG/WebP（最大 5 MB），IndexedDB 本地持久化 | 不自动抓取网页；JSON 备份不包含截图 |
| 设计分析 | 六维 0~5 分评价、分析笔记、个人平均分、Markdown 导出 | 人工评分，不宣称为 AI 分析 |
| 复刻工作台 | 四种原创演示模板，主题色、密度、圆角、文案；沙箱预览；HTML / CSS Tokens 导出 | 并非网站一键像素级复刻；暂未与 Storybook 自动同步 |
| 数据 | 添加网站，导入/导出 JSON，浏览器本地保存 | 没有后端、登录和跨设备同步 |

## 运行与检查

仓库根目录：

~~~sh
npm install
npm run dev
# http://localhost:5173/style-atlas/design-hub/
# 或者 http://localhost:5173/design-hub/（Vite dev 会直接提供 public 路径）
node --check public/design-hub/app.js
node public/design-hub/smoke.test.mjs
npm run build
~~~

使用生产构建后，检查 dist/design-hub/index.html 和 3 个同级资源文件都已存在。

## 数据格式

种子资源维护在 data.js，分类名称在 CATEGORIES，记录在 ENTRIES，运行时生成 SEED_RESOURCES。导出的 backup.json 包含：

~~~json
{
  "schema": "weepwood-design-hub/v1",
  "exportedAt": "2026-10-23T00:00:00.000Z",
  "resources": [],
  "favorites": [],
  "reviews": {},
  "workbench": {}
}
~~~

支持导入此备份或包含资源数组的 JSON。用户添加数据在浏览器 localStorage 中，截图 Blob 在 IndexedDB 中。**清除站点数据会丢失本地记录**，建议定期导出并单独备份截图。

## 安全与合规

- 只允许 HTTP(S) 来源地址；资源名称和描述渲染时 HTML 转义。
- 外站 iframe 只在用户点击后加载，采用 sandbox + no-referrer；失败时请跳转原站。
- 复刻工作台只运行内置、原创生成的 HTML，通过 sandbox iframe 隔离；不抓取第三方源码。
- 用户截图须遵守源站版权/条款。不要默认把截图嵌入开源仓库。
- 本地数据不是云端私人空间：共享设备使用同一浏览器的人员可能访问数据。
- 初始 31 条资源状态为 2026-10-23 的人工归纳，不做实时可用性承诺。

## 后续建议

1. 扩充 Preview 数据：记录授权截图、设备尺寸、设计 Token、交互状态与来源日期。
2. 基于手工标注的 Pattern Library，增加 Tabs、Dialog、Navigation、Hover 等原创可复用实现。
3. 使用独立适配层将选中的原创组件导出为 Vue 3 SFC，或手动导入 weepwood-UI 的 Storybook。
4. 增加一键导入 Markdown/Obsidian、重复 URL 检查、截图离线 ZIP 备份。
5. 若未来引入自动分析，明确连接的模型、输入范围、费用及隐私选项；不得把个人主观打分误标为 AI 检测结论。
