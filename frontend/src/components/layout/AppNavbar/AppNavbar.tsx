import { useNavigate } from 'react-router-dom'
import { Navbar, type NavbarLink } from '@/components/layout/Navbar'
import { Button } from '@/components/ui'
import { Icon } from '@/components/ui/Icon'
import { ROLE_HOME, ROLE_LABEL, ROLE_NAV } from '@/config/roles'
import { ROUTES } from '@/config/routes'
import { useAuth } from '@/features/auth'
import { CartDrawer } from '@/features/cart/components/CartDrawer'
import { FiLogOut, FiUser } from '@/icons'

/** Navbar de la app: opciones según el rol, nombre del usuario y cerrar sesión. */
export function AppNavbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  const links: NavbarLink[] = ROLE_NAV[user.role].map((item) => ({
    label: item.label,
    href: item.href,
    icon: item.icon,
    disabled: item.soon,
  }))

  const handleLogout = () => {
    logout()
    navigate(ROUTES.home, { replace: true })
  }

  return (
    <Navbar
      brandHref={ROLE_HOME[user.role]}
      links={links}
      mobileHeader={
        <div className="flex items-center gap-3 px-4 py-3 text-neutral-content">
          <Icon icon={FiUser} size="md" />
          <div className="flex flex-col">
            <span className="text-body-sm font-bold">{user.name}</span>
            <span className="text-caption text-neutral-content/70">{ROLE_LABEL[user.role]}</span>
          </div>
        </div>
      }
      actions={
        <>
          {user.role === 'comprador' && <CartDrawer />}
          <span className="hidden items-center gap-2 text-body-sm text-neutral-content xl:flex">
            <Icon icon={FiUser} size="sm" />
            {user.name}
          </span>
          <Button variant="outlineDark" leftIcon={FiLogOut} onClick={handleLogout}>
            <span className="max-sm:sr-only">Cerrar sesión</span>
          </Button>
        </>
      }
    />
  )
}
