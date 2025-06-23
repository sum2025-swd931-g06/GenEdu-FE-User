import { useContext } from 'react'
import { AuthProviderContext } from '../contexts/auth-provider-context'

export const useAuthProviderContext = () => {
  const context = useContext(AuthProviderContext)
  if (context === undefined) {
    throw new Error('useAuthProviderContext must be used within an AuthProviderContext')
  }
  return context
}
