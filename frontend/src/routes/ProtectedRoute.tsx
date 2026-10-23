import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROLE_HOME } from '@/config/roles'
import { ROUTES } from '@/config/routes'
import { useAuth, type Role } from '@/features/auth'

type ProtectedRouteProps = {
  /** Roles que pueden entrar a las rutas hijas. */
  allowedRoles: Role[]
}

/** Sin sesión → login. Con sesión pero rol equivocado → el panel de su propio rol. */
export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={ROLE_HOME[user.role]} replace />
  }

  return <Outlet />
}
