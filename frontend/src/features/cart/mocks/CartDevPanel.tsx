import { CartSummary } from '@/features/cart/components/CartSummary'
import { EmptyCart } from '@/features/cart/components/EmptyCart'
import { ProductImage } from '@/features/cart/components/ProductImage'
import { StoreSection } from '@/features/cart/components/StoreSection'
import { useCart } from '@/features/cart/hooks/useCart'
import { mockItems } from '@/features/cart/mocks/mockItems'
import { hasDetail } from '@/features/cart/utils/cartItem'
import { formatPrice } from '@/features/cart/utils/money'

// Panel temporal para probar el carrito en el navegador: agrega productos de prueba y muestra en
// texto cómo quedan las tiendas, los subtotales y el total.
export function CartDevPanel() {
  const { addItem, updateQuantity, removeItem, groups } = useCart()

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
      <div className="space-y-8 rounded-box border border-base-300 p-3 text-sm">
        {/* Sin productos se ve el estado vacío; con productos, las tiendas y el resumen. */}
        {groups.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            {groups.map((group) => (
              <StoreSection
                key={group.storeId}
                group={group}
                onQuantityChange={(item, quantity) => updateQuantity(item.variantId, quantity)}
                onRemove={(item) => removeItem(item.variantId)}
              />
            ))}
            <CartSummary />
          </>
        )}
      </div>
    </section>
  )
}
