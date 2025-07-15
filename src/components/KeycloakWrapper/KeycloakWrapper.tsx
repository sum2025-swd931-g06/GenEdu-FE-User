import { ReactKeycloakProvider } from '@react-keycloak/web'
import { Alert, Card, Typography } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { initOptions, isKeycloakInitialized, keycloak, setKeycloakInitialized } from '../../config/keycloak'
import Loader from '../Loader'

const { Title, Text } = Typography

interface KeycloakWrapperProps {
  children: React.ReactNode
}

const KeycloakWrapper: React.FC<KeycloakWrapperProps> = ({ children }) => {
  const [initError, setInitError] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const initRef = useRef(false)

  const handleKeycloakEvent = (event: string, error?: unknown) => {
    console.log('Keycloak event:', event, error)

    if (event === 'onInitError') {
      setInitError(error?.toString() || 'Failed to initialize Keycloak')
      setIsInitializing(false)
      setKeycloakInitialized(false)
    } else if (event === 'onReady') {
      setIsInitializing(false)
      setInitError(null)
      setKeycloakInitialized(true)
    } else if (event === 'onAuthSuccess') {
      console.log('Keycloak authenticated successfully')
    } else if (event === 'onAuthError') {
      console.error('Keycloak authentication error:', error)
    }
  }

  // Prevent multiple initialization
  useEffect(() => {
    if (initRef.current || isKeycloakInitialized()) {
      setIsInitializing(false)
      return
    }
    initRef.current = true
  }, [])

  // Error component
  const ErrorComponent = () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '24px',
        background: '#f0f2f5'
      }}
    >
      <Card style={{ maxWidth: '500px', textAlign: 'center' }}>
        <Title level={3} type='danger'>
          Authentication Error
        </Title>
        <Alert
          message='Failed to initialize authentication'
          description={initError}
          type='error'
          showIcon
          style={{ marginBottom: '16px' }}
        />
        <Text type='secondary'>
          Please check your network connection and try refreshing the page. If the problem persists, contact support.
        </Text>
      </Card>
    </div>
  )

  if (isInitializing) {
    return <Loader />
  }

  if (initError) {
    return <ErrorComponent />
  }

  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={initOptions}
      LoadingComponent={<Loader />}
      onEvent={handleKeycloakEvent}
    >
      {children}
    </ReactKeycloakProvider>
  )
}

export default KeycloakWrapper
