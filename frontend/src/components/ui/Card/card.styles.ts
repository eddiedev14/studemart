export type CardTone = 'surface' | 'primary' | 'secondary' | 'accent'
export type CardSize = 'md' | 'lg'

export const cardToneClasses: Record<CardTone, string> = {
  surface: 'bg-base-100 text-base-content',
  primary: 'bg-primary text-primary-content',
  secondary: 'bg-secondary text-secondary-content',
  accent: 'bg-accent text-accent-content',
}

export const cardSizeClasses: Record<CardSize, string> = {
  md: 'rounded-2xl p-6',
  lg: 'rounded-3xl p-8 md:p-12',
}
