import { Navigate, useLocation } from 'react-router-dom'
import { PageLoader } from '../ui/PageStates'
import { useAuth } from '../../context/AuthContext'

export function ProtectedRoute({ children }) {
  const { isAuthenticated, bootstrapped } = useAuth()
  const location = useLocation()

  if (!bootstrapped) {
    return <PageLoader label="Checking session…" />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}

export function GuestRoute({ children }) {
  const { isAuthenticated, bootstrapped } = useAuth()

  if (!bootstrapped) {
    return <PageLoader label="Loading…" />
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}
