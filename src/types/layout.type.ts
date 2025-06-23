export interface LayoutRegion {
  id: string
  type: 'text' | 'image' | 'chart' | 'list' | 'video' | 'code' | 'quote' | 'title' | 'subtitle'
  position: {
    x: number // percentage
    y: number // percentage
    width: number // percentage
    height: number // percentage
  }
  constraints: {
    minWidth?: number
    minHeight?: number
    maxWidth?: number
    maxHeight?: number
    aspectRatio?: number
    resizable: boolean
    draggable: boolean
  }
  style: {
    padding?: string
    margin?: string
    textAlign?: 'left' | 'center' | 'right' | 'justify'
    backgroundColor?: string
    borderRadius?: string
    border?: string
  }
  defaultContent?: {
    text?: string
    placeholder?: string
    fontSize?: string
    fontWeight?: string
    color?: string
  }
}

export interface SlideLayout {
  id: string
  name: string
  description: string
  category: 'title' | 'content' | 'image' | 'comparison' | 'timeline' | 'list' | 'quote' | 'blank'
  preview: string
  thumbnail: string
  structure: {
    regions: LayoutRegion[]
    background?: {
      type: 'solid' | 'gradient' | 'image'
      value: string
    }
  }
  metadata: {
    aspectRatio: '16:9' | '4:3' | '1:1'
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    tags: string[]
  }
}

export interface SlideLayoutContextType {
  availableLayouts: SlideLayout[]
  currentLayout: SlideLayout | null
  setLayout: (layout: SlideLayout) => void
  getLayoutsByCategory: (category: string) => SlideLayout[]
}
