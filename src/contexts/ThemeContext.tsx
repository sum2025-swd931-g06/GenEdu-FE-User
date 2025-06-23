import React, { useState, useEffect } from 'react'
import type { Theme, ThemeContextType } from '../types/theme.type'
import { predefinedThemes, businessProfessionalTheme } from '../themes/predefinedThemes'
import { ThemeContext } from '../hooks/useTheme'

// Convert theme to CSS custom properties
const generateThemeCSS = (theme: Theme): string => {
  return `
    :root {
      /* Colors */
      --theme-primary: ${theme.colors.primary};
      --theme-secondary: ${theme.colors.secondary};
      --theme-accent: ${theme.colors.accent};
      --theme-background: ${theme.colors.background};
      --theme-surface: ${theme.colors.surface};
      --theme-text-primary: ${theme.colors.text.primary};
      --theme-text-secondary: ${theme.colors.text.secondary};
      --theme-text-accent: ${theme.colors.text.accent};
      
      /* Typography */
      --theme-font-heading: ${theme.typography.headingFont};
      --theme-font-body: ${theme.typography.bodyFont};
      --theme-font-size-h1: ${theme.typography.sizes.h1};
      --theme-font-size-h2: ${theme.typography.sizes.h2};
      --theme-font-size-h3: ${theme.typography.sizes.h3};
      --theme-font-size-body: ${theme.typography.sizes.body};
      --theme-font-size-caption: ${theme.typography.sizes.caption};
      --theme-font-weight-normal: ${theme.typography.weights.normal};
      --theme-font-weight-medium: ${theme.typography.weights.medium};
      --theme-font-weight-bold: ${theme.typography.weights.bold};
      
      /* Spacing */
      --theme-spacing-xs: ${theme.spacing.xs};
      --theme-spacing-sm: ${theme.spacing.sm};
      --theme-spacing-md: ${theme.spacing.md};
      --theme-spacing-lg: ${theme.spacing.lg};
      --theme-spacing-xl: ${theme.spacing.xl};
      --theme-spacing-xxl: ${theme.spacing.xxl};
      
      /* Border Radius */
      --theme-radius-sm: ${theme.borderRadius.sm};
      --theme-radius-md: ${theme.borderRadius.md};
      --theme-radius-lg: ${theme.borderRadius.lg};
      --theme-radius-xl: ${theme.borderRadius.xl};
      
      /* Shadows */
      --theme-shadow-sm: ${theme.shadows.sm};
      --theme-shadow-md: ${theme.shadows.md};
      --theme-shadow-lg: ${theme.shadows.lg};
      --theme-shadow-xl: ${theme.shadows.xl};
      
      /* Gradient */
      ${
        theme.colors.gradient
          ? `
      --theme-gradient: linear-gradient(${theme.colors.gradient.direction}, ${theme.colors.gradient.start}, ${theme.colors.gradient.end});
      `
          : ''
      }
    }
  `
}

// Apply theme to document
const applyThemeToDocument = (theme: Theme) => {
  // Remove existing theme styles
  const existingStyle = document.getElementById('theme-styles')
  if (existingStyle) {
    existingStyle.remove()
  }

  // Create new style element
  const style = document.createElement('style')
  style.id = 'theme-styles'
  style.textContent = generateThemeCSS(theme)
  document.head.appendChild(style)

  // Store theme in localStorage
  localStorage.setItem('selectedTheme', theme.id)
}

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(businessProfessionalTheme)

  // Load saved theme on mount
  useEffect(() => {
    const savedThemeId = localStorage.getItem('selectedTheme')
    if (savedThemeId) {
      const savedTheme = predefinedThemes.find((theme) => theme.id === savedThemeId)
      if (savedTheme) {
        setCurrentTheme(savedTheme)
        applyThemeToDocument(savedTheme)
        return
      }
    }
    // Apply default theme if no saved theme
    applyThemeToDocument(businessProfessionalTheme)
  }, []) // Only run on mount

  const setTheme = (theme: Theme) => {
    setCurrentTheme(theme)
    applyThemeToDocument(theme)
  }

  const applyTheme = (theme: Theme) => {
    applyThemeToDocument(theme)
  }

  const value: ThemeContextType = {
    currentTheme,
    availableThemes: predefinedThemes,
    setTheme,
    applyTheme
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export default ThemeProvider
