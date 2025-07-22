export interface PresentationTemplate {
  id: string
  name: string
  description: string
  colorPalette: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
    textSecondary: string
    success: string
    warning: string
    error: string
  }
  fonts: {
    heading: string
    body: string
    code: string
  }
  styles: {
    borderRadius: string
    shadowLevel: 'none' | 'light' | 'medium' | 'strong'
    spacing: 'compact' | 'normal' | 'spacious'
  }
  images: {
    backgroundPattern?: string
    iconStyle: 'outlined' | 'filled' | 'minimal'
    illustrations: string[]
  }
  category: 'business' | 'academic' | 'creative'
}

export const presentationTemplates: PresentationTemplate[] = [
  {
    id: 'professional-blue',
    name: 'Professional Blue',
    description: 'Clean, corporate design perfect for business presentations',
    colorPalette: {
      primary: '#1890ff',
      secondary: '#096dd9',
      accent: '#52c41a',
      background: '#ffffff',
      text: '#262626',
      textSecondary: '#595959',
      success: '#52c41a',
      warning: '#fa8c16',
      error: '#ff4d4f'
    },
    fonts: {
      heading: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      code: '"Fira Code", "Cascadia Code", Consolas, "Courier New", monospace'
    },
    styles: {
      borderRadius: '8px',
      shadowLevel: 'medium',
      spacing: 'normal'
    },
    images: {
      backgroundPattern: 'subtle-grid',
      iconStyle: 'outlined',
      illustrations: ['charts', 'graphs', 'business-icons']
    },
    category: 'business'
  },
  {
    id: 'academic-green',
    name: 'Academic Green',
    description: 'Professional design ideal for educational and research presentations',
    colorPalette: {
      primary: '#389e0d',
      secondary: '#237804',
      accent: '#1890ff',
      background: '#f6ffed',
      text: '#1f1f1f',
      textSecondary: '#4a4a4a',
      success: '#52c41a',
      warning: '#faad14',
      error: '#f5222d'
    },
    fonts: {
      heading: 'Crimson Text, Georgia, "Times New Roman", serif',
      body: 'Source Sans Pro, -apple-system, BlinkMacSystemFont, sans-serif',
      code: '"JetBrains Mono", "Roboto Mono", monospace'
    },
    styles: {
      borderRadius: '6px',
      shadowLevel: 'light',
      spacing: 'spacious'
    },
    images: {
      backgroundPattern: 'academic-lines',
      iconStyle: 'minimal',
      illustrations: ['education', 'research', 'academic-icons']
    },
    category: 'academic'
  },
  {
    id: 'creative-gradient',
    name: 'Creative Gradient',
    description: 'Vibrant, modern design perfect for creative and innovative presentations',
    colorPalette: {
      primary: '#722ed1',
      secondary: '#eb2f96',
      accent: '#13c2c2',
      background: '#fafafa',
      text: '#212121',
      textSecondary: '#666666',
      success: '#00b96b',
      warning: '#fa8c16',
      error: '#ff4d4f'
    },
    fonts: {
      heading: 'Montserrat, -apple-system, BlinkMacSystemFont, sans-serif',
      body: 'Open Sans, -apple-system, BlinkMacSystemFont, sans-serif',
      code: '"Source Code Pro", "Ubuntu Mono", monospace'
    },
    styles: {
      borderRadius: '12px',
      shadowLevel: 'strong',
      spacing: 'normal'
    },
    images: {
      backgroundPattern: 'creative-waves',
      iconStyle: 'filled',
      illustrations: ['creative', 'innovation', 'design-icons']
    },
    category: 'creative'
  }
]

export const getTemplateById = (id: string): PresentationTemplate | null => {
  return presentationTemplates.find((template) => template.id === id) || null
}

export const getTemplateStyles = (template: PresentationTemplate) => {
  const getShadowStyle = (shadowLevel: string) => {
    switch (shadowLevel) {
      case 'none':
        return 'none'
      case 'light':
        return '0 2px 4px rgba(0, 0, 0, 0.1)'
      case 'medium':
        return '0 4px 8px rgba(0, 0, 0, 0.12)'
      case 'strong':
        return '0 8px 16px rgba(0, 0, 0, 0.15)'
      default:
        return '0 4px 8px rgba(0, 0, 0, 0.12)'
    }
  }

  const getSpacing = (spacing: string) => {
    switch (spacing) {
      case 'compact':
        return { padding: '12px', margin: '8px' }
      case 'normal':
        return { padding: '16px', margin: '12px' }
      case 'spacious':
        return { padding: '24px', margin: '16px' }
      default:
        return { padding: '16px', margin: '12px' }
    }
  }

  return {
    colors: template.colorPalette,
    fonts: template.fonts,
    borderRadius: template.styles.borderRadius,
    boxShadow: getShadowStyle(template.styles.shadowLevel),
    spacing: getSpacing(template.styles.spacing)
  }
}
