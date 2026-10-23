import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Heading } from '@/components/typography'
import { Alert, Button } from '@/components/ui'
import { registerService } from '@/services/auth/register.service'
import {
  EMAIL_TAKEN_MESSAGE,
  RegisterError,
  registerErrorMessages,
} from '../../register.errors'
import type {
  Registration,
  RegisterFormValues,
  RegisterResult,
  RegisterRole,
} from '../../register.types'
import { AccountFields } from './AccountFields'
import { RegisterSuccess } from './RegisterSuccess'
import { RoleSelector } from './RoleSelector'
import { StoreFields } from './StoreFields'

function toRegistration(role: RegisterRole, values: RegisterFormValues): Registration {
  const account = {
    name: values.name.trim(),
    email: values.email.trim(),
    password: values.password,
  }

  if (role === 'comprador') return { role, ...account }

  return {
    role,
    ...account,
    store: {
      name: values.storeName.trim(),
      category: values.storeCategory,
      description: values.storeDescription.trim(),
    },
  }
}

export function RegisterForm() {
  const [role, setRole] = useState<RegisterRole>('comprador')
  const [result, setResult] = useState<RegisterResult | null>(null)
  const [serverError, setServerError] = useState<'invalid_data' | 'server_error' | null>(null)

  // shouldUnregister: al cambiar a comprador, los campos de tienda dejan de validarse.
  const methods = useForm<RegisterFormValues>({
    shouldUnregister: true,
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      storeName: '',
      storeCategory: '',
      storeDescription: '',
    },
  })
  const {
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = methods

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null)
    try {
      setResult(await registerService.register(toRegistration(role, values)))
    } catch (error) {
      const code = error instanceof RegisterError ? error.code : 'server_error'
      if (code === 'email_taken') {
        setError('email', { message: EMAIL_TAKEN_MESSAGE }, { shouldFocus: true })
      } else {
        setServerError(code)
      }
    }
  }

  if (result) return <RegisterSuccess result={result} />

  const error = serverError ? registerErrorMessages[serverError] : null

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        <Heading variant="h3" as="h2">
          Crear cuenta
        </Heading>

        {error && (
          <Alert variant="error" title={error.title}>
            {error.message}
          </Alert>
        )}

        <RoleSelector value={role} onChange={setRole} disabled={isSubmitting} />
        <AccountFields />
        {role === 'emprendedor' && <StoreFields />}

        <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
          {isSubmitting
            ? 'Creando…'
            : role === 'emprendedor'
              ? 'Crear cuenta y tienda'
              : 'Crear cuenta'}
        </Button>
      </form>
    </FormProvider>
  )
}
