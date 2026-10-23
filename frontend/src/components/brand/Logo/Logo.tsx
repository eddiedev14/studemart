import { cn } from '@/lib/cn'
import { LogoIcon } from './LogoIcon'
import { LogoTile } from './LogoTile'

type LogoProps = {
  variant?: 'tile' | 'icon'
  showWordmark?: boolean
  onDark?: boolean
  className?: string
}

export function Logo({ variant = 'tile', showWordmark = true, onDark = false, className }: LogoProps) {
  const Mark = variant === 'tile' ? LogoTile : LogoIcon

  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <Mark />
      {showWordmark && (
        <span
          className={cn(
            'text-h4 font-extrabold tracking-tight',
            onDark ? 'text-base-100' : 'text-base-content',
          )}
        >
          Studemart
        </span>
      )}
    </span>
  )
}
