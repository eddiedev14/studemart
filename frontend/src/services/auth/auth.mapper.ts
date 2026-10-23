import { AuthError } from '@/features/auth/auth.errors'
import type { Role, Session } from '@/features/auth/auth.types'

/**
 * Nombres del rol que puede mandar el backend → rol de la app.
 * Si el backend usa otro nombre, se agrega aquí y nada más cambia.
 */
const ROLE_ALIASES: Record<string, Role> = {
  comprador: 'comprador',
  buyer: 'comprador',
  customer: 'comprador',
  emprendedor: 'emprendedor',
  vendedor: 'emprendedor',
  seller: 'emprendedor',
  administrador: 'administrador',
  admin: 'administrador',
}

export function normalizeRole(value: unknown): Role | null {
  if (typeof value !== 'string') return null
  return ROLE_ALIASES[value.trim().toLowerCase()] ?? null
}

type RawLoginResponse = {
  token?: unknown
  user?: {
    id?: unknown
    name?: unknown
    nombre?: unknown
    email?: unknown
    role?: unknown
    rol?: unknown
  }
}

/** Convierte la respuesta del backend en una Session. Si no tiene la forma esperada, es error de servidor. */
export function toSession(data: unknown): Session {
  const { token, user } = (data ?? {}) as RawLoginResponse
  const role = normalizeRole(user?.role ?? user?.rol)
  const email = typeof user?.email === 'string' ? user.email : ''
  const name = [user?.name, user?.nombre].find((value) => typeof value === 'string') as
    | string
    | undefined

  if (typeof token !== 'string' || token.length === 0 || !user || !role) {
    throw new AuthError('server_error')
  }

  return {
    token,
    user: {
      id: String(user.id ?? email),
      name: name ?? email,
      email,
      role,
    },
  }
}
