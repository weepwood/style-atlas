import { styles as baseStyles } from './styles'
import { extraStyles } from './extraStyles'

export const styles = [...baseStyles, ...extraStyles]

export const categories = [
  '全部',
  '产品',
  '品牌',
  '内容',
  '科技',
  '创意',
  '氛围',
  '趣味',
  '数据',
  '极简',
  '复古',
  '收藏',
] as const
