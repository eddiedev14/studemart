import type { CartItem, StoreGroup } from '@/features/cart/types/cart'

export function groupByStore(items: CartItem[]) {
  const groups: StoreGroup[] = []

  for (const item of items) {
    let group = groups.find((g) => g.storeId === item.storeId)

    if (!group) {
      group = { storeId: item.storeId, storeName: item.storeName, items: [], subtotal: 0 }
      groups.push(group)
    }

    group.items.push(item)
    group.subtotal += item.price * item.quantity
  }

  return groups
}
