import { BrowserRouter, Route, Routes } from 'react-router-dom'
import type { AuthClientError } from '@react-keycloak/core'
import ThemeProvider from './contexts/ThemeContext'
import KeycloakProviderWithInit from './core/keycloak/KeycloakProviderWithInit'
import { AuthProvider } from './contexts/AuthContext'
import keycloak from './core/keycloak'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Presentation from './pages/Presentation/Presentation'
import UserProfile from './pages/UserProfile'
import ProjectDetail from './pages/ProjectDetail'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  const handleOnEvent = async (event: string, error: AuthClientError | undefined) => {
    try {
      if (event === 'onAuthSuccess' && keycloak.authenticated && keycloak.tokenParsed) {
        console.log('User authenticated successfully')
      } else if (event === 'onAuthLogout') {
        console.log('User logged out')
      } else if (event === 'onInitError') {
        console.error('Keycloak initialization error:', error)
      }
    } catch (err) {
      console.error('Error during authentication', err)
    }
  }

  return (
    <ThemeProvider>
      <KeycloakProviderWithInit onEvent={handleOnEvent}>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </KeycloakProviderWithInit>
    </ThemeProvider>
  )
}

// Separate component for routes
const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path='/presentation'
          element={
            <Layout>
              <Presentation />
            </Layout>
          }
        />
        <Route
          path='/profile'
          element={
            <Layout>
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path='/project/:id'
          element={
            <Layout>
              <ProtectedRoute>
                <ProjectDetail />
              </ProtectedRoute>
            </Layout>
          }
        />

        {/* Keycloak auth routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
