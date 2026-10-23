import type { AuthErrorCode } from './auth.types'

export class AuthError extends Error {
  code: AuthErrorCode

  constructor(code: AuthErrorCode) {
    super(code)
    this.name = 'AuthError'
    this.code = code
  }
}

export const authErrorMessages: Record<AuthErrorCode, { title: string; message: string }> = {
  invalid_credentials: {
    title: 'Credenciales incorrectas',
    message: 'El correo o la contraseña no son correctos. Revísalos e inténtalo de nuevo.',
  },
  server_error: {
    title: 'No pudimos iniciar sesión',
    message: 'Hubo un problema con el servidor. Inténtalo de nuevo en unos minutos.',
  },
}
