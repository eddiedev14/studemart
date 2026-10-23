import type { ComponentProps } from 'react'
import type { IconType } from 'react-icons'
import { cn } from '@/lib/cn'
import { Icon } from '@/components/ui/Icon'
import {
  buttonShapeClasses,
  buttonSizeClasses,
  buttonVariantClasses,
  type ButtonShape,
  type ButtonSize,
  type ButtonVariant,
} from './button.styles'

type ButtonProps = ComponentProps<'button'> & {
  variant?: ButtonVariant
  size?: ButtonSize
  shape?: ButtonShape
  loading?: boolean
  fullWidth?: boolean
  leftIcon?: IconType
  rightIcon?: IconType
}

export function Button({
  variant = 'primary',
  size = 'md',
  shape = 'default',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  type = 'button',
  className,
  children,
  onClick,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      aria-busy={loading || undefined}
      onClick={(event) => {
        if (loading) {
          event.preventDefault()
          return
        }
        onClick?.(event)
      }}
      className={cn(
        'btn',
        buttonVariantClasses[variant],
        buttonSizeClasses[size],
        buttonShapeClasses[shape],
        fullWidth && 'w-full',
        loading && 'cursor-progress',
        className,
      )}
      {...rest}
    >
      {loading ? (
        <span className="loading loading-spinner loading-sm" aria-hidden="true" />
      ) : (
        leftIcon && <Icon icon={leftIcon} size="sm" />
      )}
      {children}
      {!loading && rightIcon && <Icon icon={rightIcon} size="sm" />}
    </button>
  )
}
