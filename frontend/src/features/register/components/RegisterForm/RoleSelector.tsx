import type { IconType } from 'react-icons'
import { Icon } from '@/components/ui/Icon'
import { FiShoppingBag, FiShoppingCart } from '@/icons'
import { cn } from '@/lib/cn'
import type { RegisterRole } from '../../register.types'

type RoleOption = {
  value: RegisterRole
  label: string
  description: string
  icon: IconType
}

const options: RoleOption[] = [
  { value: 'comprador', label: 'Quiero comprar', description: 'Comprador', icon: FiShoppingCart },
  { value: 'emprendedor', label: 'Quiero vender', description: 'Emprendedor', icon: FiShoppingBag },
]

type RoleSelectorProps = {
  value: RegisterRole
  onChange: (role: RegisterRole) => void
  disabled?: boolean
}

/** Dos tarjetas tipo radio: sirve con teclado (flechas) y lector de pantalla. */
export function RoleSelector({ value, onChange, disabled }: RoleSelectorProps) {
  return (
    <fieldset className="flex flex-col gap-1.5" disabled={disabled}>
      <legend className="mb-1.5 text-body-sm text-base-content">¿Cómo quieres usar Studemart?</legend>
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => {
          const selected = option.value === value
          return (
            <label
              key={option.value}
              className={cn(
                'flex cursor-pointer flex-col gap-2 rounded-xl border-2 p-4 transition-colors',
                'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary',
                selected
                  ? 'border-primary bg-primary/5'
                  : 'border-base-300 hover:border-base-content/40',
              )}
            >
              <input
                type="radio"
                name="register-role"
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <span
                className={cn(
                  'inline-flex size-9 items-center justify-center rounded-full',
                  selected ? 'bg-primary text-primary-content' : 'bg-base-200 text-base-content',
                )}
              >
                <Icon icon={option.icon} size="md" />
              </span>
              <span className="flex flex-col">
                <span className="text-body-sm font-bold">{option.label}</span>
                <span className="text-caption text-base-content/70">{option.description}</span>
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
