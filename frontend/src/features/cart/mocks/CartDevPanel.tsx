import { CartItemRow } from '@/features/cart/components/CartItemRow'
import { ProductImage } from '@/features/cart/components/ProductImage'
import { useCart } from '@/features/cart/hooks/useCart'
import { mockItems } from '@/features/cart/mocks/mockItems'
import { hasDetail } from '@/features/cart/utils/cartItem'
import { formatPrice } from '@/features/cart/utils/money'

// Panel temporal para probar el carrito en el navegador: agrega productos de prueba y muestra en
// texto cómo quedan las tiendas, los subtotales y el total.
export function CartDevPanel() {
  const { addItem, updateQuantity, removeItem, groups, totalUnits, total } = useCart()

  return (
    <section className="mx-auto max-w-2xl space-y-6 p-4">
      <h1 className="text-xl font-bold">
        Panel de prueba del carrito. Se elimina cuando exista el catálogo
      </h1>

      {/* Lista de productos de prueba. Cada clic en "Agregar" suma 1 unidad de esa variante. */}
      <ul className="space-y-2">
        {mockItems.map((item) => (
          <li
            key={item.variantId}
            className="flex items-center justify-between gap-4 rounded-box bg-base-200 p-3"
          >
            <div className="flex items-center gap-3">
              <ProductImage src={item.imageUrl} className="size-16" />
              <div>
                <p className="font-semibold">{item.productName}</p>
                {hasDetail(item) && <p className="text-sm">Detalle: {item.variantName}</p>}
                <p className="text-sm">{formatPrice(item.price)}</p>
              </div>
            </div>
            <button className="btn btn-sm btn-primary" onClick={() => addItem(item)}>
              Agregar
            </button>
          </li>
        ))}
      </ul>

      {/* Resumen del carrito por tienda, para comprobar a mano los criterios de ClickUp. */}
      <div className="space-y-4 rounded-box border border-base-300 p-3 text-sm">
        {groups.map((group) => (
          <div key={group.storeId}>
            <p className="font-semibold">{group.storeName}</p>
            {/* Filas de la tienda conectadas al carrito real, con una línea entre cada una. */}
            <ul className="divide-y divide-base-300">
              {group.items.map((item) => (
                <CartItemRow
                  key={item.variantId}
                  item={item}
                  onQuantityChange={(quantity) => updateQuantity(item.variantId, quantity)}
                  onRemove={() => removeItem(item.variantId)}
                />
              ))}
            </ul>
            <p>Subtotal: {formatPrice(group.subtotal)}</p>
          </div>
        ))}
        <p className="font-semibold">
          Unidades: {totalUnits} - Total: {formatPrice(total)}
        </p>
      </div>
    </section>
  )
}
