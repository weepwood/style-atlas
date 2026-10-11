import type { VisualStyle } from '../types/style'

export type MotionProfile = {
  name: string
  duration: string
  easing: string
  principle: string
  caution: string
}

const quiet = new Set(['editorial','swiss','luxury','zen','academia','notion-workspace','ink-wash','oled'])
const tactile = new Set(['glass','clay','neumorphism','liquid','fluent-mica','material','papercut'])
const energetic = new Set(['brutal','cyber','y2k','vaporwave','pixel','memphis','bauhaus','halftone'])
const operational = new Set(['bento','terminal','command','isometric'])

export function getMotionProfile(style: VisualStyle): MotionProfile {
  if (quiet.has(style.id)) return {
    name: '安静 / 精准', duration: '140–220ms', easing: 'ease-out',
    principle: '优先采用内容淡入、细线与按钮状态变化；阅读空间不使用持续运动。',
    caution: '过慢的排版动画会打断阅读。避免为了“高级感”强迫用户等待。',
  }
  if (tactile.has(style.id)) return {
    name: '柔和 / 触感', duration: '150–280ms', easing: 'cubic-bezier(.22,1,.36,1)',
    principle: '通过局部浮起、阴影变化与界面层级交代操作结果；动画与触发元素保持空间关联。',
    caution: '谨慎使用大面积模糊、连续弹跳与全屏视差。支持降低透明和减少动画。',
  }
  if (energetic.has(style.id)) return {
    name: '鲜明 / 克制', duration: '120–240ms', easing: 'steps(1,end) / ease-out',
    principle: '只在关键操作使用干脆的位移、断续跳切或强调色，保证明确的静态完成态。',
    caution: '不添加闪烁、快速交替的高反差大面积效果，避免光敏性和阅读负担。',
  }
  if (operational.has(style.id)) return {
    name: '高效 / 确定', duration: '100–200ms', easing: 'cubic-bezier(.2,.75,.25,1)',
    principle: '使用短促、高可预期的状态反馈；指标和列表更新不应阻挡输入。',
    caution: '高频工作流应尽量避免循环动画。状态变化必须同时有文本或图标。',
  }
  return {
    name: '平衡 / 自然', duration: '160–260ms', easing: 'cubic-bezier(.2,.75,.25,1)',
    principle: '短路径使用短时长，内容展开稍长；颜色、透明度与空间位置有统一逻辑。',
    caution: '不为装饰目的增加持续运动，保留减少动画的等效反馈。',
  }
}
