import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type HighlightProps = {
  children: ReactNode
  tone?: 'primary' | 'accent'
  className?: string
}

/** Palabra con fondo de color dentro de un titular. */
export function Highlight({ children, tone = 'primary', className }: HighlightProps) {
  return (
    <span
      className={cn(
        'inline-block -rotate-1 rounded-xl px-3 py-0.5',
        tone === 'primary' ? 'bg-primary text-primary-content' : 'bg-accent text-accent-content',
        className,
      )}
    >
      {children}
    </span>
  )
}
