import { CartItemRow } from '@/features/cart/components/CartItemRow'
import type { CartItem, StoreGroup } from '@/features/cart/types/cart'
import { formatPrice } from '@/features/cart/utils/money'

// Bloque de una tienda en el carrito: encabezado, filas de sus productos y subtotal. No cambia el
// carrito por su cuenta: pasa hacia afuera lo que ocurre en sus filas, con el producto completo.
export function StoreSection({
  group,
  onQuantityChange,
  onRemove,
}: {
  group: StoreGroup
  onQuantityChange: (item: CartItem, quantity: number) => void
  onRemove: (item: CartItem) => void
}) {
  return (
    <section>
      {/* Encabezado: la palabra "Tienda", el nombre y una frase que explica que cada tienda hace
          su propio pedido. */}
      <p className="text-xs font-bold uppercase tracking-[0.08em] text-secondary">Tienda</p>
      <h2 className="text-xl font-semibold">{group.storeName}</h2>
      <p className="text-sm text-base-content/70">Prepara y entrega su propio pedido.</p>

      {/* Productos de la tienda, con una línea arriba y una entre cada fila. */}
      <ul className="mt-3 divide-y divide-base-300 border-t border-base-300">
        {group.items.map((item) => (
          <CartItemRow
            key={item.variantId}
            item={item}
            onQuantityChange={(quantity) => onQuantityChange(item, quantity)}
            onRemove={() => onRemove(item)}
          />
        ))}
      </ul>

      {/* Subtotal de la tienda. Ya viene calculado en group por groupByStore. */}
      <div className="flex items-center justify-between gap-4 border-t border-base-300 pt-4">
        <p className="text-base-content/70">Subtotal en {group.storeName}</p>
        <p className="font-bold tabular-nums lining-nums">{formatPrice(group.subtotal)}</p>
      </div>
    </section>
  )
}
