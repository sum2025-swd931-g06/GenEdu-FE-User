import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return null // Or a loading spinner
  }

  if (!isAuthenticated) {
    // Redirect to login with the return URL
    return <Navigate to='/login' state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
