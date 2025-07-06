import type Keycloak from 'keycloak-js'

export interface UserData {
  id: string
  name: string
  email: string
  idNumber: string
}

// Keycloak Auth types
export interface KeycloakAuthenticatedData {
  isAuthenticated: boolean
  token: string
  refreshToken: string
  userInfo: {
    id: string
    username: string
    fullName: string
    email: string
    emailVerified: boolean
    roles: string[]
  }
}

export interface AuthUser {
  id: string
  username: string
  fullName: string
  email: string
  emailVerified: boolean
  roles: string[]
  avatar?: string
}

export interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  token: string | null
  refreshToken: string | null
  keycloak: Keycloak // Keycloak instance
  login: () => void
  logout: () => void
  updateToken: () => Promise<boolean>
}
