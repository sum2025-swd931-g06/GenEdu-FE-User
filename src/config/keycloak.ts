import Keycloak from 'keycloak-js'
import { keycloakConfig } from '../core/keycloak'

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
