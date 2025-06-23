import { useContext } from 'react'
import type { LocalAuthContextType } from '../types/local-auth.type'
import { LocalAuthContext } from '../contexts/local-auth-context'

export const useLocalAuth = (): LocalAuthContextType => {
  const context = useContext(LocalAuthContext)
  if (context === undefined) {
    throw new Error('useLocalAuth must be used within a LocalAuthProvider')
  }
  return context
}
