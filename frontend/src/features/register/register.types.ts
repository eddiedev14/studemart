import type { Role } from '@/features/auth/auth.types'

/** Solo estos dos roles se registran por el formulario público. */
export type RegisterRole = Extract<Role, 'comprador' | 'emprendedor'>

export type RegisterFormValues = {
  name: string
  email: string
  password: string
  confirmPassword: string
  storeName: string
  storeCategory: string
  storeDescription: string
}

export type BuyerRegistration = {
  role: 'comprador'
  name: string
  email: string
  password: string
}

export type SellerRegistration = {
  role: 'emprendedor'
  name: string
  email: string
  password: string
  store: {
    name: string
    category: string
    description: string
  }
}

export type Registration = BuyerRegistration | SellerRegistration

export type RegisterResult = {
  role: RegisterRole
  /** Las tiendas nuevas quedan 'pending' hasta que el administrador las apruebe. */
  storeStatus?: 'pending'
  storeName?: string
}

export type RegisterErrorCode = 'email_taken' | 'invalid_data' | 'server_error'
