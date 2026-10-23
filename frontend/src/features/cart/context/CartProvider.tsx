import { useEffect, useReducer, type ReactNode } from 'react'
import { toast } from 'react-toastify'
import { CartContext, type CartContextValue } from '@/features/cart/context/cartContext'
import { cartReducer } from '@/features/cart/context/cartReducer'
import { loadCart, saveCart } from '@/features/cart/utils/cartStorage'
import { groupByStore } from '@/features/cart/utils/cartSummary'

// Envuelve la aplicación y le da a todos los componentes de adentro acceso al carrito.
export function CartProvider({ children }: { children: ReactNode }) {
  // El "estado" es la memoria del componente; aquí vive la lista de productos. loadCart la llena
  // con lo guardado antes de pintar la página (el [] no se usa porque loadCart no recibe nada).
  const [items, dispatch] = useReducer(cartReducer, [], loadCart)

  // Un "efecto" es código que habla con algo de afuera de React. Este guarda el carrito en el
  // navegador cada vez que cambian los productos y avisa si no se pudo. El toastId fijo evita
  // que el mismo aviso se apile en cada cambio mientras sigue en pantalla.
  useEffect(() => {
    if (!saveCart(items)) {
      toast.error(
        'No pudimos guardar tu carrito en este navegador. Si recargas la página, se perderá.',
        { toastId: 'cart-save-error', role: 'alert' },
      )
    }
  }, [items])

  // Se calculan de nuevo a partir de items en cada cambio, así nunca quedan desactualizados.
  // El total suma los subtotales por tienda para que siempre coincidan.
  const groups = groupByStore(items)
  const total = groups.reduce((sum, group) => sum + group.subtotal, 0)
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0)

  // Lo que el comprador se ahorra: solo cuentan los productos en oferta (los que tienen precio
  // anterior), y se multiplica por la cantidad.
  const savings = items.reduce(
    (sum, item) =>
      item.originalPrice ? sum + (item.originalPrice - item.price) * item.quantity : sum,
    0,
  )

  // Lo que reciben los componentes. Cada acción le pide un cambio al reducer con dispatch.
  const value: CartContextValue = {
    items,
    groups,
    totalUnits,
    total,
    savings,
    addItem: (item) => dispatch({ type: 'ADD_ITEM', item }),
    removeItem: (variantId) => dispatch({ type: 'REMOVE_ITEM', variantId }),
    updateQuantity: (variantId, quantity) =>
      dispatch({ type: 'UPDATE_QUANTITY', variantId, quantity }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    restoreItem: (item, index) => dispatch({ type: 'RESTORE_ITEM', item, index }),
    setItems: (newItems) => dispatch({ type: 'SET_ITEMS', items: newItems }),
    // Cuántas unidades de esa variante hay en el carrito; 0 significa que no está.
    getQuantity: (variantId) => items.find((item) => item.variantId === variantId)?.quantity ?? 0,
  }

  return <CartContext value={value}>{children}</CartContext>
}
