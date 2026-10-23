import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

type StageProps = ComponentProps<'div'> & {
  fullHeight?: boolean
}

export function Stage({ fullHeight = true, className, ...rest }: StageProps) {
  return (
    <div
      className={cn('bg-neutral text-neutral-content', fullHeight && 'min-h-dvh', className)}
      {...rest}
    />
  )
}
