export interface StreamSlideData {
  type: 'welcome' | 'content' | 'list' | 'compare' | 'thanks'
  title: string
  data: any
  narrationScript: string
}

export interface WelcomeSlideData {
  type: 'welcome'
  title: string
  data: {
    subtitle: string
  }
  narrationScript: string
}

export interface ContentSlideData {
  type: 'content'
  title: string
  data: {
    body: string
  }
  narrationScript: string
}

export interface ListSlideData {
  type: 'list'
  title: string
  data: {
    items: string[]
  }
  narrationScript: string
}

export interface CompareSlideData {
  type: 'compare'
  title: string
  data: {
    left_header: string
    left_points: string[]
    right_header: string
    right_points: string[]
  }
  narrationScript: string
}

export interface ThanksSlideData {
  type: 'thanks'
  title: string
  data: {
    message: string
  }
  narrationScript: string
}

export type TypedSlideData = WelcomeSlideData | ContentSlideData | ListSlideData | CompareSlideData | ThanksSlideData
