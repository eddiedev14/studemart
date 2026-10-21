export interface CartItem {
  variantId: string
  productId: string
  productName: string
  variantName: string
  storeId: string
  storeName: string
  price: number
  originalPrice?: number
  imageUrl: string | null
  quantity: number
}

export interface StoreGroup {
  storeId: string
  storeName: string
  items: CartItem[]
  subtotal: number
}
