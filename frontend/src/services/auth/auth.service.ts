import axios from 'axios'
import { USE_MOCK_AUTH } from '@/config/env'
import { AuthError } from '@/features/auth/auth.errors'
import type { LoginCredentials, LoginPortal, Session } from '@/features/auth/auth.types'
import { apiClient, AUTH_ENDPOINTS } from '@/services/api/apiClient'
import { mockLogin } from './auth.mock'
import { toSession } from './auth.mapper'

const useMock = USE_MOCK_AUTH

const INVALID_CREDENTIALS_STATUS = [400, 401, 403]

function toAuthError(error: unknown): AuthError {
  if (error instanceof AuthError) return error
  if (
    axios.isAxiosError(error) &&
    error.response &&
    INVALID_CREDENTIALS_STATUS.includes(error.response.status)
  ) {
    return new AuthError('invalid_credentials')
  }
  // Sin respuesta (servidor caído, timeout), 5xx o cualquier otro fallo.
  return new AuthError('server_error')
}

/**
 * Contrato que debe cumplir el backend:
 *
 *   POST /auth/login          (compradores y emprendedores)
 *   POST /auth/admin/login    (solo administradores)
 *   body:      { email, password }
 *   200:       { token, user: { id, name, email, role } }
 *   401:       credenciales incorrectas
 *
 * Cada endpoint debe rechazar los roles que no le corresponden.
 */
export const authService = {
  async login(credentials: LoginCredentials, portal: LoginPortal = 'public'): Promise<Session> {
    try {
      const data = useMock
        ? await mockLogin(credentials)
        : (
            await apiClient.post(
              portal === 'admin' ? AUTH_ENDPOINTS.adminLogin : AUTH_ENDPOINTS.login,
              credentials,
            )
          ).data

      const session = toSession(data)

      // Defensa extra en el front: cada puerta solo admite los roles que le tocan.
      const isAdmin = session.user.role === 'administrador'
      if (isAdmin !== (portal === 'admin')) {
        throw new AuthError('invalid_credentials')
      }

      return session
    } catch (error) {
      throw toAuthError(error)
    }
  },
}
