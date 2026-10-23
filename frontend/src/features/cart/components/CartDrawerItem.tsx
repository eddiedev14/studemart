import { FiTrash2 } from 'react-icons/fi'
import { ProductImage } from '@/features/cart/components/ProductImage'
import { QuantityStepper } from '@/features/cart/components/QuantityStepper'
import type { CartItem } from '@/features/cart/types/cart'
import { getItemName, hasDetail } from '@/features/cart/utils/cartItem'
import { formatPrice } from '@/features/cart/utils/money'

// Fila compacta de un producto en el panel lateral. Como la fila de la página, no cambia el
// carrito por su cuenta: avisa hacia afuera cuando cambia la cantidad o se elimina.
export function CartDrawerItem({
  item,
  onQuantityChange,
  onRemove,
}: {
  item: CartItem
  onQuantityChange: (quantity: number) => void
  onRemove: () => void
}) {
  return (
    <li className="flex gap-3 py-3">
      <ProductImage src={item.imageUrl} className="size-16" />

      {/* Nombre, detalle y selector. min-w-0 deja que el nombre se corte en vez de ensanchar la
          fila más allá del panel. */}
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-sm font-semibold">{item.productName}</p>
        {hasDetail(item) && (
          <p className="text-xs text-base-content/70">Detalle: {item.variantName}</p>
        )}
        <div className="mt-2">
          <QuantityStepper
            quantity={item.quantity}
            onChange={onQuantityChange}
            itemName={getItemName(item)}
          />
        </div>
      </div>

      {/* Subtotal de la línea, el de antes tachado si está en oferta y el botón de eliminar.
          mt-auto baja el botón hasta el final de la fila. */}
      <div className="flex flex-col items-end tabular-nums lining-nums">
        <p className="text-sm font-bold">{formatPrice(item.price * item.quantity)}</p>
        {item.originalPrice && (
          <p className="text-xs text-base-content/70 line-through">
            {formatPrice(item.originalPrice * item.quantity)}
          </p>
        )}
        <button
          type="button"
          className="btn btn-square btn-ghost btn-sm mt-auto text-base-content/70"
          aria-label={`Eliminar ${getItemName(item)} del carrito`}
          onClick={onRemove}
        >
          <FiTrash2 className="size-4" aria-hidden />
        </button>
      </div>
    </li>
  )
}
