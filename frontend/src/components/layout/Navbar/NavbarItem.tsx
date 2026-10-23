import { AppLink } from '@/components/ui/AppLink'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import type { NavbarLink } from './Navbar'
import {
  mobileLinkActiveClasses,
  mobileLinkClasses,
  navLinkActiveClasses,
  navLinkClasses,
  navLinkDisabledClasses,
} from './navbar.styles'

type NavbarItemProps = {
  link: NavbarLink
  active: boolean
  mobile?: boolean
  onNavigate?: () => void
}

export function NavbarItem({ link, active, mobile = false, onNavigate }: NavbarItemProps) {
  const base = mobile ? mobileLinkClasses : navLinkClasses
  const content = (
    <>
      {link.icon && <Icon icon={link.icon} size="sm" />}
      {link.label}
    </>
  )

  if (link.disabled) {
    return (
      <span aria-disabled="true" title="Próximamente" className={cn(base, navLinkDisabledClasses)}>
        {content}
      </span>
    )
  }

  return (
    <AppLink
      href={link.href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={cn(base, active && (mobile ? mobileLinkActiveClasses : navLinkActiveClasses))}
    >
      {content}
    </AppLink>
  )
}
