import { Navigate, Outlet } from 'react-router-dom'
import { ROLE_HOME } from '@/config/roles'
import { useAuth, type Role } from '@/features/auth'

type GuestRouteProps = {
  /** Roles que, si ya tienen sesión, se redirigen a su panel. Por defecto, todos. */
  redirectRoles?: Role[]
}

/** Rutas para quien aún no inició sesión (login). Con sesión, lleva al panel. */
export function GuestRoute({ redirectRoles }: GuestRouteProps) {
  const { user } = useAuth()

  if (user && (!redirectRoles || redirectRoles.includes(user.role))) {
    return <Navigate to={ROLE_HOME[user.role]} replace />
  }

  return <Outlet />
}
