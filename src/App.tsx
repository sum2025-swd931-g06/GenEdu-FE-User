import { BrowserRouter, Route, Routes } from 'react-router-dom'
import type { AuthClientError } from '@react-keycloak/core'
import { AuthProvider } from './contexts/AuthContext'
import KeycloakProviderWithInit from './core/keycloak/KeycloakProviderWithInit'
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
    <KeycloakProviderWithInit onEvent={handleOnEvent}>
      <AuthProvider>
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
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </KeycloakProviderWithInit>
  )
}

export default App
