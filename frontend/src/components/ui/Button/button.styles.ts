export type ButtonVariant = 'primary' | 'secondary' | 'outlineDark' | 'ghost' | 'danger'
export type ButtonSize = 'md' | 'lg'
export type ButtonShape = 'default' | 'nav'

export const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'bg-base-100 text-base-content border-base-content hover:bg-base-200',
  outlineDark:
    'btn-outline border-neutral-content text-neutral-content hover:border-neutral-content hover:bg-neutral-content hover:text-neutral',
  ghost: 'btn-ghost',
  danger: 'btn-error',
}

export const buttonSizeClasses: Record<ButtonSize, string> = {
  md: 'text-button',
  lg: 'btn-lg text-button-lg',
}

export const buttonShapeClasses: Record<ButtonShape, string> = {
  default: '',
  nav: 'rounded-2xl',
}

type ButtonClassOptions = {
  variant?: ButtonVariant
  size?: ButtonSize
  shape?: ButtonShape
  fullWidth?: boolean
}

/** Clases de un botón. Lo usan Button (<button>) y ButtonLink (<a>) para verse igual. */
export function buttonClasses({
  variant = 'primary',
  size = 'md',
  shape = 'default',
  fullWidth = false,
}: ButtonClassOptions = {}): string {
  return [
    'btn',
    buttonVariantClasses[variant],
    buttonSizeClasses[size],
    buttonShapeClasses[shape],
    fullWidth && 'w-full',
  ]
    .filter(Boolean)
    .join(' ')
}
