import React, { useState, useEffect, useCallback } from 'react'
import type { LocalAuthContextType, LocalAuthUser, LoginCredentials, RegisterData } from '../types/local-auth.type'
import { LocalAuthContext } from './local-auth-context'
import { localAuthService } from '../services/local-auth.service'

interface LocalAuthProviderProps {
  children: React.ReactNode
}

export const LocalAuthProvider: React.FC<LocalAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<LocalAuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true)

        // Check for stored tokens
        const storedToken = localAuthService.getStoredToken()
        const storedRefreshToken = localAuthService.getStoredRefreshToken()
        const storedUser = localAuthService.getStoredUser()

        if (storedToken && storedUser) {
          // Validate token with server
          const validatedUser = await localAuthService.validateToken()
          if (validatedUser) {
            setUser(validatedUser)
            setToken(storedToken)
            setRefreshToken(storedRefreshToken)
          } else {
            // Clear invalid tokens
            localAuthService.logout()
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        localAuthService.logout()
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true)

      // Try real API first, fallback to mock
      let response
      try {
        response = await localAuthService.login(credentials)
      } catch (error) {
        console.warn('Real API login failed, using mock:', error)
        response = await localAuthService.mockLogin(credentials)
      }

      setUser(response.user)
      setToken(response.token)
      setRefreshToken(response.refreshToken)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (data: RegisterData) => {
    try {
      setIsLoading(true)

      // Try real API first, fallback to mock
      let response
      try {
        response = await localAuthService.register(data)
      } catch (error) {
        console.warn('Real API register failed, using mock:', error)
        response = await localAuthService.mockRegister(data)
      }

      setUser(response.user)
      setToken(response.token)
      setRefreshToken(response.refreshToken)
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localAuthService.logout()
    setUser(null)
    setToken(null)
    setRefreshToken(null)
  }, [])

  const updateToken = useCallback(async (): Promise<boolean> => {
    try {
      const newToken = await localAuthService.refreshToken()
      setToken(newToken)
      return true
    } catch (error) {
      console.error('Token refresh failed:', error)
      logout()
      return false
    }
  }, [logout])

  // Auto-refresh token
  useEffect(() => {
    if (token) {
      const interval = setInterval(
        () => {
          updateToken()
        },
        15 * 60 * 1000
      ) // Refresh every 15 minutes

      return () => clearInterval(interval)
    }
  }, [token, updateToken])

  const value: LocalAuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    token,
    refreshToken,
    login,
    register,
    logout,
    updateToken
  }

  return <LocalAuthContext.Provider value={value}>{children}</LocalAuthContext.Provider>
}
