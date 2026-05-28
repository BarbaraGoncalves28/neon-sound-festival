import { useState } from 'react'
import { AuthContext } from '../context/authContext'
import {
  authenticateUser,
  clearCurrentUser,
  createUser,
  getCurrentUser,
  updateUserProfile,
} from '../services/authService'
import type { AuthActionResult, AuthUpdatePayload, User } from '../types/auth'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getCurrentUser())

  function login(email: string, password: string): AuthActionResult {
    const result = authenticateUser(email, password)

    if (result.success && result.user) {
      setUser(result.user)
    }

    return result
  }

  function register(
    name: string,
    email: string,
    password: string,
  ): AuthActionResult {
    const result = createUser({ name, email, password })

    if (result.success && result.user) {
      setUser(result.user)
    }

    return result
  }

  function logout() {
    clearCurrentUser()
    setUser(null)
  }

  function updateUser(payload: AuthUpdatePayload): AuthActionResult {
    if (!user) {
      return {
        success: false,
        message: 'Usuário não está logado.',
      }
    }

    const result = updateUserProfile(payload, user)

    if (result.success && result.user) {
      setUser(result.user)
    }

    return result
  }

  const value = { user, login, register, logout, updateUser }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
