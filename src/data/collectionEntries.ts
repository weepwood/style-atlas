export const collectionCategories = ['视觉风格', 'UI 组件', '交互动效', '桌面界面', '设计资源'] as const
export type CollectionCategory = (typeof collectionCategories)[number]
export type CollectionStatus = '已收藏' | '复刻中' | '已实现'

export interface CollectionEntry {
  id: string
  title: string
  category: CollectionCategory
  summary: string
  url: string
  tags: string[]
  note: string
  status: CollectionStatus
  imageUrl?: string
}

export interface CollectionBackup {
  version: 1
  entries: CollectionEntry[]
  favorites: string[]
}

export const curatedEntries: CollectionEntry[] = [
  { id: 'style-atlas', title: 'Style Atlas', category: '视觉风格', summary: '30 种视觉语言、主题切换、客户端风格研究与动效实验。', url: 'https://github.com/weepwood/style-atlas', tags: ['主题', 'Design Tokens', 'React'], note: '主站：视觉风格图鉴', status: '已实现' },
  { id: 'design-style-library', title: 'Design Style Library', category: '视觉风格', summary: '风格描述、配色、标签搜索和提示词收藏。', url: 'https://github.com/weepwood/design-style-library', tags: ['收藏', '提示词', '配色'], note: '待整合的资料管理能力', status: '已实现' },
  { id: 'win11-glassmorphism', title: 'Windows 11 Glassmorphism', category: '视觉风格', summary: '使用纯 CSS 研究 Windows 11 毛玻璃和多面板结构。', url: 'https://github.com/weepwood/win11-glassmorphism', tags: ['Fluent', '毛玻璃', 'Windows'], note: '', status: '已实现' },
  { id: 'arkfield-design-atlas', title: 'Arkfield Design Atlas', category: '视觉风格', summary: '明日方舟与终末地的工业风排版、视觉令牌和图形研究。', url: 'https://github.com/weepwood/arkfield-design-atlas', tags: ['工业风', '排版', '游戏'], note: '', status: '已实现' },
  { id: 'ui-elements-showcase', title: 'UI Elements Showcase', category: 'UI 组件', summary: '组件网格、隔离预览、在线编辑、复制和下载。', url: 'https://github.com/weepwood/ui-elements-showcase', tags: ['组件', 'Vue', '可交互'], note: '候选组件数据源', status: '已实现' },
  { id: 'weepwood-uiverse', title: 'Weepwood Uiverse', category: 'UI 组件', summary: '参考 Uiverse 的独立 UI 元素展示。', url: 'https://github.com/weepwood/weepwood-uiverse', tags: ['组件', 'CSS', '灵感'], note: '', status: '已收藏' },
  { id: 'weepwood-ui', title: 'Weepwood UI', category: 'UI 组件', summary: 'Vue 3 + TypeScript + Storybook 可复用组件库。', url: 'https://github.com/weepwood/weepwood-UI', tags: ['Vue', 'Storybook', '设计系统'], note: '独立组件包，不直接与收藏馆代码合并', status: '复刻中' },
  { id: 'css-effect-library', title: 'CSS Effect Library', category: '交互动效', summary: '按钮、卡片、背景、加载器、文字等 CSS 动效示例。', url: 'https://github.com/weepwood/css-effect-library', tags: ['CSS', '特效', '动效'], note: '候选特效资料', status: '已实现' },
  { id: 'card-collection-hover-effects', title: 'Card Collection Hover', category: '交互动效', summary: '卡片悬停与收藏交互特效。', url: 'https://github.com/weepwood/card-collection-hover-effects', tags: ['Hover', '卡片', 'React'], note: '', status: '已实现' },
  { id: 'motion-web-demo', title: 'Motion Web Demo', category: '交互动效', summary: '字符场、弹簧物理与动效优先的网站交互实验。', url: 'https://github.com/weepwood/motion-web-demo', tags: ['Motion', '交互', '实验'], note: '包含第三方非商业许可内容，复用前检查授权', status: '已实现' },
  { id: 'tauri-desktop-kit', title: 'Tauri Desktop Kit', category: '桌面界面', summary: '可折叠侧栏、标题栏、多标签和设置等桌面工作台模式。', url: 'https://github.com/weepwood/Tauri-Desktop-Kit', tags: ['Tauri', 'Vue', 'Fluent'], note: '作为桌面布局模式参考', status: '已实现' },
  { id: 'wpf-fluent-kit', title: 'WpfFluentKit', category: '桌面界面', summary: 'WPF Fluent 风格组件及 Gallery 示例。', url: 'https://github.com/weepwood/WpfFluentKit', tags: ['WPF', 'Fluent', 'Windows'], note: '', status: '复刻中' },
  { id: 'desktop-app-scaffold', title: 'Desktop App Scaffold', category: '桌面界面', summary: 'Electron 应用框架、主题、标题栏、导航与设置面板。', url: 'https://github.com/weepwood/desktop-app-scaffold', tags: ['Electron', 'React', '桌面'], note: '', status: '已实现' },
  { id: 'react-ui-atlas', title: 'React UI Atlas', category: '设计资源', summary: 'React UI 库和设计系统的分类、筛选与横向对比。', url: 'https://github.com/weepwood/react-ui-atlas', tags: ['React', '选型', '设计系统'], note: '', status: '已实现' },
  { id: 'namethatui', title: 'Name That UI 中文版', category: '设计资源', summary: '用于认识和搜索常见 Web / macOS UI 术语。', url: 'https://github.com/weepwood/namethatui', tags: ['术语', '知识库', '交互'], note: '', status: '已实现' },
  { id: 'design-weekly-hub', title: 'Design Weekly Hub', category: '设计资源', summary: '设计周刊资源索引，包括工具、素材和教程。', url: 'https://github.com/weepwood/design-weekly-hub', tags: ['资源', '索引', '灵感'], note: '原始资料请保留来源署名', status: '已实现' },
]

export function validWebUrl(input: string): boolean {
  try {
    const url = new URL(input)
    return (url.protocol === 'https:' || url.protocol === 'http:') && Boolean(url.hostname)
  } catch {
    return false
  }
}

export function isCollectionEntry(value: unknown): value is CollectionEntry {
  if (!value || typeof value !== 'object') return false
  const item = value as Record<string, unknown>
  return typeof item.id === 'string' && item.id.length > 0 && item.id.length <= 100
    && typeof item.title === 'string' && item.title.length > 0 && item.title.length <= 120
    && collectionCategories.includes(item.category as CollectionCategory)
    && typeof item.summary === 'string' && item.summary.length <= 600
    && typeof item.url === 'string' && validWebUrl(item.url)
    && Array.isArray(item.tags) && item.tags.length <= 15
    && item.tags.every((tag) => typeof tag === 'string' && tag.length <= 30)
    && typeof item.note === 'string' && item.note.length <= 2000
    && ['已收藏', '复刻中', '已实现'].includes(item.status as string)
    && (item.imageUrl === undefined || (typeof item.imageUrl === 'string' && validWebUrl(item.imageUrl)))
}

export function parseCollectionBackup(value: unknown): CollectionBackup {
  if (!value || typeof value !== 'object') throw new Error('备份格式无效')
  const data = value as Record<string, unknown>
  if (data.version !== 1 || !Array.isArray(data.entries) || !Array.isArray(data.favorites)) {
    throw new Error('仅支持收藏馆 v1 JSON 备份')
  }
  if (data.entries.length > 500 || data.favorites.length > 1000) throw new Error('备份条目过多')
  if (!data.entries.every(isCollectionEntry) || !data.favorites.every((id) => typeof id === 'string' && id.length <= 100)) {
    throw new Error('备份中存在不合法的条目')
  }
  if (data.entries.some((entry: CollectionEntry) => curatedEntries.some((seed) => seed.id === entry.id))) {
    throw new Error('备份中包含保留的内置条目 ID')
  }
  const ids = new Set(data.entries.map((entry: CollectionEntry) => entry.id))
  if (ids.size !== data.entries.length) throw new Error('备份中存在重复 ID')
  return data as unknown as CollectionBackup
}
