export type IconChipTone = 'primary' | 'secondary' | 'accent'
export type IconChipSize = 'md' | 'lg'

export const iconChipToneClasses: Record<IconChipTone, string> = {
  primary: 'bg-primary text-primary-content',
  secondary: 'bg-secondary text-secondary-content',
  accent: 'bg-accent text-accent-content',
}

export const iconChipSizeClasses: Record<IconChipSize, string> = {
  md: 'size-12',
  lg: 'size-16',
}
