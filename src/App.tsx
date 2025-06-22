import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Presentation from './pages/Presentation/Presentation'
import UserProfile from './pages/UserProfile'
import ProjectDetail from './pages/ProjectDetail'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
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
  )
}

export default App
