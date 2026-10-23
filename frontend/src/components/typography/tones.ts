export type TextTone =
  | 'default'
  | 'muted'
  | 'primary'
  | 'onDark'
  | 'onDarkMuted'
  | 'accent'
  | 'inherit'

export const textToneClasses: Record<TextTone, string> = {
  default: 'text-base-content',
  muted: 'text-base-content/70',
  primary: 'text-primary',
  onDark: 'text-base-100',
  onDarkMuted: 'text-neutral-content/70',
  accent: 'text-accent',
  inherit: '',
}
