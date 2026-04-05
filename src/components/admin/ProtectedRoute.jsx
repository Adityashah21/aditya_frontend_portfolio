import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { isAdmin, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen bg-cyber-bg flex items-center justify-center">
      <span className="font-mono text-cyber-primary animate-pulse">Verifying access...</span>
    </div>
  )
  return isAdmin ? children : <Navigate to="/admin/login" replace />
}
