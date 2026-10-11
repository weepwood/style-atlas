export type ClientCategory = '系统设计' | '效率工具' | '企业管理' | '内容社区' | '开发工具';
export type ClientPlatform = '跨平台' | '桌面' | '移动端' | 'Web';
export type ClientLayout = 'native' | 'workspace' | 'data' | 'editor' | 'social' | 'media' | 'mobile';
export interface ClientSource {
  label: string;
  url: string;
  kind: '官方规范' | '官方文档' | '开源项目' | 'Figma 资源';
}
export interface ClientPattern {
  id: string;
  name: string;
  subtitle: string;
  category: ClientCategory;
  platform: ClientPlatform;
  density: '低' | '中' | '高';
  layout: ClientLayout;
  status: '官方设计体系' | '产品设计观察';
  summary: string;
  characteristics: string[];
  interactions: string[];
  suitableFor: string[];
  cautions: string[];
  nav: [string, string, string];
  accent: string;
  bg: string;
  panel: string;
  text: string;
  radius: number;
  sources: ClientSource[];
}

export const clientPatterns: ClientPattern[] = [
  {
    id: 'apple', name: 'Apple · Liquid Glass', subtitle: 'Apple Human Interface Guidelines',
    category: '系统设计', platform: '跨平台', density: '低', layout: 'native', status: '官方设计体系',
    summary: '将内容放在视觉中心，使用系统级导航、动态材质和精简操作。示例只借鉴结构和层级，并非系统控件的逐像素实现。',
    characteristics: ['半透明动态材质', '内容优先与充足留白', '分层侧边栏与工具栏'],
    interactions: ['原生导航与搜索入口', '上下文菜单', '自适应窗口尺寸'],
    suitableFor: ['macOS / iOS 原生应用', '照片、媒体与个人效率工具'],
    cautions: ['网页模仿系统材质有性能与对比度成本', '不要用模糊效果替代清晰层级'],
    nav: ['资料库', '最近打开', '已收藏'], accent: '#3478f6', bg: '#e9edf4', panel: '#ffffff', text: '#1c2635', radius: 18,
    sources: [
      {label: 'Liquid Glass 官方技术概览', url: 'https://developer.apple.com/documentation/TechnologyOverviews/liquid-glass', kind: '官方规范'},
      {label: 'Human Interface Guidelines', url: 'https://developer.apple.com/design/human-interface-guidelines/', kind: '官方规范'},
      {label: 'Apple 官方 UI Kits（Figma 入口）', url: 'https://developer.apple.com/design/resources/', kind: 'Figma 资源'}
    ]
  },
  {
    id: 'fluent', name: 'Windows · Fluent 2', subtitle: 'Microsoft Fluent Design',
    category: '系统设计', platform: '跨平台', density: '中', layout: 'native', status: '官方设计体系',
    summary: '强调自然、清晰、一致的 Windows 桌面体验：分层导航、上下文操作和可组合的设计 Token。',
    characteristics: ['层次明确的系统表面', '圆角与柔和中性色', '完整状态反馈'],
    interactions: ['导航视图与信息面板', '工具栏与右键操作', '焦点与键盘可访问性'],
    suitableFor: ['Windows 桌面工具', '办公与管理客户端'],
    cautions: ['区分 Fluent 设计理念与具体 Windows 控件', '信息密度不能单靠加大间距来解决'],
    nav: ['概览', '文档', '设置'], accent: '#146dc8', bg: '#f1f3f7', panel: '#fff', text: '#202630', radius: 10,
    sources: [
      {label: 'Fluent 2 设计指南与 Figma UI Kits', url: 'https://fluent2.microsoft.design/get-started/design', kind: '官方规范'},
      {label: 'Fluent UI 开源仓库', url: 'https://github.com/microsoft/fluentui', kind: '开源项目'}
    ]
  },
  {
    id: 'material', name: 'Google · Material 3', subtitle: 'Material 3 / Expressive',
    category: '系统设计', platform: '移动端', density: '中', layout: 'mobile', status: '官方设计体系',
    summary: '通过语义色彩、明显的触控目标、分层页面和强主次关系，建立适合 Android 的可表达式交互。',
    characteristics: ['色调调色板', '大圆角与层级表面', '移动端底部导航'],
    interactions: ['浮动主操作按钮', '底部导航切换', '状态变化与反馈'],
    suitableFor: ['Android App', '移动端事务处理'],
    cautions: ['别把 Expressive 误解为任意夸张的装饰', '触控目标和对比度需要实际测试'],
    nav: ['首页', '探索', '收藏'], accent: '#6750a4', bg: '#f3effa', panel: '#fff', text: '#2c2637', radius: 22,
    sources: [
      {label: 'Material Design 3', url: 'https://m3.material.io/', kind: '官方规范'},
      {label: 'Material 3 Expressive', url: 'https://developer.android.com/design/ui/mobile/guides/material3-expressive', kind: '官方规范'},
      {label: 'Material Components for Android', url: 'https://github.com/material-components/material-components-android', kind: '开源项目'}
    ]
  },
  {
    id: 'notion', name: 'Notion · 内容工作区', subtitle: 'Document-first workspace',
    category: '效率工具', platform: '跨平台', density: '中', layout: 'workspace', status: '产品设计观察',
    summary: '把文档、数据库和协作任务组织进一个空间：左侧树状导航与低干扰的内容编辑区形成核心体验。',
    characteristics: ['内容主导的布局', '树状可折叠侧边栏', '低对比度工具区域'],
    interactions: ['页面与工作区切换', '块编辑与斜杠命令', '渐进呈现编辑操作'],
    suitableFor: ['笔记与知识库', '文档协作与内容平台'],
    cautions: ['低对比度控件易降低可发现性', '复杂数据操作需要清楚的导航定位'],
    nav: ['工作区', '团队文档', '快速笔记'], accent: '#333333', bg: '#f7f7f5', panel: '#fff', text: '#242424', radius: 7,
    sources: [
      {label: 'Notion 工作区与界面介绍', url: 'https://www.notion.com/help/intro-to-workspaces', kind: '官方文档'},
      {label: 'Notion 侧边栏使用指南', url: 'https://www.notion.com/help/navigate-with-the-sidebar', kind: '官方文档'}
    ]
  },
  {
    id: 'linear', name: 'Linear · 高效任务流', subtitle: 'Keyboard-first productivity',
    category: '效率工具', platform: '跨平台', density: '高', layout: 'workspace', status: '产品设计观察',
    summary: '高度聚焦的任务信息架构：弱化视觉噪声，以快捷键、搜索、状态管理和稳定的布局加快工作节奏。',
    characteristics: ['细致的分隔线', '高密度列表与状态', '克制的层级色彩'],
    interactions: ['命令菜单', '列表快捷操作', '筛选与视图切换'],
    suitableFor: ['项目管理', 'Issue 与任务追踪'],
    cautions: ['键盘优先不等于鼠标操作可省略', '新用户仍需要明确的操作提示'],
    nav: ['收件箱', '我的问题', '项目'], accent: '#7469e8', bg: '#15161c', panel: '#202129', text: '#f2f2f6', radius: 9,
    sources: [
      {label: 'Linear 官方站点', url: 'https://linear.app/', kind: '官方文档'},
      {label: 'Linear 使用指南', url: 'https://linear.app/docs', kind: '官方文档'}
    ]
  },
  {
    id: 'vscode', name: 'VS Code · Workbench', subtitle: 'Developer workspace',
    category: '开发工具', platform: '桌面', density: '高', layout: 'editor', status: '产品设计观察',
    summary: '活动栏、资源面板、编辑器、终端和状态栏是可复用的桌面生产力工具范式。',
    characteristics: ['可停靠的多区域工作台', '紧凑工具栏', '明确的激活状态'],
    interactions: ['快速打开与命令面板', '面板开合', '编辑器标签与键盘操作'],
    suitableFor: ['IDE 与开发工具', '复杂桌面实用工具'],
    cautions: ['多窗格需要解决小屏压缩', '高信息密度需配合清楚的可视分隔'],
    nav: ['资源管理器', '搜索', '扩展'], accent: '#3794ff', bg: '#171b21', panel: '#232831', text: '#eff3f8', radius: 4,
    sources: [
      {label: 'VS Code 用户界面官方文档', url: 'https://code.visualstudio.com/docs/getstarted/userinterface', kind: '官方文档'},
      {label: 'VS Code 源代码', url: 'https://github.com/microsoft/vscode', kind: '开源项目'}
    ]
  },
  {
    id: 'figma', name: 'Figma · 设计画布', subtitle: 'Canvas-based editor',
    category: '效率工具', platform: 'Web', density: '高', layout: 'editor', status: '产品设计观察',
    summary: '以画布为中心，左图层、右属性、顶部工具，实现高维度创作任务的空间式组织。',
    characteristics: ['无限画布优先', '左层级右属性', '可视化操作工具条'],
    interactions: ['对象选中与属性检查', '图层定位', '工具模式切换'],
    suitableFor: ['设计工具', '图像编辑、流程与图形软件'],
    cautions: ['操作模式切换需要显著提示', '触控设备与键盘桌面体验难完全一致'],
    nav: ['图层', '组件', '资源'], accent: '#9b65f2', bg: '#e5e6e8', panel: '#fafafa', text: '#25282d', radius: 5,
    sources: [
      {label: 'Figma 官方学习资源', url: 'https://help.figma.com/', kind: '官方文档'},
      {label: 'Figma 官方 UI Kits 介绍', url: 'https://help.figma.com/hc/en-us/articles/24037724065943-Start-designing-with-UI-kits', kind: 'Figma 资源'}
    ]
  },
  {
    id: 'ant', name: 'Ant Design · 企业应用', subtitle: 'Enterprise data UI',
    category: '企业管理', platform: 'Web', density: '高', layout: 'data', status: '官方设计体系',
    summary: '成熟的业务表单、筛选器、数据表格与操作反馈，适合复杂的 B 端管理任务。',
    characteristics: ['结构化栅格', '清晰的表单与表格', '明确主次操作'],
    interactions: ['表格筛选和分页', '抽屉/弹窗编辑', '表单校验与反馈'],
    suitableFor: ['管理后台', 'ERP / HIS / OA'],
    cautions: ['默认组件堆叠会造成拥挤', '建议将高频任务前置、减少表单步数'],
    nav: ['总览', '数据管理', '操作记录'], accent: '#1677ff', bg: '#f5f6f8', panel: '#fff', text: '#1d2129', radius: 6,
    sources: [
      {label: 'Ant Design 设计规范', url: 'https://ant.design/docs/spec/introduce/', kind: '官方规范'},
      {label: 'Ant Design React 仓库', url: 'https://github.com/ant-design/ant-design', kind: '开源项目'}
    ]
  },
  {
    id: 'carbon', name: 'IBM · Carbon', subtitle: 'Enterprise design system',
    category: '企业管理', platform: 'Web', density: '高', layout: 'data', status: '官方设计体系',
    summary: '系统化的 2x 网格、数据视图、组件和可访问性规范，帮助大型企业产品维持一致。',
    characteristics: ['精确的网格与排版', '克制的企业中性色', '表格与数据可视化'],
    interactions: ['批量操作', '结构化表单', '通知与渐进披露'],
    suitableFor: ['复杂企业业务系统', '数据分析与运维后台'],
    cautions: ['强规范不意味着适合任何品牌', '大型列表仍需考虑加载与滚动体验'],
    nav: ['控制台', '数据集', '报告'], accent: '#0f62fe', bg: '#f4f4f4', panel: '#fff', text: '#161616', radius: 2,
    sources: [
      {label: 'Carbon Design System', url: 'https://carbondesignsystem.com/', kind: '官方规范'},
      {label: 'Carbon React 实现', url: 'https://github.com/carbon-design-system/carbon', kind: '开源项目'}
    ]
  },
  {
    id: 'atlassian', name: 'Atlassian · 协作应用', subtitle: 'Work management system',
    category: '企业管理', platform: 'Web', density: '中', layout: 'workspace', status: '官方设计体系',
    summary: '跨多个协作产品共享的 Token、布局和交互组件，适合多人任务流与工作管理。',
    characteristics: ['明确的导航层级', '组件化工作流', '一致的语义状态'],
    interactions: ['任务上下文操作', '切换工作空间', '提示与操作反馈'],
    suitableFor: ['团队协作', '工单、项目与知识管理'],
    cautions: ['权限与长流程需要额外建模', '避免多个入口同时争夺注意力'],
    nav: ['工作空间', '事项', '知识库'], accent: '#1868db', bg: '#f7f8fa', panel: '#fff', text: '#172b4d', radius: 8,
    sources: [
      {label: 'Atlassian Design System', url: 'https://atlassian.design/', kind: '官方规范'},
      {label: 'Atlassian Foundation', url: 'https://atlassian.design/foundations', kind: '官方规范'}
    ]
  },
  {
    id: 'primer', name: 'GitHub · Primer', subtitle: 'Developer-centric design system',
    category: '开发工具', platform: 'Web', density: '高', layout: 'data', status: '官方设计体系',
    summary: '为代码、Issue、讨论和协作任务设计：强调可读性、状态、行级操作和复杂信息的高效排列。',
    characteristics: ['小颗粒度标签和状态', '克制的边界与密度', '代码和列表优先'],
    interactions: ['筛选与排序', '上下文操作列表', '键盘可访问的菜单'],
    suitableFor: ['代码托管与研发管理', '开发者平台'],
    cautions: ['不要直接借用品牌色和产品图形标记', '密集信息必须保留适当焦点反馈'],
    nav: ['仓库', '问题', '拉取请求'], accent: '#2da44e', bg: '#f6f8fa', panel: '#fff', text: '#1f2328', radius: 6,
    sources: [
      {label: 'GitHub Primer 官方规范', url: 'https://primer.style/', kind: '官方规范'},
      {label: 'Primer React', url: 'https://github.com/primer/react', kind: '开源项目'}
    ]
  },
  {
    id: 'polaris', name: 'Shopify · Polaris', subtitle: 'Merchant admin experience',
    category: '企业管理', platform: 'Web', density: '中', layout: 'data', status: '官方设计体系',
    summary: '针对商家日常任务进行有层次的操作组织，重视主操作、状态反馈和常用业务流。',
    characteristics: ['高可读性业务卡片', '明确的状态/操作', '柔和的管理界面'],
    interactions: ['业务任务引导', '模态窗口与反馈', '分组表单与列表'],
    suitableFor: ['电商运营', '商家管理客户端'],
    cautions: ['电商场景规范并不适用于所有行业', '需与宿主平台最新版组件说明保持一致'],
    nav: ['商店概览', '订单', '商品'], accent: '#137c46', bg: '#f5f5f2', panel: '#fff', text: '#202a24', radius: 12,
    sources: [
      {label: 'Polaris App Home 指南', url: 'https://shopify.dev/docs/api/app-home/latest', kind: '官方规范'},
      {label: 'Polaris Web Components', url: 'https://shopify.dev/docs/api/polaris/using-polaris-web-components', kind: '官方文档'}
    ]
  },
  {
    id: 'discord', name: 'Discord · 社区客户端', subtitle: 'Community navigation',
    category: '内容社区', platform: '跨平台', density: '高', layout: 'social', status: '产品设计观察',
    summary: '服务器切换、频道导航、即时内容和成员上下文的多列布局，使高频社区交流具备空间记忆。',
    characteristics: ['多列深色导航', '明显的活跃状态', '内容流与侧边上下文'],
    interactions: ['多层级频道导航', '消息流查看', '移动端导航适配'],
    suitableFor: ['实时聊天与社区', '游戏/兴趣平台'],
    cautions: ['新手可能被频道层级淹没', '桌面多列结构不能直接缩小成移动页面'],
    nav: ['频道总览', '设计讨论', '通知'], accent: '#5865f2', bg: '#1e1f22', panel: '#313338', text: '#f2f3f5', radius: 10,
    sources: [
      {label: 'Discord 设计与导航演进', url: 'https://discord.com/blog/you-bar', kind: '官方文档'},
      {label: 'Discord 官方网站', url: 'https://discord.com/', kind: '官方文档'}
    ]
  },
  {
    id: 'spotify', name: 'Spotify · 沉浸式媒体', subtitle: 'Media browsing experience',
    category: '内容社区', platform: '跨平台', density: '中', layout: 'media', status: '产品设计观察',
    summary: '暗色内容底板、媒体封面网格、发现推荐和独立播放器，是典型的多媒体探索型客户端。',
    characteristics: ['深色沉浸式画布', '内容封面驱动', '固定播放控制区'],
    interactions: ['播放/暂停与队列', '资料库与推荐流切换', '卡片点击与悬停'],
    suitableFor: ['音乐/视频/图片客户端', '娱乐内容聚合'],
    cautions: ['媒体卡片不能替代必要的文本信息', '封面应有合法使用权限'],
    nav: ['为你推荐', '音乐库', '歌单'], accent: '#1ed760', bg: '#111413', panel: '#212523', text: '#f6fff8', radius: 14,
    sources: [
      {label: 'Spotify 官方客户端', url: 'https://open.spotify.com/', kind: '官方文档'},
      {label: 'Spotify 设计与品牌资源', url: 'https://developer.spotify.com/documentation/design', kind: '官方文档'}
    ]
  }
];

export const clientCategories: Array<'全部' | ClientCategory> = ['全部', '系统设计', '效率工具', '企业管理', '内容社区', '开发工具'];
export const researchDate = '2026-10-11';
