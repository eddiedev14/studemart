import { cn } from '@/lib/cn'
import { Icon } from '@/components/ui/Icon'
import { orderStatusConfig, type OrderStatus } from './orderStatus.config'

type OrderStatusBadgeProps = {
  status: OrderStatus
  className?: string
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const { label, badgeClass, icon } = orderStatusConfig[status]

  return (
    <span
      className={cn(
        'badge h-7 gap-1.5 rounded-full px-3 text-caption font-bold',
        badgeClass,
        className,
      )}
    >
      <Icon icon={icon} size="sm" />
      {label}
    </span>
  )
}
