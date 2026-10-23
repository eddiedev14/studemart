import {
  ALLOWED_EMAIL_DOMAINS,
  INSTITUTIONAL_EMAIL_EXAMPLE,
  PASSWORD_MIN_LENGTH,
  STORE_DESCRIPTION_LIMITS,
  STORE_NAME_LIMITS,
} from '@/config/registration'

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const registerMessages = {
  nameRequired: 'Ingresa tu nombre completo',
  nameShort: 'Escribe tu nombre y apellido',
  emailRequired: 'Ingresa tu correo institucional',
  emailInvalid: 'Ingresa un correo con formato válido',
  emailDomain: `Usa tu correo institucional (${INSTITUTIONAL_EMAIL_EXAMPLE})`,
  passwordRequired: 'Crea una contraseña',
  passwordShort: `Debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`,
  passwordWeak: 'Debe incluir al menos una letra y un número',
  confirmRequired: 'Repite tu contraseña',
  confirmMismatch: 'Las contraseñas no coinciden',
  storeNameRequired: 'Ingresa el nombre de tu tienda',
  storeNameLength: `Entre ${STORE_NAME_LIMITS.min} y ${STORE_NAME_LIMITS.max} caracteres`,
  storeCategoryRequired: 'Selecciona una categoría',
  storeDescriptionRequired: 'Cuéntanos qué vendes',
  storeDescriptionShort: `Escribe al menos ${STORE_DESCRIPTION_LIMITS.min} caracteres`,
} as const

export function isAllowedEmailDomain(email: string): boolean {
  if (ALLOWED_EMAIL_DOMAINS.length === 0) return true
  const domain = email.trim().toLowerCase().split('@')[1]
  return ALLOWED_EMAIL_DOMAINS.includes(domain)
}

export function validateEmail(value: string): true | string {
  const email = value.trim()
  if (!EMAIL_PATTERN.test(email)) return registerMessages.emailInvalid
  if (!isAllowedEmailDomain(email)) return registerMessages.emailDomain
  return true
}

export function validatePassword(value: string): true | string {
  if (value.length < PASSWORD_MIN_LENGTH) return registerMessages.passwordShort
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) return registerMessages.passwordWeak
  return true
}
