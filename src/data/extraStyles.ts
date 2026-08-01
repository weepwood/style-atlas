import type { VisualStyle } from '../types/style'

export const extraStyles: VisualStyle[] = [
  {
    id: 'neumorphism',
    name: '新拟物柔光',
    en: 'Neumorphism',
    category: ['产品', '极简'],
    tags: ['柔光', '浮雕'],
    summary: '通过同色系高光与阴影塑造轻微浮雕，让控件像从背景中生长出来。',
    lead: '新拟物柔光强调背景与组件的连续性，依靠成对的亮暗阴影制造凹凸关系。它适合低密度工具和概念界面，但交互状态必须通过颜色、文字或图标得到额外强化。',
    bestFor: ['轻量控制器与播放器', '健康、习惯和专注应用', '智能家居控制面板', '低信息密度的概念产品'],
    risks: ['边界不清会降低可访问性', '大量阴影会增加视觉疲劳', '不适合复杂表格与高密度后台'],
    palette: ['#E7ECF2', '#F8FBFF', '#AAB4C2', '#5576FF', '#273142'],
    tokens: { background: '#E7ECF2', raised: '-10px -10px 22px #fff, 10px 10px 22px #bcc5d1', inset: 'inset 5px 5px 10px #c6ced8, inset -5px -5px 10px #fff', radius: '24px', accent: '#5576FF' }
  },
  {
    id: 'bauhaus',
    name: '包豪斯几何',
    en: 'Bauhaus',
    category: ['品牌', '创意'],
    tags: ['几何', '原色'],
    summary: '用圆、方、线与原色建立功能主义秩序，同时保留强烈的构成感。',
    lead: '包豪斯风格把几何形、网格和功能主义结合起来，用有限原色与黑白关系建立清晰结构。它比新粗野主义更理性，也比瑞士风格更具有图形表现力。',
    bestFor: ['设计机构和文化展览', '建筑、家具与工业设计品牌', '课程与艺术教育平台', '强调构成感的作品集'],
    risks: ['装饰图形可能抢占内容空间', '原色比例失衡会显得幼稚', '需要严格控制网格和对齐关系'],
    palette: ['#F5F0E5', '#161616', '#E63B2E', '#1E55A5', '#F2C230'],
    tokens: { paper: '#F5F0E5', ink: '#161616', red: '#E63B2E', blue: '#1E55A5', yellow: '#F2C230' }
  },
  {
    id: 'material',
    name: 'Material You',
    en: 'Material 3',
    category: ['产品', '数据'],
    tags: ['动态色彩', '组件化'],
    summary: '以大圆角、分层色面和动态配色构建友好、清晰且可扩展的产品界面。',
    lead: 'Material You 强调个性化色彩、清晰的状态层级与完整组件规范。它适合长期产品，而不是只服务单个营销页面，优势在于可扩展性和跨端一致性。',
    bestFor: ['跨端应用和 PWA', '生产力工具与管理后台', '需要主题系统的长期产品', '移动端优先的业务应用'],
    risks: ['照搬组件会缺少品牌辨识度', '大圆角不适合所有信息密度', '动态配色必须验证对比度'],
    palette: ['#F7F2FA', '#6750A4', '#EADDFF', '#1D192B', '#CAC4D0'],
    tokens: { primary: '#6750A4', primaryContainer: '#EADDFF', surface: '#F7F2FA', radius: '28px', elevation: '0 2px 8px rgba(29,25,43,.12)' }
  },
  {
    id: 'vaporwave',
    name: '蒸汽波',
    en: 'Vaporwave',
    category: ['氛围', '复古'],
    tags: ['霓虹', '梦核'],
    summary: '紫粉渐变、网格地平线与复古数字符号，构造带有距离感的网络怀旧。',
    lead: '蒸汽波通过紫粉、青蓝、低清晰度数字元素和古典雕塑意象，制造早期网络文化中的梦幻、疏离和怀旧感。适合短时沉浸体验，不适合严肃的高频任务。',
    bestFor: ['音乐、播客与数字艺术', '复古游戏和互动专题', '年轻化活动页', '实验性个人主页'],
    risks: ['高饱和渐变可能影响阅读', '风格符号容易变成模板化拼贴', '需要为移动端降低背景复杂度'],
    palette: ['#160D2B', '#F85CCF', '#7D5CFF', '#4DE7E8', '#FFE6FA'],
    tokens: { background: '#160D2B', pink: '#F85CCF', violet: '#7D5CFF', cyan: '#4DE7E8', grid: 'rgba(77,231,232,.24)' }
  },
  {
    id: 'pixel',
    name: '像素复古',
    en: 'Pixel Retro',
    category: ['趣味', '复古'],
    tags: ['8-bit', '游戏化'],
    summary: '像素字体、阶梯边缘和有限色板，把界面变成可操作的复古游戏世界。',
    lead: '像素复古风格用低分辨率图形语言、位图节奏和明确状态反馈营造游戏化体验。它的关键不是模糊和噪点，而是让所有尺寸和间距遵循像素网格。',
    bestFor: ['独立游戏与游戏社区', '开发者作品集', '签到、积分和成就系统', '复古主题活动页'],
    risks: ['像素字体不适合长文阅读', '视觉尺寸需要按整数倍缩放', '过度游戏化会削弱专业可信度'],
    palette: ['#1B1F3A', '#F8E16C', '#7CE38B', '#EF5DA8', '#F7F3E8'],
    tokens: { background: '#1B1F3A', pixel: '4px', yellow: '#F8E16C', green: '#7CE38B', border: '4px solid #101329' }
  },
  {
    id: 'zen',
    name: '日式侘寂',
    en: 'Wabi-sabi',
    category: ['极简', '内容'],
    tags: ['留白', '侘寂'],
    summary: '以米纸色、墨色、非对称留白和细微肌理表达克制与时间感。',
    lead: '侘寂风格重视不完美、材料感和安静的空间关系。网页实现应依靠比例、字体和留白，而不是简单叠加竹子、印章等表面符号。',
    bestFor: ['茶、器物和手作品牌', '建筑与空间设计工作室', '摄影、诗歌与文化内容', '精品旅宿和餐饮品牌'],
    risks: ['低对比度会影响可读性', '留白过多可能降低浏览效率', '文化符号使用不当会显得刻板'],
    palette: ['#EEE9DF', '#252822', '#8B3A2F', '#AAA08E', '#D7D0C2'],
    tokens: { paper: '#EEE9DF', ink: '#252822', seal: '#8B3A2F', serif: '"Noto Serif SC", Georgia, serif', radius: '2px' }
  },
  {
    id: 'academia',
    name: '暗黑学院',
    en: 'Dark Academia',
    category: ['内容', '氛围'],
    tags: ['古典', '深色'],
    summary: '深棕、旧纸、衬线字体与档案式布局，营造知识、历史和秘密感。',
    lead: '暗黑学院风格借用图书馆、古籍、木材和学院出版物的视觉语汇，适合叙事性内容与文化品牌。网页中要避免把深色、蜡烛和复古字体简单堆叠。',
    bestFor: ['文学、历史和人文内容', '博物馆与档案项目', '精品咖啡和服装品牌', '悬疑叙事与沉浸式专题'],
    risks: ['深色背景上的正文容易疲劳', '复古字体需要兼顾中文字符', '装饰纹理过多会影响加载性能'],
    palette: ['#19140F', '#D9C8A9', '#6C3E2E', '#3D4A36', '#8F8069'],
    tokens: { background: '#19140F', parchment: '#D9C8A9', oxblood: '#6C3E2E', forest: '#3D4A36', border: '1px solid rgba(217,200,169,.28)' }
  },
  {
    id: 'memphis',
    name: '孟菲斯',
    en: 'Memphis Design',
    category: ['趣味', '品牌'],
    tags: ['图案', '活力'],
    summary: '不规则几何、波点与跳跃配色，形成轻松、反理性和高度可识别的品牌表情。',
    lead: '孟菲斯设计通过不对称图形、波点、曲线和冲突色彩反对冷静的现代主义。适合需要活力和幽默感的品牌，但必须给核心信息留下安静区域。',
    bestFor: ['儿童、教育与创意活动', '食品、饮料和生活方式品牌', '节庆营销页面', '年轻团队与社区产品'],
    risks: ['图案过多会破坏内容层级', '高饱和颜色需要控制面积', '复杂装饰在移动端需要简化'],
    palette: ['#FFF4E4', '#FF6B6B', '#FFD93D', '#4D96FF', '#2E2A33'],
    tokens: { background: '#FFF4E4', coral: '#FF6B6B', yellow: '#FFD93D', blue: '#4D96FF', pattern: 'radial-gradient(#2E2A33 1.5px, transparent 1.5px)' }
  }
]
