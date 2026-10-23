import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi'
import { ToastContainer, type CloseButtonProps, type IconProps } from 'react-toastify'
import '@/shared/components/Toaster.css'

// Ícono de Feather según el tipo de aviso. Los tipos que la app no usa se quedan sin ícono.
function TypeIcon({ type }: IconProps) {
  if (type === 'success') {
    return <FiCheckCircle className="size-5 text-success" aria-hidden />
  }
  if (type === 'info') {
    return <FiInfo className="size-5 text-info" aria-hidden />
  }
  if (type === 'error') {
    return <FiAlertCircle className="size-5 text-error" aria-hidden />
  }
  return null
}

// Botón para cerrar un aviso, con ícono de Feather y etiqueta en español. El de la librería dice
// "close" al lector de pantalla y no se puede importar para cambiarle el texto. ml-auto lo
// empuja al borde derecho del aviso.
function CloseToastButton({ closeToast }: CloseButtonProps) {
  return (
    <button
      type="button"
      className="btn btn-square btn-ghost btn-sm ml-auto text-base-content/70"
      aria-label="Cerrar aviso"
      onClick={() => closeToast()}
    >
      <FiX className="size-4" aria-hidden />
    </button>
  )
}

// Contenedor de avisos. El principal, sin containerId, se monta una sola vez en la raíz. Una
// ventana modal (como el panel del carrito) tapa todo lo de afuera, así que pone el suyo adentro
// con un containerId, y solo muestra los avisos que se envían con ese mismo containerId.
// Van abajo a la derecha para no tapar el ícono del carrito. La pausa con el mouse o al cambiar
// de ventana, el botón de cerrar y no cerrar al hacer clic en el aviso ya vienen así por defecto
// en la librería.
// role="status" anuncia los avisos sin interrumpir; los de error deben pasar role: 'alert' para
// que el lector de pantalla interrumpa.
export function Toaster({ containerId }: { containerId?: string }) {
  return (
    <ToastContainer
      containerId={containerId}
      position="bottom-right"
      autoClose={3500}
      limit={3}
      hideProgressBar
      icon={TypeIcon}
      role="status"
      aria-label="Avisos (Alt+T)"
      closeButton={CloseToastButton}
      toastClassName="border border-base-300"
    />
  )
}
