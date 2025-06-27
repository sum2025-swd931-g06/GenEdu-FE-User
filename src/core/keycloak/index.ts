import Keycloak from 'keycloak-js'

export const isDev = process.env.NODE_ENV === 'development'

export const config = {
  kc: {
    KEYCLOAK_BASE_URL: isDev ? 'http://localhost:9099' : 'https://kc.lch.id.vn',
    REALM_NAME: 'GenEdu',
    CLIENT_ID: 'genedu-fe'
  }
}

// Keycloak configuration
export const keycloakConfig = {
  url: config.kc.KEYCLOAK_BASE_URL,
  realm: config.kc.REALM_NAME,
  clientId: config.kc.CLIENT_ID
}

// Create a singleton Keycloak instance
const keycloak = new Keycloak(keycloakConfig)

export default keycloak
