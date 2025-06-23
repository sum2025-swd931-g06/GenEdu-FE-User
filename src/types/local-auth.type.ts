// Local auth types
export interface LocalAuthUser {
  id: string
  username: string
  fullName: string
  email: string
  emailVerified: boolean
  roles: string[]
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface LocalAuthContextType {
  user: LocalAuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  token: string | null
  refreshToken: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  updateToken: () => Promise<boolean>
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  fullName: string
}

export interface LoginResponse {
  user: LocalAuthUser
  token: string
  refreshToken: string
}

export interface RegisterResponse {
  user: LocalAuthUser
  token: string
  refreshToken: string
}
