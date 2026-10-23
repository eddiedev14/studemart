import type { IconType } from 'react-icons'
import { cn } from '@/lib/cn'
import { iconSizes, type IconSize } from './icon.sizes'

type IconProps = {
  icon: IconType
  size?: IconSize
  label?: string
  className?: string
}

export function Icon({ icon: IconComponent, size = 'md', label, className }: IconProps) {
  return (
    <IconComponent
      size={iconSizes[size]}
      className={cn('shrink-0', className)}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  )
}
