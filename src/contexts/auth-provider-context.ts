import { createContext } from 'react'

interface AuthProviderContextType {
  currentProvider: 'keycloak' | 'local'
  switchProvider: (provider: 'keycloak' | 'local') => void
}

export const AuthProviderContext = createContext<AuthProviderContextType | undefined>(undefined)
