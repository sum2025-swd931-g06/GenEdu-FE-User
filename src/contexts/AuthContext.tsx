import React, { useState, useEffect, useCallback } from 'react'
import { useKeycloak } from '@react-keycloak/web'
import type { AuthUser, AuthContextType } from '../types/auth.type'
import { AuthContext } from './auth-context'

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { keycloak, initialized } = useKeycloak()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Parse user info from Keycloak token
  const parseUserFromKeycloak = useCallback((): AuthUser | null => {
    if (!keycloak.authenticated || !keycloak.tokenParsed) {
      return null
    }

    const tokenParsed = keycloak.tokenParsed as Record<string, unknown>
    const realmAccess = (tokenParsed?.realm_access as Record<string, unknown>) || {}
    const roles = (realmAccess.roles as string[]) || []

    return {
      id: (tokenParsed?.sub as string) || '',
      username: (tokenParsed?.preferred_username as string) || '',
      fullName: (tokenParsed?.name as string) || (tokenParsed?.preferred_username as string) || '',
      email: (tokenParsed?.email as string) || '',
      emailVerified: (tokenParsed?.email_verified as boolean) || false,
      roles,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${(tokenParsed?.preferred_username as string) || 'user'}`
    }
  }, [keycloak.authenticated, keycloak.tokenParsed])

  // Update user when Keycloak state changes
  useEffect(() => {
    if (initialized) {
      setIsLoading(false)
      if (keycloak.authenticated) {
        const userData = parseUserFromKeycloak()
        setUser(userData)
      } else {
        setUser(null)
      }
    }
  }, [initialized, keycloak.authenticated, parseUserFromKeycloak])

  // Handle token refresh
  const updateToken = useCallback(async (): Promise<boolean> => {
    try {
      const refreshed = await keycloak.updateToken(70) // Refresh if token expires in 70 seconds
      if (refreshed) {
        console.log('Token refreshed')
        const userData = parseUserFromKeycloak()
        setUser(userData)
      }
      return refreshed
    } catch (error) {
      console.error('Failed to refresh token:', error)
      return false
    }
  }, [keycloak, parseUserFromKeycloak])

  // Login function
  const login = useCallback(() => {
    keycloak.login({
      redirectUri: window.location.origin + '/profile'
    })
  }, [keycloak])

  // Logout function
  const logout = useCallback(() => {
    keycloak.logout({
      redirectUri: window.location.origin
    })
  }, [keycloak])

  // Auto-refresh token
  useEffect(() => {
    if (keycloak.authenticated) {
      const interval = setInterval(() => {
        updateToken()
      }, 60000) // Check every minute

      return () => clearInterval(interval)
    }
  }, [keycloak.authenticated, updateToken])

  const value: AuthContextType = {
    user,
    isAuthenticated: keycloak.authenticated || false,
    isLoading: isLoading || !initialized,
    token: keycloak.token || null,
    refreshToken: keycloak.refreshToken || null,
    keycloak,
    login,
    logout,
    updateToken
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
