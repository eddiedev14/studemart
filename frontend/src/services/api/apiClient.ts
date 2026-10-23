import axios from 'axios'
import { getToken } from '@/features/auth/auth.storage'

/** Rutas de auth: no llevan token y un 401 aquí significa "credenciales incorrectas". */
export const AUTH_ENDPOINTS = {
  login: '/auth/login',
  registerBuyer: '/auth/register/buyer',
  registerSeller: '/auth/register/seller',
  adminLogin: '/auth/admin/login',
} as const

const AUTH_PATHS: string[] = Object.values(AUTH_ENDPOINTS)

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
})

function isAuthRequest(url: string | undefined): boolean {
  return url !== undefined && AUTH_PATHS.includes(url)
}

// Cuando el backend responde 401 con un token puesto, la sesión venció.
// AuthProvider registra aquí qué hacer en ese caso.
let unauthorizedHandler: (() => void) | null = null

export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler
}

apiClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token && !isAuthRequest(config.url)) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      !isAuthRequest(error.config?.url)
    ) {
      unauthorizedHandler?.()
    }
    return Promise.reject(error)
  },
)
