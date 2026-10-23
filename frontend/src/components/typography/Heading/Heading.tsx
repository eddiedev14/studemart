import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'
import { textToneClasses, type TextTone } from '../tones'
import {
  headingDefaultTags,
  headingVariantClasses,
  type HeadingTag,
  type HeadingVariant,
} from './heading.styles'

type HeadingProps = ComponentProps<'h1'> & {
  variant?: HeadingVariant
  as?: HeadingTag
  tone?: TextTone
}

export function Heading({
  variant = 'h2',
  as,
  tone = 'default',
  className,
  ...rest
}: HeadingProps) {
  const Tag = as ?? headingDefaultTags[variant]

  return (
    <Tag
      className={cn(headingVariantClasses[variant], textToneClasses[tone], className)}
      {...rest}
    />
  )
}
