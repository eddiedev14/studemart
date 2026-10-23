import { createContext } from 'react'
import type { AuthUser, LoginCredentials, LoginPortal } from './auth.types'

export type AuthContextValue = {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  /** true cuando la sesión se cerró porque el token venció (401). */
  sessionExpired: boolean
  /** Inicia sesión. Lanza AuthError si falla. Devuelve el usuario para poder redirigir por rol. */
  login: (credentials: LoginCredentials, portal?: LoginPortal) => Promise<AuthUser>
  logout: () => void
  dismissSessionExpired: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
