import type { CartItem } from '@/features/cart/types/cart'

// Dice si hay que mostrar "Detalle: ..." (talla, presentación). La variante "Única" no se muestra
// porque no le dice nada al comprador.
export function hasDetail(item: CartItem) {
  return item.variantName !== 'Única'
}

// Nombre completo para lectores de pantalla y avisos, por ejemplo "Camiseta UAO, M".
export function getItemName(item: CartItem) {
  return hasDetail(item) ? `${item.productName}, ${item.variantName}` : item.productName
}
