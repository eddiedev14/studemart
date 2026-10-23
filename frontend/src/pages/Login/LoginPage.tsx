import { AuthLayout } from '@/components/layout'
import { Text } from '@/components/typography'
import { AppLink, ButtonLink } from '@/components/ui'
import { REGISTER_AVAILABLE } from '@/config/features'
import { ROUTES } from '@/config/routes'
import { LoginForm, MockCredentialsHint } from '@/features/auth/components'
import { FiHome } from '@/icons'

export function LoginPage() {
  return (
    <AuthLayout
      title="Bienvenido de vuelta"
      description="Inicia sesión para entrar a tu panel y seguir comprando o vendiendo en el campus."
      navAction={
        <ButtonLink href={ROUTES.home} variant="outlineDark" leftIcon={FiHome}>
          Inicio
        </ButtonLink>
      }
    >
      <LoginForm />

      <Text variant="sm" tone="muted" className="mt-6 text-center">
        ¿No tienes cuenta?{' '}
        {REGISTER_AVAILABLE ? (
          <AppLink href={ROUTES.register} className="font-bold text-primary hover:underline">
            Crear cuenta
          </AppLink>
        ) : (
          <span title="Próximamente" className="font-bold opacity-60">
            Crear cuenta (próximamente)
          </span>
        )}
      </Text>

      <MockCredentialsHint />
    </AuthLayout>
  )
}
