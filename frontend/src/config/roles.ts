import type { IconType } from 'react-icons'
import {
  FiBarChart2,
  FiHome,
  FiPackage,
  FiSearch,
  FiShoppingBag,
  FiShoppingCart,
  FiTruck,
} from '@/icons'
import type { Role } from '@/features/auth/auth.types'
import { ROUTES } from './routes'

export const ROLE_LABEL: Record<Role, string> = {
  comprador: 'Comprador',
  emprendedor: 'Emprendedor',
  administrador: 'Administrador',
}

/** Panel al que llega cada rol después de iniciar sesión. */
export const ROLE_HOME: Record<Role, string> = {
  comprador: ROUTES.buyerPanel,
  emprendedor: ROUTES.sellerPanel,
  administrador: ROUTES.adminPanel,
}

export type RoleNavItem = {
  label: string
  href: string
  icon: IconType
  /** true mientras la pantalla no exista: se muestra deshabilitada. */
  soon?: boolean
}

/** Opciones del Navbar por rol. Al construir una pantalla, quita su `soon`. */
export const ROLE_NAV: Record<Role, RoleNavItem[]> = {
  comprador: [
    { label: 'Inicio', href: ROUTES.buyerPanel, icon: FiHome },
    { label: 'Catálogo', href: ROUTES.catalog, icon: FiSearch, soon: true },
    { label: 'Carrito', href: ROUTES.cart, icon: FiShoppingCart, soon: true },
    { label: 'Mis pedidos', href: ROUTES.myOrders, icon: FiPackage, soon: true },
  ],
  emprendedor: [
    { label: 'Inicio', href: ROUTES.sellerPanel, icon: FiHome },
    { label: 'Mi tienda', href: ROUTES.myStore, icon: FiShoppingBag, soon: true },
    { label: 'Productos', href: ROUTES.products, icon: FiPackage, soon: true },
    { label: 'Pedidos', href: ROUTES.sellerOrders, icon: FiTruck, soon: true },
    { label: 'Dashboard', href: ROUTES.sellerDashboard, icon: FiBarChart2, soon: true },
  ],
  administrador: [
    { label: 'Inicio', href: ROUTES.adminPanel, icon: FiHome },
    { label: 'Tiendas', href: ROUTES.adminStores, icon: FiShoppingBag, soon: true },
    { label: 'Métricas', href: ROUTES.adminMetrics, icon: FiBarChart2, soon: true },
  ],
}
