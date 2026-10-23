import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'
import { textToneClasses, type TextTone } from '../tones'

type OverlineProps = ComponentProps<'p'> & {
  tone?: TextTone
}

export function Overline({ tone = 'primary', className, ...rest }: OverlineProps) {
  return <p className={cn('text-overline uppercase', textToneClasses[tone], className)} {...rest} />
}
