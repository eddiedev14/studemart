import type { Role, Session } from './auth.types'

/**
 * DÓNDE SE GUARDA LA SESIÓN (decisión pendiente con el equipo).
 *
 * - localStorage:   sobrevive a cerrar la pestaña y el navegador. (valor actual)
 * - sessionStorage: se borra al cerrar la pestaña; más estricto.
 * - Cookie httpOnly: lo más seguro (el JS no puede leer el token), pero lo
 *   implementa el backend; en ese caso este archivo deja de guardar el token.
 *
 * Cambiar la decisión es cambiar `getStorage()`; nada más depende de ella.
 */
const SESSION_KEY = 'studemart.session'

const ROLES: Role[] = ['comprador', 'emprendedor', 'administrador']

function getStorage(): Storage {
  return window.localStorage
}

function isSession(value: unknown): value is Session {
  if (typeof value !== 'object' || value === null) return false
  const { token, user } = value as Partial<Session>
  return (
    typeof token === 'string' &&
    token.length > 0 &&
    typeof user === 'object' &&
    user !== null &&
    typeof user.name === 'string' &&
    typeof user.email === 'string' &&
    ROLES.includes(user.role as Role)
  )
}

export function loadSession(): Session | null {
  try {
    const raw = getStorage().getItem(SESSION_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return isSession(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function saveSession(session: Session): void {
  try {
    getStorage().setItem(SESSION_KEY, JSON.stringify(session))
  } catch {
    // Almacenamiento bloqueado (modo privado): la sesión dura solo en memoria.
  }
}

export function clearSession(): void {
  try {
    getStorage().removeItem(SESSION_KEY)
  } catch {
    // Nada que borrar.
  }
}

export function getToken(): string | null {
  return loadSession()?.token ?? null
}
