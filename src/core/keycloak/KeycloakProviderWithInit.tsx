import { Component, ReactNode } from 'react'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import type { AuthClientError, AuthClientEvent } from '@react-keycloak/core'
import keycloak from './index'

const initOptions = {
  onLoad: 'check-sso' as const,
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
  checkLoginIframe: false,
  checkLoginIframeInterval: 0,
  enableLogging: true,
  pkceMethod: 'S256' as const,
  flow: 'standard' as const
}

interface KeycloakProviderWithInitProps {
  children: ReactNode
  onEvent?: (event: AuthClientEvent, error?: AuthClientError) => void
}

interface KeycloakProviderWithInitState {
  keycloakInitialized: boolean
}

class KeycloakProviderWithInit extends Component<KeycloakProviderWithInitProps, KeycloakProviderWithInitState> {
  constructor(props: KeycloakProviderWithInitProps) {
    super(props)
    this.state = {
      keycloakInitialized: false
    }
  }

  componentDidMount() {
    console.log('KeycloakProviderWithInit mounted')
    console.log('Keycloak instance:', keycloak)
    console.log('Keycloak authenticated:', keycloak.authenticated)

    // Prevent multiple initialization
    if (keycloak.authenticated !== undefined) {
      console.log('Keycloak already initialized')
      this.setState({ keycloakInitialized: true })
      return
    }
  }

  handleKeycloakEvent = (event: AuthClientEvent, error?: AuthClientError) => {
    console.log('Keycloak event in provider:', event, error)

    if (event === 'onReady') {
      console.log('Keycloak is ready')
    } else if (event === 'onInitError') {
      console.error('Keycloak init error:', error)
    }

    // Call the parent onEvent handler if provided
    if (this.props.onEvent) {
      this.props.onEvent(event, error)
    }
  }

  render() {
    const { children } = this.props

    return (
      <ReactKeycloakProvider
        authClient={keycloak}
        initOptions={initOptions}
        onEvent={this.handleKeycloakEvent}
        LoadingComponent={
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              fontSize: '18px',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div>Loading authentication...</div>
            <div style={{ fontSize: '14px', color: '#666' }}>Connecting to Keycloak server...</div>
          </div>
        }
      >
        {children}
      </ReactKeycloakProvider>
    )
  }
}

export default KeycloakProviderWithInit
