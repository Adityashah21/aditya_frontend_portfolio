import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    setIsAdmin(!!token)
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const res = await axios.post(`${API}/admin/login`, { email, password })
    localStorage.setItem('adminToken', res.data.token)
    setIsAdmin(true)
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    setIsAdmin(false)
  }

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)