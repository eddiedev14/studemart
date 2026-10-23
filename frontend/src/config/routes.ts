/**
 * Rutas de la aplicación en un solo lugar.
 * Los componentes importan de aquí en vez de escribir las rutas a mano.
 */
export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/registro',

  // Acceso de administrador: ruta oculta, no aparece enlazada en ninguna pantalla.
  adminLogin: '/administradorStudemart',

  // Paneles por rol
  buyerPanel: '/comprador',
  sellerPanel: '/emprendedor',
  adminPanel: '/administradorStudemart/panel',
  cart: '/carrito',

  // Pantallas de otras tareas (todavía no existen)
  catalog: '/catalogo',
  myOrders: '/mis-pedidos',
  myStore: '/mi-tienda',
  products: '/productos',
  sellerOrders: '/pedidos',
  sellerDashboard: '/dashboard',
  adminStores: '/administradorStudemart/tiendas',
  adminMetrics: '/administradorStudemart/metricas',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
