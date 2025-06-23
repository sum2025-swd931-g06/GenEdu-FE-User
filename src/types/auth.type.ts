import type Keycloak from 'keycloak-js'

// Project types
export interface Project {
  id: string
  title: string
  status: ProjectStatus
  creationTime: number
  slideNum?: number
  audioProject?: AudioProject
}

export type ProjectStatus = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED'

export interface AudioProject {
  id: string
  title: string
  status: AudioProjectStatus
  creationTime: number
  durationSeconds?: number
  textContent?: string
  audioUrl?: string
  voiceType?: string
}

export type AudioProjectStatus = 'DRAFT' | 'PROCESSING' | 'COMPLETED'

export interface UserData {
  id: string
  name: string
  email: string
  idNumber: string
}

export interface Slide {
  id: string
  title: string
  content: string
  order: number
}

export interface ProjectDetail extends Project {
  slides: Slide[]
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
