import { useContext } from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { AuthContext } from '../contexts/auth-context'
import { useLocalAuth } from './useLocalAuth'
import { useAuthProviderContext } from './useAuthProviderContext'
import type { AuthUser } from '../types/auth.type'
import type { LocalAuthUser, LoginCredentials } from '../types/local-auth.type'

// Unified auth interface
export interface UnifiedAuthContext {
  user: AuthUser | LocalAuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  token: string | null
  refreshToken: string | null
  login: ((credentials: LoginCredentials) => Promise<void>) | (() => void)
  logout: () => void
  updateToken?: () => Promise<boolean>
  authProvider: 'keycloak' | 'local'
}

export const useAuth = (): UnifiedAuthContext => {
  // Always call all hooks to avoid conditional hook call issues
  const { keycloak, initialized } = useKeycloak()
  const localAuth = useLocalAuth()
  const { currentProvider } = useAuthProviderContext()

  // Get Keycloak auth context (this will be null if we're using local auth)
  const keycloakAuth = useContext(AuthContext)

  // Use the provider determined by UnifiedAuthProvider
  if (currentProvider === 'keycloak' && keycloakAuth && initialized && keycloak) {
    return {
      user: keycloakAuth.user,
      isAuthenticated: keycloakAuth.isAuthenticated,
      isLoading: keycloakAuth.isLoading,
      token: keycloakAuth.token,
      refreshToken: keycloakAuth.refreshToken,
      login: keycloakAuth.login,
      logout: keycloakAuth.logout,
      updateToken: keycloakAuth.updateToken,
      authProvider: 'keycloak'
    }
  }

  // Use local auth (either as primary choice or fallback)
  return {
    user: localAuth.user,
    isAuthenticated: localAuth.isAuthenticated,
    isLoading: localAuth.isLoading,
    token: localAuth.token,
    refreshToken: localAuth.refreshToken,
    login: localAuth.login,
    logout: localAuth.logout,
    updateToken: localAuth.updateToken,
    authProvider: 'local'
  }
}

// Hook to check which auth provider is currently active
export const useAuthProvider = (): 'keycloak' | 'local' => {
  const { currentProvider } = useAuthProviderContext()
  return currentProvider
}
