import type { IconType } from 'react-icons'
import { FiCheckCircle, FiClock, FiInfo } from '@/icons'

export type OrderStatus = 'preparing' | 'ready' | 'delivered'

type OrderStatusConfig = {
  label: string
  badgeClass: string
  icon: IconType
}

export const orderStatusConfig: Record<OrderStatus, OrderStatusConfig> = {
  preparing: { label: 'Preparando', badgeClass: 'badge-warning', icon: FiClock },
  ready: { label: 'Listo', badgeClass: 'badge-info', icon: FiInfo },
  delivered: { label: 'Entregado', badgeClass: 'badge-success', icon: FiCheckCircle },
}
