import type { ReactNode } from 'react'
import type { IconType } from 'react-icons'
import { cn } from '@/lib/cn'
import { Icon } from '@/components/ui/Icon'
import { alertDefaultIcons, alertVariantClasses, type AlertVariant } from './alert.styles'

type AlertProps = {
  variant?: AlertVariant
  icon?: IconType
  title?: string
  children: ReactNode
  className?: string
}

export function Alert({ variant = 'error', icon, title, children, className }: AlertProps) {
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={cn('alert', alertVariantClasses[variant], className)}
    >
      <Icon icon={icon ?? alertDefaultIcons[variant]} size="md" />
      <div className="flex flex-col">
        {title && <p className="text-body-sm font-bold">{title}</p>}
        <p className="text-body-sm">{children}</p>
      </div>
    </div>
  )
}
