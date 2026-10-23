import { AuthLayout } from '@/components/layout'
import { LoginForm, MockCredentialsHint } from '@/features/auth/components'

/**
 * Acceso del administrador. Solo se llega escribiendo la URL (ROUTES.adminLogin);
 * no hay ningún enlace hacia aquí en la app. Es una capa de discreción, no de seguridad:
 * la protección real es que el backend solo acepte administradores en /auth/admin/login.
 */
export function AdminLoginPage() {
  return (
    <AuthLayout
      overline="Acceso restringido"
      title="Administración"
      description="Ingresa con tu cuenta de administrador para gestionar Studemart."
    >
      <LoginForm portal="admin" title="Acceso administrador" />
      <MockCredentialsHint portal="admin" />
    </AuthLayout>
  )
}
