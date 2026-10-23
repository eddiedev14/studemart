import { useState, type ReactNode } from 'react'
import type { IconType } from 'react-icons'
import { useLocation } from 'react-router-dom'
import { Logo } from '@/components/brand'
import { Container } from '@/components/layout/Container'
import { AppLink } from '@/components/ui/AppLink'
import { Icon } from '@/components/ui/Icon'
import { FiMenu, FiX } from '@/icons'
import { cn } from '@/lib/cn'
import { navbarClasses } from './navbar.styles'
import { NavbarItem } from './NavbarItem'

export type NavbarLink = {
  label: string
  href: string
  icon?: IconType
  /** Se muestra apagado y sin enlace (pantalla que aún no existe). */
  disabled?: boolean
}

type NavbarProps = {
  /** Enlaces del centro. En pantallas pequeñas pasan a un menú desplegable. */
  links?: NavbarLink[]
  /** Zona derecha: botones, cerrar sesión. Siempre visible. */
  actions?: ReactNode
  /** Contenido extra al inicio del menú desplegable (por ejemplo, el nombre del usuario). */
  mobileHeader?: ReactNode
  /** A dónde lleva el logo. */
  brandHref?: string
  className?: string
}

export function Navbar({
  links = [],
  actions,
  mobileHeader,
  brandHref = '/',
  className,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const closeMenu = () => setMenuOpen(false)

  return (
    <header className={cn(navbarClasses, className)}>
      <Container className="flex h-16 items-center justify-between gap-3">
        <AppLink href={brandHref} aria-label="Studemart, ir al inicio" className="shrink-0">
          <Logo onDark />
        </AppLink>

        {links.length > 0 && (
          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {links.map((link) => (
                <li key={link.label}>
                  <NavbarItem link={link} active={pathname === link.href} />
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="flex items-center gap-3">
          {actions}
          {links.length > 0 && (
            <button
              type="button"
              className="btn btn-ghost btn-square rounded-xl border-transparent text-neutral-content hover:bg-neutral-content/10 focus-visible:bg-neutral-content/10 active:bg-neutral-content/20 lg:hidden"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
              aria-controls="menu-movil"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <Icon icon={menuOpen ? FiX : FiMenu} size="md" />
            </button>
          )}
        </div>
      </Container>

      {links.length > 0 && menuOpen && (
        <nav id="menu-movil" aria-label="Menú" className="pb-4 lg:hidden">
          <Container className="flex flex-col gap-1">
            {mobileHeader}
            <ul className="flex flex-col gap-1">
              {links.map((link) => (
                <li key={link.label}>
                  <NavbarItem
                    mobile
                    link={link}
                    active={pathname === link.href}
                    onNavigate={closeMenu}
                  />
                </li>
              ))}
            </ul>
          </Container>
        </nav>
      )}
    </header>
  )
}
