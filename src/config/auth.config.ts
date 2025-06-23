// Authentication configuration
export interface AuthConfig {
  provider: 'keycloak' | 'local'
  keycloak: {
    enabled: boolean
    url: string
    realm: string
    clientId: string
  }
  local: {
    enabled: boolean
    apiUrl: string
  }
}

// Environment-based configuration
export const authConfig: AuthConfig = {
  provider: (import.meta.env.VITE_AUTH_PROVIDER as 'keycloak' | 'local') || 'keycloak',
  keycloak: {
    enabled: import.meta.env.VITE_KEYCLOAK_ENABLED === 'true',
    url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080',
    realm: import.meta.env.VITE_KEYCLOAK_REALM || 'GenEdu',
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'genedu-frontend'
  },
  local: {
    enabled: import.meta.env.VITE_LOCAL_AUTH_ENABLED === 'true',
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
  }
}

// Runtime configuration for hot-swapping
let runtimeAuthProvider: 'keycloak' | 'local' = authConfig.provider

// Key for localStorage to persist manual provider selection
const MANUAL_PROVIDER_KEY = 'genedu_manual_auth_provider'

export const getAuthProvider = (): 'keycloak' | 'local' => runtimeAuthProvider

export const setAuthProvider = (provider: 'keycloak' | 'local', persist: boolean = true) => {
  runtimeAuthProvider = provider
  if (persist) {
    localStorage.setItem(MANUAL_PROVIDER_KEY, provider)
  }
  console.log(`Auth provider switched to: ${provider}${persist ? ' (persisted)' : ''}`)
}

export const getManualAuthProvider = (): 'keycloak' | 'local' | null => {
  const stored = localStorage.getItem(MANUAL_PROVIDER_KEY)
  return stored as 'keycloak' | 'local' | null
}

export const clearManualAuthProvider = () => {
  localStorage.removeItem(MANUAL_PROVIDER_KEY)
}

// Check if Keycloak is available
export const checkKeycloakAvailability = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${authConfig.keycloak.url}/realms/${authConfig.keycloak.realm}`, {
      method: 'GET',
      timeout: 5000 // 5 second timeout
    } as RequestInit & { timeout: number })
    return response.ok
  } catch (error) {
    console.warn('Keycloak not available:', error)
    return false
  }
}

// Auto-detect and switch auth provider
export const autoDetectAuthProvider = async (): Promise<'keycloak' | 'local'> => {
  // Check if user has manually selected a provider
  const manualProvider = getManualAuthProvider()
  if (manualProvider) {
    console.log(`Using manually selected provider: ${manualProvider}`)
    setAuthProvider(manualProvider, false) // Don't persist again
    return manualProvider
  }

  // Check environment variable override
  if (authConfig.provider === 'local') {
    return 'local'
  }

  // Auto-detect based on Keycloak availability
  const keycloakAvailable = await checkKeycloakAvailability()
  if (!keycloakAvailable) {
    console.warn('Keycloak not available, switching to local auth')
    setAuthProvider('local', false) // Don't persist auto-detection
    return 'local'
  }

  setAuthProvider('keycloak', false) // Don't persist auto-detection
  return 'keycloak'
}
