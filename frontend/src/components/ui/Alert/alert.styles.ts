import type { IconType } from 'react-icons'
import { FiAlertCircle, FiCheckCircle } from '@/icons'

export type AlertVariant = 'error' | 'warning' | 'success'

export const alertVariantClasses: Record<AlertVariant, string> = {
  error: 'alert-error',
  warning: 'alert-warning',
  success: 'alert-success',
}

export const alertDefaultIcons: Record<AlertVariant, IconType> = {
  error: FiAlertCircle,
  warning: FiAlertCircle,
  success: FiCheckCircle,
}
