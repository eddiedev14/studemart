import { cn } from '@/lib/cn'
import { LogoMark } from './LogoMark'

type LogoTileProps = {
  className?: string
}

export function LogoTile({ className }: LogoTileProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      role="img"
      aria-label="Studemart"
      className={cn('size-10 shrink-0', className)}
    >
      <rect width="120" height="120" rx="26" className="fill-primary" />
      <g transform="translate(18 20) scale(0.7)">
        <LogoMark bag="light" letter="primary" />
      </g>
    </svg>
  )
}
