import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import api from '../services/api'

const STORAGE_KEY = 'marketing-dashboard-auth'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    if (stored) {
      const parsed = JSON.parse(stored)
      setUser(parsed.user)
      setToken(parsed.token)
      axios.defaults.headers.common.Authorization = `Bearer ${parsed.token}`
      api.defaults.headers.common.Authorization = `Bearer ${parsed.token}`
    }
    setLoading(false)
  }, [])

  const login = (data) => {
    setUser(data.user)
    setToken(data.token)
    axios.defaults.headers.common.Authorization = `Bearer ${data.token}`
    api.defaults.headers.common.Authorization = `Bearer ${data.token}`
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    delete axios.defaults.headers.common.Authorization
    delete api.defaults.headers.common.Authorization
    localStorage.removeItem(STORAGE_KEY)
  }

  const value = useMemo(() => ({ user, token, login, logout, loading }), [user, token, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
