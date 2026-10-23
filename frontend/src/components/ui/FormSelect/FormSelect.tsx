import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'
import { FieldShell } from '@/components/ui/FieldShell'
import { describedBy } from '@/components/ui/FieldShell/describedBy'

type FormSelectProps = Omit<ComponentProps<'select'>, 'id'> & {
  id: string
  label: string
  error?: string
  hint?: string
  /** Texto de la primera opción, sin valor. */
  placeholder?: string
  options: readonly string[]
}

export function FormSelect({
  id,
  label,
  error,
  hint,
  placeholder = 'Selecciona una opción',
  options,
  className,
  ...props
}: FormSelectProps) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={cn('select w-full', error && 'select-error', className)}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}
