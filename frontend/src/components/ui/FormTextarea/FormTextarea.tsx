import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'
import { FieldShell } from '@/components/ui/FieldShell'
import { describedBy } from '@/components/ui/FieldShell/describedBy'

type FormTextareaProps = Omit<ComponentProps<'textarea'>, 'id'> & {
  id: string
  label: string
  error?: string
  hint?: string
}

export function FormTextarea({ id, label, error, hint, className, ...props }: FormTextareaProps) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <textarea
        id={id}
        rows={4}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={cn('textarea w-full resize-none', error && 'textarea-error', className)}
        {...props}
      />
    </FieldShell>
  )
}
