import { useContext } from 'react'
import { CartContext } from '@/features/cart/context/cartContext'

// Hook para leer y cambiar el carrito desde cualquier componente. Si el componente no está
// dentro de CartProvider, lanza un error que dice qué falta en vez de fallar más adelante.
export function useCart() {
  const cart = useContext(CartContext)

  if (!cart) {
    throw new Error(
      'useCart se usó fuera de <CartProvider>. Envuelve la aplicación con <CartProvider> para usar el carrito.',
    )
  }

  return cart
}
