import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'
import { FieldShell } from '@/components/ui/FieldShell'
import { describedBy } from '@/components/ui/FieldShell/describedBy'

type FormFieldProps = Omit<ComponentProps<'input'>, 'id'> & {
  id: string
  label: string
  error?: string
  hint?: string
}

export function FormField({ id, label, error, hint, className, ...inputProps }: FormFieldProps) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={cn('input w-full', error && 'input-error', className)}
        {...inputProps}
      />
    </FieldShell>
  )
}
