import type { RegisterErrorCode } from './register.types'

export class RegisterError extends Error {
  code: RegisterErrorCode

  constructor(code: RegisterErrorCode) {
    super(code)
    this.name = 'RegisterError'
    this.code = code
  }
}

export const registerErrorMessages: Record<
  Exclude<RegisterErrorCode, 'email_taken'>,
  { title: string; message: string }
> = {
  invalid_data: {
    title: 'Revisa tus datos',
    message: 'El servidor no aceptó la información enviada. Verifica los campos e inténtalo de nuevo.',
  },
  server_error: {
    title: 'No pudimos crear tu cuenta',
    message: 'Hubo un problema con el servidor. Inténtalo de nuevo en unos minutos.',
  },
}

export const EMAIL_TAKEN_MESSAGE = 'Este correo ya está registrado'
