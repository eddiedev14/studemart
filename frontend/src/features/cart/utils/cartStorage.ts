import type { CartItem } from '@/features/cart/types/cart'

// Nombre con el que el carrito se guarda en el navegador. Se usa al leer y al guardar.
const STORAGE_KEY = 'studemart:cart:v1'

// Lee el carrito guardado en el navegador. Si no hay nada, está dañado o no tiene la forma
// esperada, empieza vacío sin mostrar errores.
export function loadCart(): CartItem[] {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY)

    if (!saved) {
      return []
    }

    const items = JSON.parse(saved)

    // Revisa que sea una lista y que cada producto tenga variante y tienda como texto,
    // y precio y cantidad como números.
    const isValid =
      Array.isArray(items) &&
      items.every(
        (item) =>
          typeof item?.variantId === 'string' &&
          typeof item?.storeId === 'string' &&
          typeof item?.price === 'number' &&
          typeof item?.quantity === 'number',
      )

    return isValid ? items : []
  } catch {
    return []
  }
}

// Guarda el carrito en el navegador para que sobreviva a recargar la página. Devuelve false si el
// navegador no deja guardar (modo privado o espacio lleno), para poder avisarle al comprador.
export function saveCart(items: CartItem[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    return true
  } catch {
    return false
  }
}
