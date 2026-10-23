import type { RefObject } from 'react'
import { FiShoppingCart } from 'react-icons/fi'

// Lo que se ve cuando el carrito no tiene productos. Reemplaza todo el contenido de la página, por
// eso su título es el principal (h1). headingRef deja que la página le lleve el foco al título
// cuando se elimina el último producto.
export function EmptyCart({ headingRef }: { headingRef: RefObject<HTMLHeadingElement | null> }) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <div className="flex size-28 items-center justify-center rounded-full bg-base-200">
        <FiShoppingCart className="size-14 text-base-content/30" aria-hidden />
      </div>
      <h1 ref={headingRef} tabIndex={-1} className="mt-6 text-2xl font-semibold">
        Tu carrito está vacío
      </h1>
      <p className="mt-2 text-base-content/70">
        Explora los emprendimientos de la U y agrega lo que te guste.
      </p>
    </div>
  )
}
