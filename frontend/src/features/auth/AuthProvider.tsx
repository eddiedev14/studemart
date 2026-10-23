import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { setUnauthorizedHandler } from '@/services/api/apiClient'
import { authService } from '@/services/auth/auth.service'
import { AuthContext, type AuthContextValue } from './AuthContext'
import { clearSession, loadSession, saveSession } from './auth.storage'
import type { LoginCredentials, LoginPortal, Session } from './auth.types'

export function AuthProvider({ children }: { children: ReactNode }) {
  // Se lee una sola vez al montar: así la sesión sobrevive a recargar la página.
  const [session, setSession] = useState<Session | null>(() => loadSession())
  const [sessionExpired, setSessionExpired] = useState(false)

  const logout = useCallback(() => {
    clearSession()
    setSession(null)
  }, [])

  const login = useCallback(async (credentials: LoginCredentials, portal: LoginPortal = 'public') => {
    const next = await authService.login(credentials, portal)
    saveSession(next)
    setSession(next)
    setSessionExpired(false)
    return next.user
  }, [])

  const dismissSessionExpired = useCallback(() => setSessionExpired(false), [])

  // Token vencido (401): cerrar sesión y dejar el aviso para el login.
  useEffect(() => {
    const expire = () => {
      clearSession()
      setSession(null)
      setSessionExpired(true)
    }
    setUnauthorizedHandler(expire)

    // Solo en desarrollo: window.studemartDev.expireSession() simula un 401.
    if (import.meta.env.DEV) {
      ;(window as unknown as { studemartDev?: object }).studemartDev = { expireSession: expire }
    }

    return () => setUnauthorizedHandler(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: session !== null,
      sessionExpired,
      login,
      logout,
      dismissSessionExpired,
    }),
    [session, sessionExpired, login, logout, dismissSessionExpired],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
