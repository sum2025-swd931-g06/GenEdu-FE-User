import { useKeycloak } from '@react-keycloak/web'
import { useEffect } from 'react'
import { setTokenGetter } from '../apis/api.config'

export const useTokenManager = () => {
  const { keycloak } = useKeycloak()

  const getAuthToken = (): string | null => {
    // Try to get token from Keycloak first
    if (keycloak.authenticated && keycloak.token) {
      console.log('Using Keycloak token')
      return keycloak.token
    }

    // Fallback to localStorage
    const localToken = localStorage.getItem('token')
    if (localToken) {
      console.log('Using localStorage token')
      return localToken
    }

    console.log('No token available')
    return null
  }

  // Register the token getter with the API config
  useEffect(() => {
    setTokenGetter(getAuthToken)
  }, [keycloak.authenticated, keycloak.token])

  return { getAuthToken }
}
