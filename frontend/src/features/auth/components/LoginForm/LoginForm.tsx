import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Heading } from '@/components/typography'
import { Alert, Button, FormField } from '@/components/ui'
import { ROLE_HOME } from '@/config/roles'
import { FiClock } from '@/icons'
import { AuthError, authErrorMessages } from '../../auth.errors'
import type { AuthErrorCode, LoginPortal } from '../../auth.types'
import { useAuth } from '../../useAuth'
import { EMAIL_PATTERN, loginMessages } from './loginForm.validation'

type LoginFormValues = {
  email: string
  password: string
}

type LoginFormProps = {
  title?: string
  /** 'public' para /login; 'admin' para el acceso oculto del administrador. */
  portal?: LoginPortal
}

export function LoginForm({ title = 'Iniciar sesión', portal = 'public' }: LoginFormProps) {
  const { login, sessionExpired } = useAuth()
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState<AuthErrorCode | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ defaultValues: { email: '', password: '' } })

  // handleSubmit solo llama a onSubmit si las validaciones pasan: con errores no se envía la petición.
  const onSubmit = async ({ email, password }: LoginFormValues) => {
    setSubmitError(null)
    try {
      const user = await login({ email: email.trim(), password }, portal)
      navigate(ROLE_HOME[user.role], { replace: true })
    } catch (error) {
      setSubmitError(error instanceof AuthError ? error.code : 'server_error')
    }
  }

  const error = submitError ? authErrorMessages[submitError] : null

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <Heading variant="h3" as="h2">
        {title}
      </Heading>

      {sessionExpired && !error && (
        <Alert variant="warning" icon={FiClock} title="Tu sesión venció">
          Por seguridad cerramos tu sesión. Inicia sesión de nuevo para continuar.
        </Alert>
      )}

      {error && (
        <Alert variant="error" title={error.title}>
          {error.message}
        </Alert>
      )}

      <FormField
        id="login-email"
        label="Correo"
        type="email"
        autoComplete="email"
        placeholder="nombre@uao.edu.co"
        error={errors.email?.message}
        {...register('email', {
          required: loginMessages.emailRequired,
          validate: (value) => EMAIL_PATTERN.test(value.trim()) || loginMessages.emailInvalid,
        })}
      />

      <FormField
        id="login-password"
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password', { required: loginMessages.passwordRequired })}
      />

      <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
        {isSubmitting ? 'Ingresando…' : 'Iniciar sesión'}
      </Button>
    </form>
  )
}
