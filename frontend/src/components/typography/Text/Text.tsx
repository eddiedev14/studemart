import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import { textToneClasses, type TextTone } from '../tones'
import { textVariantClasses, type TextTag, type TextVariant } from './text.styles'

type TextProps = HTMLAttributes<HTMLElement> & {
  variant?: TextVariant
  as?: TextTag
  tone?: TextTone
  numeric?: boolean
}

export function Text({
  variant = 'base',
  as: Tag = 'p',
  tone = 'default',
  numeric = false,
  className,
  ...rest
}: TextProps) {
  return (
    <Tag
      className={cn(
        textVariantClasses[variant],
        textToneClasses[tone],
        numeric && 'price',
        className,
      )}
      {...rest}
    />
  )
}
