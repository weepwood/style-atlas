import type { VisualStyle } from '../types/style'

/** 自有教学案例：以设计范式为灵感，不宣称官方主题或逐像素复刻。 */
export const newStyles: VisualStyle[] = [
  {
    "id": "fluent-mica",
    "name": "Fluent 云母",
    "en": "Fluent Mica",
    "category": [
      "产品",
      "科技"
    ],
    "tags": [
      "桌面",
      "交互样本"
    ],
    "summary": "沉浸式桌面材质、自然导航与轻量窗口层级。",
    "lead": "以 Windows Fluent 的导航、材质与中性色为灵感，重新构建适合桌面软件的清晰层级。强调系统表面与内容区域的区别，而不是一味加模糊。",
    "bestFor": [
      "Windows / Tauri 桌面客户端",
      "轻量办公工具",
      "文件与任务管理"
    ],
    "risks": [
      "半透明不能牺牲文字对比",
      "材质模拟不能替代系统原生控件"
    ],
    "palette": [
      "#E8EDF7",
      "#DDE4F0",
      "#2E64A5",
      "#202E45",
      "#FFFFFF"
    ],
    "tokens": {
      "surface": "#F7F9FC",
      "radius": "12px",
      "accent": "#2E64A5",
      "sidebar": "#DDE4F0",
      "stroke": "rgba(45,74,112,.14)"
    }
  },
  {
    "id": "notion-workspace",
    "name": "文档工作台",
    "en": "Document Workspace",
    "category": [
      "产品",
      "内容"
    ],
    "tags": [
      "块编辑",
      "交互样本"
    ],
    "summary": "克制灰阶、低干扰编辑、文档优先与侧边树结构。",
    "lead": "借鉴文档型工作区的内容优先布局：紧凑导航、清晰的标题层级和节制的工具栏，强调长期使用的可读性。",
    "bestFor": [
      "知识库与 Obsidian 类工具",
      "文档、笔记和待办",
      "协作型内容产品"
    ],
    "risks": [
      "低对比操作入口不易发现",
      "复杂层级必须支持快速定位"
    ],
    "palette": [
      "#F7F7F5",
      "#FFFFFF",
      "#292929",
      "#9B9B96",
      "#E6E6E2"
    ],
    "tokens": {
      "surface": "#FFFFFF",
      "sidebar": "#F7F7F5",
      "radius": "7px",
      "font": "system-ui",
      "spacing": "16px"
    }
  },
  {
    "id": "liquid",
    "name": "液态光学玻璃",
    "en": "Optical Liquid Glass",
    "category": [
      "科技",
      "氛围"
    ],
    "tags": [
      "折射",
      "交互样本"
    ],
    "summary": "半透明叠层、边缘高光与浮动工具栏构建深度。",
    "lead": "在既有玻璃拟态基础上进一步研究光学高光、前后景分离与材质折射；采用简化 CSS 视觉模拟，非系统级真实折射渲染。",
    "bestFor": [
      "影像与创意应用",
      "音乐和媒体界面",
      "轻量控制台"
    ],
    "risks": [
      "大量 backdrop-filter 会消耗 GPU",
      "需要无透明降级和背景对比验证"
    ],
    "palette": [
      "#CFEFFF",
      "#F1F7FF",
      "#4F7DC8",
      "#142B53",
      "#F4BED8"
    ],
    "tokens": {
      "surface": "rgba(255,255,255,.54)",
      "blur": "20px",
      "outline": "1px solid rgba(255,255,255,.8)",
      "radius": "30px",
      "glow": "#86BBFF"
    }
  },
  {
    "id": "halftone",
    "name": "半调印刷",
    "en": "Halftone Print",
    "category": [
      "创意",
      "复古"
    ],
    "tags": [
      "点阵",
      "交互样本"
    ],
    "summary": "印刷网点、套印错位、限制色与杂志式排版。",
    "lead": "用点阵疏密、纸纹与高反差主标题模拟双色丝网印刷。纹理与内容分离，不用持续闪烁或大面积位图素材。",
    "bestFor": [
      "文化与音乐海报",
      "作品集和艺术活动",
      "视觉实验专题"
    ],
    "risks": [
      "文字阅读区不覆盖密集纹理",
      "避免彩色分离造成眩晕"
    ],
    "palette": [
      "#F2EFE4",
      "#162D5A",
      "#90C2E7",
      "#EB765C",
      "#213C6D"
    ],
    "tokens": {
      "paper": "#F2EFE4",
      "ink": "#162D5A",
      "dot": "radial-gradient(#162D5A 1px, transparent 1px)",
      "grid": "5px",
      "radius": "2px"
    }
  },
  {
    "id": "command",
    "name": "指挥仪表盘",
    "en": "Command Center",
    "category": [
      "数据",
      "产品"
    ],
    "tags": [
      "数据密集",
      "交互样本"
    ],
    "summary": "高密度指标、细分隔线与可扫描的模块化数据视图。",
    "lead": "面向监控、运维和医院后台等密集任务，使用规整网格、语义数据色和清晰数字层级，避免把炫酷大屏误当操作台。",
    "bestFor": [
      "运维监控和控制台",
      "医疗与工业数据",
      "业务运营仪表盘"
    ],
    "risks": [
      "颜色不能是状态的唯一信号",
      "信息密度要结合任务优先级"
    ],
    "palette": [
      "#0C1724",
      "#152538",
      "#38D1BE",
      "#F8BC66",
      "#DDE8F2"
    ],
    "tokens": {
      "background": "#0C1724",
      "surface": "#152538",
      "line": "#2C4257",
      "accent": "#38D1BE",
      "digits": "tabular-nums"
    }
  },
  {
    "id": "oled",
    "name": "OLED 深夜",
    "en": "OLED Noir",
    "category": [
      "极简",
      "科技"
    ],
    "tags": [
      "纯黑",
      "交互样本"
    ],
    "summary": "纯黑画布、精确亮度层级与高对比悬浮面板。",
    "lead": "以 OLED 屏幕的纯黑与极少高亮点为核心，不靠大范围阴影制造层级，适合深色高专注度的内容和媒体产品。",
    "bestFor": [
      "影音播放器",
      "开发者阅读工具",
      "低光环境客户端"
    ],
    "risks": [
      "纯黑和纯白对比容易刺眼",
      "主动控制发光色面积"
    ],
    "palette": [
      "#050505",
      "#161616",
      "#D8D8D8",
      "#88F4C2",
      "#424242"
    ],
    "tokens": {
      "background": "#050505",
      "surface": "#161616",
      "line": "#383838",
      "radius": "14px",
      "accent": "#88F4C2"
    }
  },
  {
    "id": "soft-gradient",
    "name": "柔雾渐层",
    "en": "Soft Gradient UI",
    "category": [
      "产品",
      "氛围"
    ],
    "tags": [
      "低饱和",
      "交互样本"
    ],
    "summary": "柔雾色带、半哑光卡片与宁静的视觉呼吸。",
    "lead": "使用低饱和大范围渐层、柔和阴影和小尺度微反馈，以友好感而非炫技服务于日常生活和轻办公应用。",
    "bestFor": [
      "习惯记录和健康生活",
      "日程、天气与日记",
      "柔和的个人生产力工具"
    ],
    "risks": [
      "低饱和按钮需足够明确",
      "不要把所有容器都做成半透明"
    ],
    "palette": [
      "#F4F1FC",
      "#F5CCDF",
      "#B8D6EC",
      "#6C61AF",
      "#403C59"
    ],
    "tokens": {
      "surface": "#FFFEFF",
      "radius": "26px",
      "shadow": "0 24px 64px rgba(97,80,150,.12)",
      "accent": "#6C61AF",
      "gradient": "linear-gradient(135deg,#F5CCDF,#B8D6EC)"
    }
  },
  {
    "id": "papercut",
    "name": "纸雕层叠",
    "en": "Paper Cut Layers",
    "category": [
      "创意",
      "趣味"
    ],
    "tags": [
      "纸质层次",
      "交互样本"
    ],
    "summary": "错层纸片、柔和投影与强烈的几何轮廓。",
    "lead": "通过少量分明的层级和实体边缘模拟剪纸纸雕效果，强调卡片剖面与光线方向的一致性。",
    "bestFor": [
      "教育与阅读应用",
      "节庆专题",
      "儿童和创意品牌"
    ],
    "risks": [
      "多层阴影易显得繁复",
      "同一界面统一光源位置"
    ],
    "palette": [
      "#F5F0E8",
      "#E8AA93",
      "#81B59B",
      "#EBCF78",
      "#363B37"
    ],
    "tokens": {
      "paper": "#F5F0E8",
      "layer": "#E8AA93",
      "shadow": "6px 8px 0 rgba(25,45,35,.2)",
      "radius": "24px",
      "ink": "#363B37"
    }
  },
  {
    "id": "ink-wash",
    "name": "水墨留白",
    "en": "Ink Wash",
    "category": [
      "内容",
      "极简"
    ],
    "tags": [
      "东方意境",
      "交互样本"
    ],
    "summary": "笔触墨阶、宣纸留白与含蓄的非对称编排。",
    "lead": "通过可控墨阶、纵横排版与极简色彩探索东方编辑美学，以版式关系取代现成文化符号的堆砌。",
    "bestFor": [
      "文学、茶艺与摄影",
      "文化类知识内容",
      "艺术家的个人站点"
    ],
    "risks": [
      "水墨纹理应当避开正文区域",
      "中英文字体应分别校对"
    ],
    "palette": [
      "#ECE8DE",
      "#222C28",
      "#68756C",
      "#B95E4E",
      "#C6C0B4"
    ],
    "tokens": {
      "paper": "#ECE8DE",
      "ink": "#222C28",
      "accent": "#B95E4E",
      "serif": "Georgia, serif",
      "rule": "1px solid #C6C0B4"
    }
  },
  {
    "id": "isometric",
    "name": "等距科技空间",
    "en": "Isometric Systems",
    "category": [
      "科技",
      "数据"
    ],
    "tags": [
      "空间几何",
      "交互样本"
    ],
    "summary": "结构线、等距网格与可解释的 3D 信息层级。",
    "lead": "用低成本 CSS 变换和规则几何建立有空间关系的信息可视化。对真正的数据场景，应优先保证可用的二维阅读视图。",
    "bestFor": [
      "开发者技术介绍",
      "基础设施拓扑",
      "工业与数字孪生概念"
    ],
    "risks": [
      "透视装饰不可妨碍数据操作",
      "移动端优先降级为二维布局"
    ],
    "palette": [
      "#101D2B",
      "#20374C",
      "#64D8C7",
      "#7AA7F8",
      "#E3F3FC"
    ],
    "tokens": {
      "background": "#101D2B",
      "surface": "#20374C",
      "grid": "32px",
      "accent": "#64D8C7",
      "radius": "12px"
    }
  }
]
