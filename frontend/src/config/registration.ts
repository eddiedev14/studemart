import { USE_MOCK_AUTH } from './env'

/**
 * Dominios de correo aceptados para registrarse (correo institucional).
 * Lista vacía = se acepta cualquier dominio.
 * En modo de prueba también se acepta @studemart.test para poder usar los datos del mock.
 */
export const ALLOWED_EMAIL_DOMAINS: string[] = USE_MOCK_AUTH
  ? ['uao.edu.co', 'studemart.test']
  : ['uao.edu.co']

/** Texto que se muestra al usuario como ejemplo de correo institucional. */
export const INSTITUTIONAL_EMAIL_EXAMPLE = 'nombre@uao.edu.co'

export const PASSWORD_MIN_LENGTH = 8

/** Categorías de tienda provisionales: deben coincidir con las del catálogo (P6). */
export const STORE_CATEGORIES = [
  'Accesorios',
  'Arte y diseño',
  'Comida y bebidas',
  'Papelería',
  'Ropa',
  'Servicios',
  'Otros',
] as const

export const STORE_NAME_LIMITS = { min: 3, max: 40 } as const
export const STORE_DESCRIPTION_LIMITS = { min: 20, max: 200 } as const
