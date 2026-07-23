import { createContext } from 'react'
import type { LoginRequest, RegisterRequest } from '../api/auth'

export interface AuthContextType {
  token: string | null
  isAuthenticated: boolean
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)
