import { useContext, createContext } from 'react'
import type { ThemeContextType } from '../types/theme.type'

// Create context separately to avoid fast refresh issues
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
