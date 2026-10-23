import type { CartItem } from '@/features/cart/types/cart'

type CartAction =
  | { type: 'ADD_ITEM'; item: CartItem }
  | { type: 'REMOVE_ITEM'; variantId: string }
  | { type: 'UPDATE_QUANTITY'; variantId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'RESTORE_ITEM'; item: CartItem; index: number }

export function cartReducer(items: CartItem[], action: CartAction) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const exists = items.some((item) => item.variantId === action.item.variantId)

      if (!exists) {
        return [...items, action.item]
      }

      return items.map((item) =>
        item.variantId === action.item.variantId
          ? { ...item, quantity: item.quantity + action.item.quantity }
          : item,
      )
    }

    case 'REMOVE_ITEM':
      return items.filter((item) => item.variantId !== action.variantId)

    case 'UPDATE_QUANTITY':
      return items.map((item) =>
        item.variantId === action.variantId
          ? { ...item, quantity: Math.max(1, action.quantity) }
          : item,
      )

    case 'CLEAR_CART':
      return []

    case 'RESTORE_ITEM': {
      // Si el comprador volvió a agregar el producto antes de deshacer, no se duplica la fila.
      if (items.some((item) => item.variantId === action.item.variantId)) {
        return items
      }

      return [...items.slice(0, action.index), action.item, ...items.slice(action.index)]
    }
  }
}
