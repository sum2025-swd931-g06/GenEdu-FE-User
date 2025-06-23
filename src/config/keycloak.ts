import Keycloak from 'keycloak-js'

const isDev = process.env.NODE_ENV === 'development'

export const config = {
  kc: {
    KEYCLOAK_BASE_URL: isDev ? 'http://zimacube:9080' : 'https://kc.lch.id.vn',
    REALM_NAME: 'GenEdu',
    CLIENT_ID: 'genedu-fe'
  }
}

// Keycloak configuration
const keycloakConfig = {
  url: config.kc.KEYCLOAK_BASE_URL,
  realm: config.kc.REALM_NAME,
  clientId: config.kc.CLIENT_ID
}

// Singleton pattern to prevent multiple initialization
let keycloakInstance: Keycloak | null = null
let isInitialized = false

export const getKeycloak = (): Keycloak => {
  if (!keycloakInstance) {
    keycloakInstance = new Keycloak(keycloakConfig)
  }
  return keycloakInstance
}

export const isKeycloakInitialized = (): boolean => {
  return isInitialized
}

export const setKeycloakInitialized = (initialized: boolean): void => {
  isInitialized = initialized
}

// Initialize Keycloak instance
export const keycloak = getKeycloak()

// Keycloak init options
export const initOptions = {
  onLoad: 'check-sso' as const,
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
  checkLoginIframe: false,
  checkLoginIframeInterval: 0,
  enableLogging: true,
  pkceMethod: 'S256' as const,
  flow: 'standard' as const
}
