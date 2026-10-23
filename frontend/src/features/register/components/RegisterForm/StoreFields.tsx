import { useFormContext, useWatch } from 'react-hook-form'
import { Heading } from '@/components/typography'
import { FormField, FormSelect, FormTextarea } from '@/components/ui'
import {
  STORE_CATEGORIES,
  STORE_DESCRIPTION_LIMITS,
  STORE_NAME_LIMITS,
} from '@/config/registration'
import type { RegisterFormValues } from '../../register.types'
import { registerMessages } from '../../register.validation'

/** Datos de la tienda: solo aparecen para el vendedor. */
export function StoreFields() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<RegisterFormValues>()
  const description = useWatch({ control, name: 'storeDescription' }) ?? ''

  return (
    <>
      <Heading variant="h4" as="h3" className="mt-2">
        Tu tienda
      </Heading>
      <FormField
        id="register-store-name"
        label="Nombre de la tienda"
        placeholder="Hilos UAO"
        maxLength={STORE_NAME_LIMITS.max}
        error={errors.storeName?.message}
        {...register('storeName', {
          required: registerMessages.storeNameRequired,
          validate: (value) => {
            const length = value.trim().length
            return (
              (length >= STORE_NAME_LIMITS.min && length <= STORE_NAME_LIMITS.max) ||
              registerMessages.storeNameLength
            )
          },
        })}
      />
      <FormSelect
        id="register-store-category"
        label="Categoría"
        placeholder="Selecciona una categoría"
        options={STORE_CATEGORIES}
        error={errors.storeCategory?.message}
        {...register('storeCategory', { required: registerMessages.storeCategoryRequired })}
      />
      <FormTextarea
        id="register-store-description"
        label="¿Qué vendes?"
        placeholder="Pulseras tejidas a mano, hechas por estudiantes de diseño."
        maxLength={STORE_DESCRIPTION_LIMITS.max}
        hint={`${description.length}/${STORE_DESCRIPTION_LIMITS.max}`}
        error={errors.storeDescription?.message}
        {...register('storeDescription', {
          required: registerMessages.storeDescriptionRequired,
          validate: (value) =>
            value.trim().length >= STORE_DESCRIPTION_LIMITS.min ||
            registerMessages.storeDescriptionShort,
        })}
      />
    </>
  )
}
