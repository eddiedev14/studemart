import { AuthLayout } from '@/components/layout'
import { Text } from '@/components/typography'
import { AppLink, ButtonLink } from '@/components/ui'
import { ROUTES } from '@/config/routes'
import { RegisterForm } from '@/features/register/components'

export function RegisterPage() {
  return (
    <AuthLayout
      title="Crea tu cuenta"
      description="Únete al marketplace de los emprendimientos estudiantiles de la UAO. Compra o abre tu tienda en el campus."
      navAction={
        <ButtonLink href={ROUTES.login} variant="secondary" shape="nav">
          Iniciar sesión
        </ButtonLink>
      }
    >
      <RegisterForm />

      <Text variant="sm" tone="muted" className="mt-6 text-center">
        ¿Ya tienes cuenta?{' '}
        <AppLink href={ROUTES.login} className="font-bold text-primary hover:underline">
          Iniciar sesión
        </AppLink>
      </Text>
    </AuthLayout>
  )
}
