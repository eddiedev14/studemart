import { useFormContext } from 'react-hook-form'
import { FormField } from '@/components/ui'
import { INSTITUTIONAL_EMAIL_EXAMPLE, PASSWORD_MIN_LENGTH } from '@/config/registration'
import type { RegisterFormValues } from '../../register.types'
import { registerMessages, validateEmail, validatePassword } from '../../register.validation'

/** Datos de la cuenta: iguales para comprador y vendedor. */
export function AccountFields() {
  const {
    register,
    getValues,
    formState: { errors },
  } = useFormContext<RegisterFormValues>()

  return (
    <>
      <FormField
        id="register-name"
        label="Nombre completo"
        autoComplete="name"
        placeholder="Laura Gómez"
        error={errors.name?.message}
        {...register('name', {
          required: registerMessages.nameRequired,
          validate: (value) => value.trim().split(/\s+/).length >= 2 || registerMessages.nameShort,
        })}
      />
      <FormField
        id="register-email"
        label="Correo institucional"
        type="email"
        autoComplete="email"
        placeholder={INSTITUTIONAL_EMAIL_EXAMPLE}
        error={errors.email?.message}
        {...register('email', {
          required: registerMessages.emailRequired,
          validate: validateEmail,
        })}
      />
      <FormField
        id="register-password"
        label="Contraseña"
        type="password"
        autoComplete="new-password"
        hint={`Mínimo ${PASSWORD_MIN_LENGTH} caracteres, con letras y números`}
        error={errors.password?.message}
        {...register('password', {
          required: registerMessages.passwordRequired,
          validate: validatePassword,
        })}
      />
      <FormField
        id="register-confirm"
        label="Repite la contraseña"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword', {
          required: registerMessages.confirmRequired,
          validate: (value) => value === getValues('password') || registerMessages.confirmMismatch,
        })}
      />
    </>
  )
}
