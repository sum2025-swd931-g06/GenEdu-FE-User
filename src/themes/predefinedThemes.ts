import type { Theme } from '../types/theme.type'

// 1. Business Professional Theme
export const businessProfessionalTheme: Theme = {
  id: 'business-professional',
  name: 'Business Professional',
  description: 'Clean and professional theme perfect for corporate presentations',
  preview: '/themes/previews/business-professional.jpg',
  category: 'business',
  colors: {
    primary: '#1f2937',
    secondary: '#374151',
    accent: '#3b82f6',
    background: '#ffffff',
    surface: '#f9fafb',
    text: {
      primary: '#111827',
      secondary: '#6b7280',
      accent: '#3b82f6'
    }
  },
  typography: {
    headingFont: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    bodyFont: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    sizes: {
      h1: '2.5rem',
      h2: '2rem',
      h3: '1.5rem',
      body: '1rem',
      caption: '0.875rem'
    },
    weights: {
      normal: 400,
      medium: 500,
      bold: 700
    }
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    xxl: '4rem'
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px'
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
  }
}

// 2. Creative Modern Theme
export const creativeModernTheme: Theme = {
  id: 'creative-modern',
  name: 'Creative Modern',
  description: 'Bold and vibrant theme for creative presentations',
  preview: '/themes/previews/creative-modern.jpg',
  category: 'creative',
  colors: {
    primary: '#8b5cf6',
    secondary: '#a78bfa',
    accent: '#f59e0b',
    background: '#fefefe',
    surface: '#f8fafc',
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
      accent: '#8b5cf6'
    },
    gradient: {
      start: '#8b5cf6',
      end: '#ec4899',
      direction: '135deg'
    }
  },
  typography: {
    headingFont: '"Poppins", "Helvetica Neue", Arial, sans-serif',
    bodyFont: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    sizes: {
      h1: '3rem',
      h2: '2.25rem',
      h3: '1.75rem',
      body: '1rem',
      caption: '0.875rem'
    },
    weights: {
      normal: 400,
      medium: 600,
      bold: 700
    }
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    xxl: '4rem'
  },
  borderRadius: {
    sm: '6px',
    md: '12px',
    lg: '18px',
    xl: '24px'
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(139 92 246 / 0.1)',
    md: '0 4px 6px -1px rgb(139 92 246 / 0.15)',
    lg: '0 10px 15px -3px rgb(139 92 246 / 0.2)',
    xl: '0 20px 25px -5px rgb(139 92 246 / 0.25)'
  }
}

// 3. Education Clean Theme
export const educationCleanTheme: Theme = {
  id: 'education-clean',
  name: 'Education Clean',
  description: 'Clean and friendly theme perfect for educational content',
  preview: '/themes/previews/education-clean.jpg',
  category: 'education',
  colors: {
    primary: '#059669',
    secondary: '#065f46',
    accent: '#f59e0b',
    background: '#ffffff',
    surface: '#f0fdf4',
    text: {
      primary: '#064e3b',
      secondary: '#6b7280',
      accent: '#059669'
    }
  },
  typography: {
    headingFont: '"Nunito", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    bodyFont: '"Open Sans", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    sizes: {
      h1: '2.75rem',
      h2: '2.125rem',
      h3: '1.625rem',
      body: '1rem',
      caption: '0.875rem'
    },
    weights: {
      normal: 400,
      medium: 600,
      bold: 700
    }
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    xxl: '4rem'
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px'
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(5 150 105 / 0.1)',
    md: '0 4px 6px -1px rgb(5 150 105 / 0.15)',
    lg: '0 10px 15px -3px rgb(5 150 105 / 0.2)',
    xl: '0 20px 25px -5px rgb(5 150 105 / 0.25)'
  }
}

// 4. Minimal Elegant Theme
export const minimalElegantTheme: Theme = {
  id: 'minimal-elegant',
  name: 'Minimal Elegant',
  description: 'Clean and minimalist design with elegant typography',
  preview: '/themes/previews/minimal-elegant.jpg',
  category: 'minimal',
  colors: {
    primary: '#000000',
    secondary: '#4a5568',
    accent: '#ed8936',
    background: '#ffffff',
    surface: '#fafafa',
    text: {
      primary: '#2d3748',
      secondary: '#718096',
      accent: '#ed8936'
    }
  },
  typography: {
    headingFont: '"Playfair Display", Georgia, serif',
    bodyFont: '"Source Sans Pro", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    sizes: {
      h1: '3.5rem',
      h2: '2.5rem',
      h3: '1.875rem',
      body: '1.125rem',
      caption: '1rem'
    },
    weights: {
      normal: 400,
      medium: 500,
      bold: 600
    }
  },
  spacing: {
    xs: '0.75rem',
    sm: '1.25rem',
    md: '2rem',
    lg: '3rem',
    xl: '4rem',
    xxl: '5rem'
  },
  borderRadius: {
    sm: '2px',
    md: '4px',
    lg: '6px',
    xl: '8px'
  },
  shadows: {
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 25px 50px -12px rgb(0 0 0 / 0.25)'
  }
}

// 5. Corporate Blue Theme
export const corporateBlueTheme: Theme = {
  id: 'corporate-blue',
  name: 'Corporate Blue',
  description: 'Professional blue theme for corporate presentations',
  preview: '/themes/previews/corporate-blue.jpg',
  category: 'corporate',
  colors: {
    primary: '#1e40af',
    secondary: '#3b82f6',
    accent: '#10b981',
    background: '#ffffff',
    surface: '#f8fafc',
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
      accent: '#1e40af'
    }
  },
  typography: {
    headingFont: '"Roboto", "Helvetica Neue", Arial, sans-serif',
    bodyFont: '"Roboto", "Helvetica Neue", Arial, sans-serif',
    sizes: {
      h1: '2.5rem',
      h2: '2rem',
      h3: '1.5rem',
      body: '1rem',
      caption: '0.875rem'
    },
    weights: {
      normal: 400,
      medium: 500,
      bold: 700
    }
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    xxl: '4rem'
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px'
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(30 64 175 / 0.1)',
    md: '0 4px 6px -1px rgb(30 64 175 / 0.15)',
    lg: '0 10px 15px -3px rgb(30 64 175 / 0.2)',
    xl: '0 20px 25px -5px rgb(30 64 175 / 0.25)'
  }
}

// Export all themes
export const predefinedThemes: Theme[] = [
  businessProfessionalTheme,
  creativeModernTheme,
  educationCleanTheme,
  minimalElegantTheme,
  corporateBlueTheme
]

export const getThemeById = (id: string): Theme | undefined => {
  return predefinedThemes.find((theme) => theme.id === id)
}

export const getThemesByCategory = (category: string): Theme[] => {
  if (category === 'all') return predefinedThemes
  return predefinedThemes.filter((theme) => theme.category === category)
}
