import { createContext } from 'react'
import type { CartItem, StoreGroup } from '@/features/cart/types/cart'

// Todo lo que el carrito ofrece a los componentes: los datos para mostrar y las acciones
// para cambiarlo.
export interface CartContextValue {
  items: CartItem[]
  groups: StoreGroup[]
  totalUnits: number
  total: number
  savings: number
  addItem: (item: CartItem) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
  restoreItem: (item: CartItem, index: number) => void
  setItems: (items: CartItem[]) => void
  getQuantity: (variantId: string) => number
}

// El "contexto" es un lugar compartido donde CartProvider deja el carrito para que cualquier
// componente lo lea. Empieza en null para detectar si alguien lo usa fuera de CartProvider.
export const CartContext = createContext<CartContextValue | null>(null)
