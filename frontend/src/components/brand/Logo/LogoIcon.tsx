import { cn } from '@/lib/cn'
import { LogoMark } from './LogoMark'

type LogoIconProps = {
  className?: string
}

export function LogoIcon({ className }: LogoIconProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      role="img"
      aria-label="Studemart"
      className={cn('size-10 shrink-0', className)}
    >
      <LogoMark bag="primary" letter="light" />
    </svg>
  )
}
