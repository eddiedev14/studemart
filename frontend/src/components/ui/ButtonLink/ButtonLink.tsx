import type { ComponentProps } from 'react'
import type { IconType } from 'react-icons'
import { cn } from '@/lib/cn'
import { AppLink } from '@/components/ui/AppLink'
import { Icon } from '@/components/ui/Icon'
import {
  buttonClasses,
  type ButtonShape,
  type ButtonSize,
  type ButtonVariant,
} from '@/components/ui/Button/button.styles'

type ButtonLinkProps = Omit<ComponentProps<'a'>, 'href'> & {
  href: string
  variant?: ButtonVariant
  size?: ButtonSize
  shape?: ButtonShape
  fullWidth?: boolean
  disabled?: boolean
  leftIcon?: IconType
  rightIcon?: IconType
}

/** Enlace con aspecto de botón. Usa AppLink, así que navega con el router. */
export function ButtonLink({
  variant = 'primary',
  size = 'md',
  shape = 'default',
  fullWidth = false,
  disabled = false,
  leftIcon,
  rightIcon,
  href,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  const classes = cn(buttonClasses({ variant, size, shape, fullWidth }), className)
  const content = (
    <>
      {leftIcon && <Icon icon={leftIcon} size="sm" />}
      {children}
      {rightIcon && <Icon icon={rightIcon} size="sm" />}
    </>
  )

  if (disabled) {
    return (
      <a
        role="link"
        aria-disabled="true"
        tabIndex={-1}
        className={cn(classes, 'btn-disabled cursor-not-allowed opacity-60')}
        {...rest}
      >
        {content}
      </a>
    )
  }

  return (
    <AppLink href={href} className={classes} {...rest}>
      {content}
    </AppLink>
  )
}
