import { Route, Routes } from 'react-router-dom'
import { ROUTES } from '@/config/routes'
import { AdminLoginPage } from '@/pages/AdminLogin'
import { HomePage } from '@/pages/Home'
import { LoginPage } from '@/pages/Login'
import { NotFoundPage } from '@/pages/NotFound'
import { RegisterPage } from '@/pages/Register'
import { AdminPanelPage, BuyerPanelPage, SellerPanelPage } from '@/pages/Panels'
import { GuestRoute } from './GuestRoute'
import { ProtectedRoute } from './ProtectedRoute'

export function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.home} element={<HomePage />} />

      <Route element={<GuestRoute />}>
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.register} element={<RegisterPage />} />
      </Route>

      {/* Ruta oculta del administrador: no está enlazada en ninguna pantalla */}
      <Route element={<GuestRoute redirectRoles={['administrador']} />}>
        <Route path={ROUTES.adminLogin} element={<AdminLoginPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['comprador']} />}>
        <Route path={ROUTES.buyerPanel} element={<BuyerPanelPage />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['emprendedor']} />}>
        <Route path={ROUTES.sellerPanel} element={<SellerPanelPage />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['administrador']} />}>
        <Route path={ROUTES.adminPanel} element={<AdminPanelPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
