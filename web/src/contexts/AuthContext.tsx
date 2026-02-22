import { createContext, useContext, useState, type ReactNode } from 'react'
import { authApi } from '../api/auth'
import type { LoginRequest, RegisterRequest } from '../api/auth'

interface AuthContextType {
  token: string | null
  isAuthenticated: boolean
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  )

  const login = async (data: LoginRequest) => {
    const response = await authApi.login(data)
    const newToken = response.data.access_token
    localStorage.setItem('token', newToken)
    setToken(newToken)
  }

  const register = async (data: RegisterRequest) => {
    await authApi.register(data)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated: !!token, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
