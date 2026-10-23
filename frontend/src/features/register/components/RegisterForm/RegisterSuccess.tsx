import { Heading, Text } from '@/components/typography'
import { ButtonLink, IconChip } from '@/components/ui'
import { Icon } from '@/components/ui/Icon'
import { ROUTES } from '@/config/routes'
import { FiCheckCircle, FiClock } from '@/icons'
import type { RegisterResult } from '../../register.types'

/** Pantalla que reemplaza al formulario cuando el registro salió bien. */
export function RegisterSuccess({ result }: { result: RegisterResult }) {
  const isSeller = result.role === 'emprendedor'

  return (
    <div className="flex flex-col items-start gap-4" role="status">
      <IconChip icon={FiCheckCircle} tone="secondary" size="lg" />
      <Heading variant="h3" as="h2">
        {isSeller ? 'Tu tienda quedó en revisión' : '¡Tu cuenta está lista!'}
      </Heading>

      {isSeller ? (
        <>
          <span className="badge h-7 gap-1.5 rounded-full badge-warning px-3 text-caption font-bold">
            <Icon icon={FiClock} size="sm" />
            Pendiente de aprobación
          </span>
          <Text tone="muted">
            Un administrador revisará{result.storeName ? ` «${result.storeName}»` : ' tu tienda'}.
            Cuando la apruebe podrás entrar a tu panel con tu correo y contraseña.
          </Text>
        </>
      ) : (
        <Text tone="muted">
          Ya puedes iniciar sesión con tu correo y contraseña para explorar los productos del
          campus.
        </Text>
      )}

      <ButtonLink href={ROUTES.login} size="lg" fullWidth className="mt-2">
        Ir a iniciar sesión
      </ButtonLink>
    </div>
  )
}
