export type Role = 'comprador' | 'emprendedor' | 'administrador'

export type AuthUser = {
  id: string
  name: string
  email: string
  role: Role
}

export type LoginCredentials = {
  email: string
  password: string
}

/** Lo que guardamos y exponemos de una sesión iniciada. */
export type Session = {
  token: string
  user: AuthUser
}

/** Desde qué puerta se inicia sesión: la pública (/login) o la oculta del administrador. */
export type LoginPortal = 'public' | 'admin'

export type AuthErrorCode = 'invalid_credentials' | 'server_error'
