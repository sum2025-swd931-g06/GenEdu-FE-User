import type { Theme } from '../types/theme.type'

/**
 * Generate CSS custom properties from theme object
 */
export const generateThemeCSS = (theme: Theme): Record<string, string> => {
  return {
    '--theme-primary': theme.colors.primary,
    '--theme-secondary': theme.colors.secondary,
    '--theme-accent': theme.colors.accent,
    '--theme-background': theme.colors.background,
    '--theme-surface': theme.colors.surface,
    '--theme-text-primary': theme.colors.text.primary,
    '--theme-text-secondary': theme.colors.text.secondary,
    '--theme-text-accent': theme.colors.text.accent,
    '--theme-font-heading': theme.typography.headingFont,
    '--theme-font-body': theme.typography.bodyFont,
    '--theme-font-size-h1': theme.typography.sizes.h1,
    '--theme-font-size-h2': theme.typography.sizes.h2,
    '--theme-font-size-h3': theme.typography.sizes.h3,
    '--theme-font-size-body': theme.typography.sizes.body,
    '--theme-font-size-caption': theme.typography.sizes.caption,
    '--theme-font-weight-normal': theme.typography.weights.normal.toString(),
    '--theme-font-weight-medium': theme.typography.weights.medium.toString(),
    '--theme-font-weight-bold': theme.typography.weights.bold.toString(),
    '--theme-spacing-xs': theme.spacing.xs,
    '--theme-spacing-sm': theme.spacing.sm,
    '--theme-spacing-md': theme.spacing.md,
    '--theme-spacing-lg': theme.spacing.lg,
    '--theme-spacing-xl': theme.spacing.xl,
    '--theme-spacing-xxl': theme.spacing.xxl,
    '--theme-radius-sm': theme.borderRadius.sm,
    '--theme-radius-md': theme.borderRadius.md,
    '--theme-radius-lg': theme.borderRadius.lg,
    '--theme-radius-xl': theme.borderRadius.xl,
    '--theme-shadow-sm': theme.shadows.sm,
    '--theme-shadow-md': theme.shadows.md,
    '--theme-shadow-lg': theme.shadows.lg,
    '--theme-shadow-xl': theme.shadows.xl,
    ...(theme.colors.gradient && {
      '--theme-gradient': `linear-gradient(${theme.colors.gradient.direction}, ${theme.colors.gradient.start}, ${theme.colors.gradient.end})`
    })
  }
}

/**
 * Apply theme to a specific element
 */
export const applyThemeToElement = (element: HTMLElement, theme: Theme): void => {
  const cssProps = generateThemeCSS(theme)
  Object.entries(cssProps).forEach(([property, value]) => {
    element.style.setProperty(property, value)
  })
}

/**
 * Create a themed style object for React components
 */
export const createThemedStyles = (theme: Theme) => ({
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    color: '#fff'
  },
  secondaryButton: {
    backgroundColor: theme.colors.secondary,
    borderColor: theme.colors.secondary,
    color: '#fff'
  },
  accentButton: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
    color: '#fff'
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    boxShadow: theme.shadows.md
  },
  heading: {
    fontFamily: theme.typography.headingFont,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary
  },
  body: {
    fontFamily: theme.typography.bodyFont,
    fontWeight: theme.typography.weights.normal,
    color: theme.colors.text.primary
  },
  caption: {
    fontFamily: theme.typography.bodyFont,
    fontWeight: theme.typography.weights.normal,
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.caption
  }
})

/**
 * Get contrasting text color for a given background color
 */
export const getContrastingTextColor = (backgroundColor: string): string => {
  // Simple contrast calculation - in production, use a more robust solution
  const hex = backgroundColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128 ? '#000000' : '#ffffff'
}

/**
 * Validate theme object structure
 */
export const validateTheme = (theme: unknown): theme is Theme => {
  if (!theme || typeof theme !== 'object') {
    return false
  }

  const themeObj = theme as Record<string, unknown>

  const requiredFields = [
    'id',
    'name',
    'description',
    'category',
    'colors.primary',
    'colors.secondary',
    'colors.accent',
    'colors.background',
    'colors.surface',
    'colors.text.primary',
    'colors.text.secondary',
    'colors.text.accent',
    'typography.headingFont',
    'typography.bodyFont',
    'typography.sizes.h1',
    'typography.sizes.h2',
    'typography.sizes.h3',
    'typography.sizes.body',
    'typography.sizes.caption',
    'spacing.xs',
    'spacing.sm',
    'spacing.md',
    'spacing.lg',
    'spacing.xl',
    'borderRadius.sm',
    'borderRadius.md',
    'borderRadius.lg',
    'shadows.sm',
    'shadows.md',
    'shadows.lg'
  ]

  return requiredFields.every((field) => {
    const keys = field.split('.')
    let current: unknown = themeObj
    for (const key of keys) {
      if (!current || typeof current !== 'object' || !(key in current)) {
        return false
      }
      current = (current as Record<string, unknown>)[key]
    }
    return true
  })
}
