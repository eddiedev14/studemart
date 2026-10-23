import { useRef } from 'react'
import { flushSync } from 'react-dom'
import { FiShoppingCart, FiX } from 'react-icons/fi'
import { CartDrawerItem } from '@/features/cart/components/CartDrawerItem'
import { ClearCartButton } from '@/features/cart/components/ClearCartButton'
import { useCart } from '@/features/cart/hooks/useCart'
import { useCartActions } from '@/features/cart/hooks/useCartActions'
import type { CartItem } from '@/features/cart/types/cart'
import { formatPrice } from '@/features/cart/utils/money'
import { formatUnits } from '@/features/cart/utils/units'
import { Toaster } from '@/shared/components/Toaster'
import '@/features/cart/cart.css'

// Ícono del carrito con su contador y el panel lateral que abre. Es lo único que el Navbar tiene
// que poner. Como ClearCartButton, usa la ventana nativa del navegador.
export function CartDrawer() {
  const { groups, totalUnits, total, updateQuantity } = useCart()
  const { removeItemWithUndo, clearCartWithUndo } = useCartActions('cart-drawer')

  // Referencias al panel, para abrirlo, y a su título, para llevarle el foco al eliminar.
  const dialogRef = useRef<HTMLDialogElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  // Igual que en la página: elimina, actualiza la pantalla y deja el foco en el título sin mover
  // el scroll de la lista.
  function handleRemove(item: CartItem) {
    flushSync(() => removeItemWithUndo(item))
    headingRef.current?.focus({ preventScroll: true })
  }

  // Igual que al eliminar: vacía el carrito y deja el foco en el título, porque el botón
  // "Vaciar carrito" desaparece junto con el pie del panel.
  function handleClear() {
    flushSync(() => clearCartWithUndo())
    headingRef.current?.focus({ preventScroll: true })
  }

  return (
    <>
      {/* Botón del ícono. El contador se crea de nuevo cuando cambia el número (key), para que
          el pulso se repita. */}
      <button
        type="button"
        className="btn btn-square btn-ghost relative size-11"
        aria-label={
          totalUnits === 0 ? 'Abrir carrito, vacío' : `Abrir carrito, ${formatUnits(totalUnits)}`
        }
        onClick={() => dialogRef.current?.showModal()}
      >
        <FiShoppingCart className="size-6" aria-hidden />
        {totalUnits > 0 && (
          <span
            key={totalUnits}
            className="cart-badge-pulse absolute top-0 right-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-primary-content tabular-nums"
          >
            {totalUnits}
          </span>
        )}
      </button>

      {/* Panel lateral: modal-end lo pega a la derecha con todo el alto de la pantalla. */}
      <dialog ref={dialogRef} className="modal modal-end text-base-content">
        <div className="modal-box flex w-[420px] flex-col rounded-none p-0">
          <header className="flex items-center justify-between border-b border-base-300 px-6 py-3">
            <h2 ref={headingRef} tabIndex={-1} className="text-xl font-semibold">
              Tu carrito <span className="text-base-content/70">({totalUnits})</span>
            </h2>
            <form method="dialog">
              <button className="btn btn-square btn-ghost size-11" aria-label="Cerrar carrito">
                <FiX className="size-6" aria-hidden />
              </button>
            </form>
          </header>

          {groups.length === 0 ? (
            <p className="flex flex-1 items-center justify-center text-base-content/70">
              Tu carrito está vacío.
            </p>
          ) : (
            <>
              {/* Lista por tienda, sin subtotales. flex-1 y overflow-y-auto le dan su propio
                  scroll cuando no cabe, sin mover el encabezado ni el pie. */}
              <div className="flex-1 space-y-6 overflow-y-auto px-6 py-4">
                {groups.map((group) => (
                  <section key={group.storeId}>
                    <h3 className="text-xs font-bold tracking-[0.08em] text-secondary uppercase">
                      {group.storeName}
                    </h3>
                    <ul className="divide-y divide-base-300">
                      {group.items.map((item) => (
                        <CartDrawerItem
                          key={item.variantId}
                          item={item}
                          onQuantityChange={(quantity) => updateQuantity(item.variantId, quantity)}
                          onRemove={() => handleRemove(item)}
                        />
                      ))}
                    </ul>
                  </section>
                ))}
              </div>

              {/* Pie con el total, que el lector de pantalla anuncia cuando cambia, y Vaciar. */}
              <footer className="space-y-4 border-t border-base-300 px-6 py-4">
                <p aria-live="polite" className="flex items-baseline justify-between">
                  <span>Total</span>
                  <span className="text-xl font-bold tabular-nums lining-nums">
                    {formatPrice(total)}
                  </span>
                </p>
                <ClearCartButton onConfirm={handleClear} />
              </footer>
            </>
          )}
        </div>

        {/* Avisos del panel. Van adentro porque el panel tapa el contenedor principal y no
            dejaría tocar "Deshacer". */}
        <Toaster containerId="cart-drawer" />

        {/* Fondo oscuro: un clic afuera del panel lo cierra. tabIndex={-1} saca su botón, que no
            se ve, del recorrido con Tab; con teclado el panel se cierra con Escape. */}
        <form method="dialog" className="modal-backdrop">
          <button tabIndex={-1}>Cerrar</button>
        </form>
      </dialog>
    </>
  )
}
