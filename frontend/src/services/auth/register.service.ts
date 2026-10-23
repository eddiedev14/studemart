import axios from 'axios'
import { USE_MOCK_AUTH } from '@/config/env'
import { RegisterError } from '@/features/register/register.errors'
import type { Registration, RegisterResult } from '@/features/register/register.types'
import { apiClient, AUTH_ENDPOINTS } from '@/services/api/apiClient'
import { mockRegister } from './auth.mock'

function toRegisterError(error: unknown): RegisterError {
  if (error instanceof RegisterError) return error
  if (axios.isAxiosError(error) && error.response) {
    if (error.response.status === 409) return new RegisterError('email_taken')
    if (error.response.status === 400 || error.response.status === 422) {
      return new RegisterError('invalid_data')
    }
  }
  return new RegisterError('server_error')
}

/**
 * Contrato que debe cumplir el backend:
 *
 *   POST /auth/register/buyer
 *   body: { name, email, password }
 *
 *   POST /auth/register/seller
 *   body: { name, email, password, store: { name, category, description } }
 *   → la tienda queda en estado "pendiente de aprobación".
 *
 *   201: registro creado        409: el correo ya existe
 *   400 / 422: datos inválidos  (el backend debe volver a validar el dominio institucional)
 */
export const registerService = {
  async register(registration: Registration): Promise<RegisterResult> {
    try {
      if (USE_MOCK_AUTH) return await mockRegister(registration)

      if (registration.role === 'comprador') {
        const { name, email, password } = registration
        await apiClient.post(AUTH_ENDPOINTS.registerBuyer, { name, email, password })
        return { role: 'comprador' }
      }

      const { name, email, password, store } = registration
      await apiClient.post(AUTH_ENDPOINTS.registerSeller, { name, email, password, store })
      return { role: 'emprendedor', storeStatus: 'pending', storeName: store.name }
    } catch (error) {
      throw toRegisterError(error)
    }
  },
}
