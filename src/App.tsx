import type { AuthClientError } from '@react-keycloak/core'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import SavedSlidesManager from './components/SavedSlides/SavedSlidesManager'
import { StreamingSlideGeneratorV2 } from './components/SlideGenerator'
import SlideLayoutDemo from './components/SlideGenerator/SlideLayoutDemo'
import path from './constants/path'
import { AuthProvider } from './contexts/AuthContext'
import ThemeProvider from './contexts/ThemeContext'
import keycloak from './core/keycloak'
import KeycloakProviderWithInit from './core/keycloak/KeycloakProviderWithInit'
import { useTokenManager } from './hooks/useTokenManager'
import Home from './pages/Home'
import Login from './pages/Login'
import Presentation from './pages/Presentation/Presentation'
import ProjectDetail from './pages/ProjectDetail'
import Register from './pages/Register'
import UserProfile from './pages/UserProfile'
import VideoPlayer from './pages/VideoPlayer'

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
          <TokenManagerProvider />
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

        {/* Enhanced AI Slide Generator Demo Route */}
        <Route
          path={path.slideGeneratorDemo}
          element={
            <Layout>
              <ProtectedRoute>
                <StreamingSlideGeneratorV2 />
              </ProtectedRoute>
            </Layout>
          }
        />

        {/* Slide Layout Assignment Demo Route */}
        <Route
          path='/slide-layout-demo'
          element={
            <Layout>
              <ProtectedRoute>
                <SlideLayoutDemo />
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path='/saved-slides'
          element={
            <Layout>
              <ProtectedRoute>
                <SavedSlidesManager />
              </ProtectedRoute>
            </Layout>
          }
        />

        {/* Keycloak auth routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        {/* Video player route */}
        <Route
          path='/video/:projectId'
          element={
            <Layout>
              <ProtectedRoute>
                <VideoPlayer />
              </ProtectedRoute>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

const TokenManagerProvider: React.FC = () => {
  useTokenManager() // Initialize token management
  return null
}

export default App
