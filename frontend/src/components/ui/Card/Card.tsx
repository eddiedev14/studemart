import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'
import { cardSizeClasses, cardToneClasses, type CardSize, type CardTone } from './card.styles'

type CardProps = ComponentProps<'div'> & {
  tone?: CardTone
  size?: CardSize
}

export function Card({ tone = 'surface', size = 'md', className, ...rest }: CardProps) {
  return <div className={cn(cardToneClasses[tone], cardSizeClasses[size], className)} {...rest} />
}
