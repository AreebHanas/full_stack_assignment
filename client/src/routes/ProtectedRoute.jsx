import { Navigate, Outlet } from 'react-router-dom'

function ProtectedRoute() {
  const isAuthenticated = Boolean(localStorage.getItem('token'))

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoute
