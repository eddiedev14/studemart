import { toast, type ToastContentProps } from 'react-toastify'
import { useCart } from '@/features/cart/hooks/useCart'
import type { CartItem } from '@/features/cart/types/cart'
import { getItemName } from '@/features/cart/utils/cartItem'

// Arma el contenido de un aviso con botón "Deshacer". La librería le entrega closeToast al
// mostrarlo; al tocar el botón se deshace la acción y se cierra el aviso. shrink-0 evita que un
// mensaje largo aplaste el botón y parta la palabra "Deshacer".
function undoNotice(message: string, onUndo: () => void) {
  return ({ closeToast }: ToastContentProps) => (
    <div className="flex items-center gap-3">
      <span>{message}</span>
      <button
        type="button"
        className="shrink-0 font-bold text-secondary underline"
        onClick={() => {
          onUndo()
          closeToast()
        }}
      >
        Deshacer
      </button>
    </div>
  )
}

// Hook con las acciones del carrito que muestran un aviso. Así el panel de hoy y la página de
// mañana no repiten esta lógica. Cambiar la cantidad no está aquí porque no lleva aviso.
// containerId dice en qué contenedor de avisos salen: el panel lateral pasa el suyo, porque
// mientras está abierto tapa el contenedor principal.
export function useCartActions(containerId?: string) {
  const { items, addItem, removeItem, clearCart, restoreItem } = useCart()

  // Agrega el producto y avisa. El toastId por variante evita que agregar lo mismo varias veces
  // seguidas apile avisos iguales.
  function addItemWithNotice(item: CartItem) {
    addItem(item)
    toast.success(`Agregaste ${getItemName(item)} al carrito.`, {
      toastId: `add-${item.variantId}`,
      containerId,
    })
  }

  // Quita el producto y ofrece deshacerlo. Antes de quitarlo guarda su posición, para que
  // "Deshacer" lo devuelva al mismo lugar.
  function removeItemWithUndo(item: CartItem) {
    const index = items.findIndex((cartItem) => cartItem.variantId === item.variantId)
    removeItem(item.variantId)
    toast.info(
      undoNotice(`Quitaste ${getItemName(item)}.`, () => restoreItem(item, index)),
      { autoClose: 6000, containerId },
    )
  }

  // Vacía el carrito y ofrece deshacerlo. savedItems es la lista de antes de vaciar; "Deshacer"
  // devuelve cada producto a su posición sin borrar lo que el comprador agregó después.
  function clearCartWithUndo() {
    const savedItems = items
    clearCart()
    toast.info(
      undoNotice('Vaciaste tu carrito.', () =>
        savedItems.forEach((item, index) => restoreItem(item, index)),
      ),
      { autoClose: 6000, containerId },
    )
  }

  return { addItemWithNotice, removeItemWithUndo, clearCartWithUndo }
}
