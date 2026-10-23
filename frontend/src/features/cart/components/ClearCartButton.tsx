import { useRef } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { useCart } from '@/features/cart/hooks/useCart'

// Botón "Vaciar carrito" con su ventana de confirmación. No vacía el carrito por su cuenta: avisa
// con onConfirm cuando el comprador confirma.
export function ClearCartButton({ onConfirm }: { onConfirm: () => void }) {
  const { totalUnits, groups } = useCart()

  // Una "referencia" apunta a la ventana de la página para poder abrirla con showModal().
  const dialogRef = useRef<HTMLDialogElement>(null)

  return (
    <>
      <button
        type="button"
        className="btn btn-outline border-base-300 text-base-content"
        onClick={() => dialogRef.current?.showModal()}
      >
        <FiTrash2 className="size-5" aria-hidden />
        Vaciar carrito
      </button>

      {/* Ventana de confirmación. Mientras está abierta bloquea el resto de la página, y Escape
          la cierra. */}
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          <h2 className="text-lg font-semibold">¿Vaciar tu carrito?</h2>
          <p className="mt-2 text-base-content/70">
            Vas a quitar {totalUnits} {totalUnits === 1 ? 'producto' : 'productos'} de{' '}
            {groups.length} {groups.length === 1 ? 'tienda' : 'tiendas'}. Puedes deshacerlo durante
            unos segundos.
          </p>

          {/* Un formulario con method="dialog" cierra la ventana al tocar cualquiera de sus
              botones. "Sí, vaciar" además avisa con onConfirm antes de cerrar. */}
          <form method="dialog" className="modal-action">
            <button className="btn btn-ghost">Cancelar</button>
            <button className="btn btn-error" onClick={onConfirm}>
              <FiTrash2 className="size-5" aria-hidden />
              Sí, vaciar
            </button>
          </form>
        </div>

        {/* Fondo oscuro detrás de la ventana: un clic afuera también la cierra. */}
        <form method="dialog" className="modal-backdrop">
          <button>Cerrar</button>
        </form>
      </dialog>
    </>
  )
}
