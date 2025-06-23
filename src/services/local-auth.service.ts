import { authConfig } from '../config/auth.config'
import type {
  LoginCredentials,
  RegisterData,
  LoginResponse,
  RegisterResponse,
  LocalAuthUser
} from '../types/local-auth.type'

class LocalAuthService {
  private baseUrl: string

  constructor() {
    this.baseUrl = authConfig.local.apiUrl
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Login failed')
      }

      const data = await response.json()

      // Store tokens in localStorage
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('refresh_token', data.refreshToken)
      localStorage.setItem('user_data', JSON.stringify(data.user))

      return data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  async register(data: RegisterData): Promise<RegisterResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Registration failed')
      }

      const responseData = await response.json()

      // Store tokens in localStorage
      localStorage.setItem('auth_token', responseData.token)
      localStorage.setItem('refresh_token', responseData.refreshToken)
      localStorage.setItem('user_data', JSON.stringify(responseData.user))

      return responseData
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  async refreshToken(): Promise<string> {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${refreshToken}`
        }
      })

      if (!response.ok) {
        throw new Error('Token refresh failed')
      }

      const data = await response.json()
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('refresh_token', data.refreshToken)

      return data.token
    } catch (error) {
      console.error('Token refresh error:', error)
      this.logout()
      throw error
    }
  }

  async validateToken(): Promise<LocalAuthUser | null> {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        return null
      }

      const response = await fetch(`${this.baseUrl}/auth/validate`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        // Try to refresh token
        try {
          await this.refreshToken()
          const newToken = localStorage.getItem('auth_token')
          const retryResponse = await fetch(`${this.baseUrl}/auth/validate`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${newToken}`
            }
          })

          if (!retryResponse.ok) {
            throw new Error('Token validation failed')
          }

          const userData = await retryResponse.json()
          return userData.user
        } catch {
          this.logout()
          return null
        }
      }

      const userData = await response.json()
      return userData.user
    } catch (error) {
      console.error('Token validation error:', error)
      this.logout()
      return null
    }
  }

  logout(): void {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_data')
  }

  getStoredUser(): LocalAuthUser | null {
    try {
      const userData = localStorage.getItem('user_data')
      return userData ? JSON.parse(userData) : null
    } catch {
      return null
    }
  }

  getStoredToken(): string | null {
    return localStorage.getItem('auth_token')
  }

  getStoredRefreshToken(): string | null {
    return localStorage.getItem('refresh_token')
  }

  // Mock API for development/fallback
  async mockLogin(credentials: LoginCredentials): Promise<LoginResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock validation
    if (credentials.email === 'demo@example.com' && credentials.password === 'demo123') {
      const mockUser: LocalAuthUser = {
        id: 'mock-user-id',
        username: 'demo',
        fullName: 'Demo User',
        email: 'demo@example.com',
        emailVerified: true,
        roles: ['user'],
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const mockResponse: LoginResponse = {
        user: mockUser,
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now()
      }

      // Store in localStorage
      localStorage.setItem('auth_token', mockResponse.token)
      localStorage.setItem('refresh_token', mockResponse.refreshToken)
      localStorage.setItem('user_data', JSON.stringify(mockResponse.user))

      return mockResponse
    } else {
      throw new Error('Invalid credentials. Use demo@example.com / demo123')
    }
  }

  async mockRegister(data: RegisterData): Promise<RegisterResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockUser: LocalAuthUser = {
      id: 'mock-user-' + Date.now(),
      username: data.username,
      fullName: data.fullName,
      email: data.email,
      emailVerified: false,
      roles: ['user'],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const mockResponse: RegisterResponse = {
      user: mockUser,
      token: 'mock-jwt-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now()
    }

    // Store in localStorage
    localStorage.setItem('auth_token', mockResponse.token)
    localStorage.setItem('refresh_token', mockResponse.refreshToken)
    localStorage.setItem('user_data', JSON.stringify(mockResponse.user))

    return mockResponse
  }
}

export const localAuthService = new LocalAuthService()
