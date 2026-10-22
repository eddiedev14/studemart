import { FiMinus, FiPlus } from 'react-icons/fi'
import '@/features/cart/cart.css'

// Clases de los dos botones: cuadrados de 44 px (el mínimo cómodo para un dedo) y un contorno
// visible cuando se llega a ellos con el teclado.
const buttonClass =
  'btn btn-ghost btn-square size-11 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary'

// Selector de cantidad con botones de menos y más. No guarda la cantidad: la recibe del carrito y
// con onChange avisa cuál es la nueva.
export function QuantityStepper({
  quantity,
  onChange,
  itemName,
}: {
  quantity: number
  onChange: (quantity: number) => void
  itemName: string
}) {
  // En 1 el botón de menos se apaga, porque el carrito no acepta menos de 1 unidad.
  const isMin = quantity === 1

  return (
    <div
      role="group"
      aria-label={`Cantidad de ${itemName}`}
      className="inline-flex items-center rounded-field border border-base-300"
    >
      <button
        type="button"
        className={buttonClass}
        disabled={isMin}
        aria-label={
          isMin
            ? `Disminuir cantidad de ${itemName}. Ya está en el mínimo de 1 unidad`
            : `Disminuir cantidad de ${itemName}`
        }
        onClick={() => onChange(quantity - 1)}
      >
        <FiMinus className="size-5" aria-hidden />
      </button>

      {/* El lector de pantalla anuncia lo que cambie aquí adentro. key={quantity} crea el número
          de nuevo en cada cambio, para que la animación de entrada se repita. */}
      <span
        aria-live="polite"
        className="min-w-8 text-center font-semibold tabular-nums lining-nums"
      >
        <span key={quantity} className="cart-quantity-in inline-block">
          {quantity}
        </span>
      </span>

      <button
        type="button"
        className={buttonClass}
        aria-label={`Aumentar cantidad de ${itemName}`}
        onClick={() => onChange(quantity + 1)}
      >
        <FiPlus className="size-5" aria-hidden />
      </button>
    </div>
  )
}
