import { AuthError } from '@/features/auth/auth.errors'
import type { LoginCredentials } from '@/features/auth/auth.types'
import { RegisterError } from '@/features/register/register.errors'
import type { Registration, RegisterResult } from '@/features/register/register.types'

/**
 * Backend de mentira para trabajar el diseño sin servidor.
 * Solo se usa con VITE_USE_MOCK_AUTH=true. Devuelve lo mismo que debería devolver el backend real.
 */

export const MOCK_PASSWORD = 'Studemart123'

const mockUsers: { id: string; name: string; email: string; role: string }[] = [
  { id: '1', name: 'Laura Gómez', email: 'comprador@studemart.test', role: 'comprador' },
  { id: '2', name: 'Carlos Ruiz', email: 'emprendedor@studemart.test', role: 'emprendedor' },
  { id: '3', name: 'Administrador Studemart', email: 'admin@studemart.test', role: 'administrador' },
]

/** Con este correo el mock simula una caída del servidor. */
export const MOCK_SERVER_ERROR_EMAIL = 'error@studemart.test'

const mockPasswords = new Map<string, string>()

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function mockLogin({ email, password }: LoginCredentials) {
  await wait(700)

  const normalizedEmail = email.trim().toLowerCase()

  if (normalizedEmail === MOCK_SERVER_ERROR_EMAIL) {
    throw new AuthError('server_error')
  }

  const user = mockUsers.find((candidate) => candidate.email === normalizedEmail)
  if (!user || password !== (mockPasswords.get(normalizedEmail) ?? MOCK_PASSWORD)) {
    throw new AuthError('invalid_credentials')
  }

  return { token: `mock-token-${user.role}-${Date.now()}`, user }
}

/** Correo que el mock siempre responde como "ya registrado". */
export const MOCK_TAKEN_EMAIL = 'existente@uao.edu.co'

/**
 * Registro de mentira. Los compradores nuevos quedan guardados mientras la página
 * no se recargue (así se puede probar el login con ellos). Las tiendas quedan
 * pendientes de aprobación y no pueden iniciar sesión todavía.
 */
export async function mockRegister(registration: Registration): Promise<RegisterResult> {
  await wait(900)

  const email = registration.email.trim().toLowerCase()

  if (email === MOCK_SERVER_ERROR_EMAIL) {
    throw new RegisterError('server_error')
  }
  if (email === MOCK_TAKEN_EMAIL || mockUsers.some((user) => user.email === email)) {
    throw new RegisterError('email_taken')
  }

  if (registration.role === 'comprador') {
    mockUsers.push({
      id: String(mockUsers.length + 1),
      name: registration.name,
      email,
      role: 'comprador',
    })
    mockPasswords.set(email, registration.password)
    return { role: 'comprador' }
  }

  return { role: 'emprendedor', storeStatus: 'pending', storeName: registration.store.name }
}
