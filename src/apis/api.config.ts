import axios from 'axios'

const API_BASE_URL = 'http://localhost:8222/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Token getter function - to be set by the app
let getAuthToken: (() => string | null) | null = null

// Function to set the token getter from your Keycloak context
export const setTokenGetter = (tokenGetter: () => string | null) => {
  getAuthToken = tokenGetter
}

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    // Try to get token from the registered token getter first
    if (getAuthToken) {
      const token = getAuthToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        return config
      }
    }

    // Fallback to localStorage
    const localToken = localStorage.getItem('token')
    if (localToken) {
      config.headers.Authorization = `Bearer ${localToken}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      console.log('Token expired or invalid, clearing storage')
      localStorage.removeItem('token')
      // You can also trigger a redirect to login page here if needed
      // window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
