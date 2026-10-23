import { useRef } from 'react'
import { flushSync } from 'react-dom'
import { CartSummary } from '@/features/cart/components/CartSummary'
import { ClearCartButton } from '@/features/cart/components/ClearCartButton'
import { EmptyCart } from '@/features/cart/components/EmptyCart'
import { StoreSection } from '@/features/cart/components/StoreSection'
import { useCart } from '@/features/cart/hooks/useCart'
import { useCartActions } from '@/features/cart/hooks/useCartActions'
import type { CartItem } from '@/features/cart/types/cart'
import { formatUnits } from '@/features/cart/utils/units'

// Página del carrito: los productos agrupados por tienda a la izquierda y el resumen a la derecha.
// Sin productos, muestra el estado vacío.
export function CartPage() {
  const { groups, totalUnits, updateQuantity } = useCart()
  const { removeItemWithUndo, clearCartWithUndo } = useCartActions()

  // Referencia al título principal, para llevar el foco del teclado ahí después de eliminar.
  const headingRef = useRef<HTMLHeadingElement>(null)

  // Elimina el producto y deja el foco en el título, porque el botón que lo tenía desaparece.
  // flushSync hace que React actualice la pantalla antes de mover el foco: si era el último
  // producto, el título ya es el del estado vacío. preventScroll evita que la página salte hasta
  // el título cuando el producto eliminado estaba más abajo.
  function handleRemove(item: CartItem) {
    flushSync(() => removeItemWithUndo(item))
    headingRef.current?.focus({ preventScroll: true })
  }

  // Igual que al eliminar: vacía el carrito y deja el foco en el título del estado vacío, porque
  // el botón "Vaciar carrito" desaparece junto con la lista.
  function handleClear() {
    flushSync(() => clearCartWithUndo())
    headingRef.current?.focus({ preventScroll: true })
  }

  if (groups.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-10 py-10">
        <EmptyCart headingRef={headingRef} />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-10 py-10">
      {/* tabIndex={-1} permite darle el foco al título desde el código sin meterlo en el orden
          de la tecla Tab. */}
      <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-semibold">
        Tu carrito <span className="text-base-content/70">({formatUnits(totalUnits)})</span>
      </h1>
      <p className="mt-1 text-sm text-base-content/70">
        Agregar al carrito no aparta los productos.
      </p>

      {/* Dos columnas: la lista ocupa el espacio sobrante y el resumen mide 360 px. items-start
          deja que el resumen mida solo lo que ocupa, para que sticky lo mantenga arriba al bajar. */}
      <div className="mt-8 grid grid-cols-[1fr_360px] items-start gap-12">
        <div className="space-y-10">
          {groups.map((group) => (
            <StoreSection
              key={group.storeId}
              group={group}
              onQuantityChange={(item, quantity) => updateQuantity(item.variantId, quantity)}
              onRemove={handleRemove}
            />
          ))}
          <ClearCartButton onConfirm={handleClear} />
        </div>

        <div className="sticky top-6">
          <CartSummary />
        </div>
      </div>
    </div>
  )
}
