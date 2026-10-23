export type TextVariant = 'lg' | 'base' | 'sm' | 'caption'
export type TextTag = 'p' | 'span' | 'div' | 'label' | 'dt' | 'dd'

export const textVariantClasses: Record<TextVariant, string> = {
  lg: 'text-body-lg',
  base: 'text-body',
  sm: 'text-body-sm',
  caption: 'text-caption',
}
