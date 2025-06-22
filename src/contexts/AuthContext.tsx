import React, { useState, useEffect } from 'react'
import type { AuthUser, AuthContextType } from '../types/auth.type'
import { AuthContext } from './auth-context'

// Mock users for authentication
const mockUsers: AuthUser[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    role: 'STUDENT'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    role: 'TEACHER'
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    role: 'ADMIN'
  }
]

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('auth_user')
        if (savedUser) {
          const userData = JSON.parse(savedUser)
          setUser(userData)
        }
      } catch (error) {
        console.error('Error checking auth:', error)
        localStorage.removeItem('auth_user')
      } finally {
        setIsLoading(false)
      }
    }

    // Simulate async auth check
    setTimeout(checkAuth, 500)
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true)

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock login logic
        const foundUser = mockUsers.find((u) => u.email === email)

        if (foundUser && password === 'password123') {
          setUser(foundUser)
          localStorage.setItem('auth_user', JSON.stringify(foundUser))
          setIsLoading(false)
          resolve()
        } else {
          setIsLoading(false)
          reject(new Error('Invalid email or password'))
        }
      }, 1000) // Simulate network delay
    })
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth_user')
  }

  const updateProfile = async (data: Partial<AuthUser>): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (user) {
          const updatedUser = { ...user, ...data }
          setUser(updatedUser)
          localStorage.setItem('auth_user', JSON.stringify(updatedUser))
        }
        resolve()
      }, 500)
    })
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateProfile
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
