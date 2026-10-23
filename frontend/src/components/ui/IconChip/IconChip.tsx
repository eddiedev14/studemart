import type { IconType } from 'react-icons'
import { cn } from '@/lib/cn'
import { Icon } from '@/components/ui/Icon'
import {
  iconChipSizeClasses,
  iconChipToneClasses,
  type IconChipSize,
  type IconChipTone,
} from './iconChip.styles'

type IconChipProps = {
  icon: IconType
  tone?: IconChipTone
  size?: IconChipSize
  className?: string
}

export function IconChip({ icon, tone = 'primary', size = 'md', className }: IconChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full',
        iconChipToneClasses[tone],
        iconChipSizeClasses[size],
        className,
      )}
    >
      <Icon icon={icon} size={size === 'lg' ? 'lg' : 'md'} />
    </span>
  )
}
