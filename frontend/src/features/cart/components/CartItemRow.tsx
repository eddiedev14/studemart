import { FiTrash2 } from 'react-icons/fi'
import { ProductImage } from '@/features/cart/components/ProductImage'
import { QuantityStepper } from '@/features/cart/components/QuantityStepper'
import type { CartItem } from '@/features/cart/types/cart'
import { getItemName, hasDetail } from '@/features/cart/utils/cartItem'
import { formatPrice } from '@/features/cart/utils/money'

// Fila de un producto en el carrito. No cambia el carrito por su cuenta: avisa hacia afuera
// cuando el comprador cambia la cantidad o elimina el producto.
export function CartItemRow({
  item,
  onQuantityChange,
  onRemove,
}: {
  item: CartItem
  onQuantityChange: (quantity: number) => void
  onRemove: () => void
}) {
  return (
    // En celular, flex-wrap deja que el selector y el subtotal bajen a una segunda línea.
    // Desde md (768 px) todo va en una sola fila.
    <li className="flex flex-wrap items-start gap-x-4 gap-y-3 py-4 md:flex-nowrap md:items-center">
      <ProductImage src={item.imageUrl} className="size-20 md:size-28" />

      {/* Nombre, detalle, precios y Eliminar. min-w-0 deja que el nombre se corte en vez de
          empujar la fila más allá del borde de la pantalla. */}
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 font-semibold">{item.productName}</h3>
        {hasDetail(item) && (
          <p className="text-sm text-base-content/70">Detalle: {item.variantName}</p>
        )}

        {/* Precio de una unidad y, si está en oferta, el precio de antes tachado. "c/u" solo con
            más de una unidad; con una sería el mismo número que el subtotal. */}
        <p className="text-sm tabular-nums lining-nums">
          <span className="font-semibold">
            {formatPrice(item.price)}
            {item.quantity > 1 && ' c/u'}
          </span>
          {item.originalPrice && (
            <span className="ml-2 text-base-content/70 line-through">
              {formatPrice(item.originalPrice)}
            </span>
          )}
        </p>

        {/* -ml-2 alinea el ícono con el texto de arriba sin quitarle espacio al fondo del hover. */}
        <button
          type="button"
          className="btn btn-ghost -ml-2 mt-1 min-h-11 gap-2 px-2 text-base-content/70"
          aria-label={`Eliminar ${getItemName(item)} del carrito`}
          onClick={onRemove}
        >
          <FiTrash2 className="size-4" aria-hidden />
          Eliminar
        </button>
      </div>

      {/* Selector y subtotal de la línea. w-full los manda a su propia línea en celular; en
          escritorio min-w-24 deja los subtotales alineados entre filas. */}
      <div className="flex w-full items-center justify-between md:w-auto md:gap-8">
        <QuantityStepper
          quantity={item.quantity}
          onChange={onQuantityChange}
          itemName={getItemName(item)}
        />
        <p className="text-right font-bold tabular-nums lining-nums md:min-w-24">
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>
    </li>
  )
}
