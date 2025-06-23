export interface Theme {
  id: string
  name: string
  description: string
  preview: string
  category: 'business' | 'education' | 'creative' | 'minimal' | 'corporate' | 'modern'
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: {
      primary: string
      secondary: string
      accent: string
    }
    gradient?: {
      start: string
      end: string
      direction: string
    }
  }
  typography: {
    headingFont: string
    bodyFont: string
    sizes: {
      h1: string
      h2: string
      h3: string
      body: string
      caption: string
    }
    weights: {
      normal: number
      medium: number
      bold: number
    }
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    xxl: string
  }
  borderRadius: {
    sm: string
    md: string
    lg: string
    xl: string
  }
  shadows: {
    sm: string
    md: string
    lg: string
    xl: string
  }
}

export interface ThemeContextType {
  currentTheme: Theme
  availableThemes: Theme[]
  setTheme: (theme: Theme) => void
  applyTheme: (theme: Theme) => void
}
