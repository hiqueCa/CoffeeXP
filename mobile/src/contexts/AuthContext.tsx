import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import * as SecureStore from 'expo-secure-store'
import { authApi, LoginRequest, RegisterRequest } from '../api/auth'

interface AuthContextType {
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    SecureStore.getItemAsync('token').then((t) => {
      setToken(t)
      setIsLoading(false)
    })
  }, [])

  const login = async (data: LoginRequest) => {
    const response = await authApi.login(data)
    const newToken = response.data.access_token
    await SecureStore.setItemAsync('token', newToken)
    setToken(newToken)
  }

  const register = async (data: RegisterRequest) => {
    await authApi.register(data)
  }

  const logout = async () => {
    await SecureStore.deleteItemAsync('token')
    setToken(null)
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
      }}
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
