import { Text } from '@/components/typography'
import { USE_MOCK_AUTH } from '@/config/env'
import { MOCK_PASSWORD, MOCK_SERVER_ERROR_EMAIL } from '@/services/auth/auth.mock'

type MockCredentialsHintProps = {
  /** Muestra solo el usuario de este portal. */
  portal?: 'public' | 'admin'
}

/** Ayuda para el equipo: solo aparece con VITE_USE_MOCK_AUTH=true. */
export function MockCredentialsHint({ portal = 'public' }: MockCredentialsHintProps) {
  if (!USE_MOCK_AUTH) return null

  const emails =
    portal === 'admin'
      ? ['admin@studemart.test']
      : ['comprador@studemart.test', 'emprendedor@studemart.test']

  return (
    <div className="mt-6 rounded-xl bg-base-200 p-4">
      <Text variant="caption" className="font-bold">
        Modo de prueba (sin backend)
      </Text>
      <ul className="mt-1">
        {emails.map((email) => (
          <li key={email}>
            <Text variant="caption" tone="muted">
              {email}
            </Text>
          </li>
        ))}
      </ul>
      <Text variant="caption" tone="muted">
        Contraseña: {MOCK_PASSWORD}
      </Text>
      {portal === 'public' && (
        <Text variant="caption" tone="muted">
          Error de servidor: {MOCK_SERVER_ERROR_EMAIL}
        </Text>
      )}
    </div>
  )
}
