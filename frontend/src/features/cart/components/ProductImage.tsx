import { useState } from 'react'
import { FiPackage } from 'react-icons/fi'

// Muestra la foto de un producto en un cuadro de tamaño fijo. Si no hay foto o no carga, muestra
// un ícono gris en lugar del ícono de imagen rota del navegador.
export function ProductImage({ src, className = '' }: { src: string | null; className?: string }) {
  // Recuerda si la foto falló al cargar, para cambiarla por el reemplazo.
  const [failed, setFailed] = useState(false)

  return (
    // shrink-0 evita que la fila del producto aplaste el cuadro cuando el nombre es largo.
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-box bg-base-200 ${className}`}
    >
      {src && !failed ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <FiPackage className="size-1/3 text-base-content/40" aria-hidden />
      )}
    </div>
  )
}
