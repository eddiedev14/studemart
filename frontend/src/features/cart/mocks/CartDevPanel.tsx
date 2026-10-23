import { ProductImage } from '@/features/cart/components/ProductImage'
import { useCartActions } from '@/features/cart/hooks/useCartActions'
import { mockItems } from '@/features/cart/mocks/mockItems'
import { hasDetail } from '@/features/cart/utils/cartItem'
import { formatPrice } from '@/features/cart/utils/money'

// Panel temporal para probar el carrito en el navegador: agrega productos de prueba, que se ven en
// la página del carrito.
export function CartDevPanel() {
  const { addItemWithNotice } = useCartActions()

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
            <button className="btn btn-sm btn-primary" onClick={() => addItemWithNotice(item)}>
              Agregar
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
