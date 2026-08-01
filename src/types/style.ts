export type StyleTokenMap = Record<string, string>

export interface VisualStyle {
  id: string
  name: string
  en: string
  category: string[]
  tags: string[]
  summary: string
  lead: string
  bestFor: string[]
  risks: string[]
  palette: string[]
  tokens: StyleTokenMap
}
