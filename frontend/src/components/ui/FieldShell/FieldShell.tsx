import type { ReactNode } from 'react'
import { Icon } from '@/components/ui/Icon'
import { FiAlertCircle } from '@/icons'

type FieldShellProps = {
  id: string
  label: string
  error?: string
  hint?: string
  children: ReactNode
}

/** Etiqueta + control + mensaje (error o ayuda). Lo comparten todos los campos de formulario. */
export function FieldShell({ id, label, error, hint, children }: FieldShellProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-body-sm text-base-content">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="flex items-center gap-1.5 text-caption text-error">
          <Icon icon={FiAlertCircle} size="sm" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-caption text-base-content/70">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
