import { useCart } from '@/features/cart/hooks/useCart'
import { formatPrice } from '@/features/cart/utils/money'

// Resumen de la compra: subtotal por tienda, productos, ahorro y total. Solo lee el carrito, no
// lo cambia.
export function CartSummary() {
  const { groups, totalUnits, total, savings } = useCart()

  return (
    <section className="rounded-box bg-base-200 p-6">
      <h2 className="text-xl font-semibold">Resumen</h2>

      {/* Subtotal de cada tienda. Con una sola tienda no se muestra, porque sería el mismo número
          que el total. */}
      {groups.length > 1 && (
        <ul className="mt-4 space-y-2">
          {groups.map((group) => (
            <li key={group.storeId} className="flex justify-between gap-4">
              <span className="text-base-content/70">{group.storeName}</span>
              <span className="tabular-nums lining-nums">{formatPrice(group.subtotal)}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Unidades y ahorro. El ahorro solo aparece si hay productos en oferta; el signo "−" y la
          palabra "Ahorro" dicen lo mismo que el color verde, para quien no distingue colores. */}
      <div className="mt-4 space-y-2 border-t border-base-300 pt-4">
        <p className="flex justify-between gap-4">
          <span>Productos</span>
          <span className="tabular-nums lining-nums">{totalUnits}</span>
        </p>
        {savings > 0 && (
          <p className="flex justify-between gap-4">
            <span>Ahorro en ofertas</span>
            <span className="text-success tabular-nums lining-nums">− {formatPrice(savings)}</span>
          </p>
        )}
      </div>

      {/* Total. aria-live hace que el lector de pantalla diga el total nuevo cuando cambia, sin
          interrumpir lo que estaba leyendo. */}
      <p
        aria-live="polite"
        className="mt-4 flex items-baseline justify-between gap-4 border-t border-base-300 pt-4"
      >
        <span className="text-lg font-semibold">Total</span>
        <span className="text-2xl font-bold tabular-nums lining-nums">{formatPrice(total)}</span>
      </p>
    </section>
  )
}
