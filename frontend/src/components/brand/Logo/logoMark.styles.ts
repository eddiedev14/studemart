export type LogoMarkTone = 'primary' | 'light'

export const logoMarkFillClasses: Record<LogoMarkTone, string> = {
  primary: 'fill-primary stroke-primary',
  light: 'fill-base-100 stroke-base-100',
}

export const logoMarkStrokeClasses: Record<LogoMarkTone, string> = {
  primary: 'fill-none stroke-primary',
  light: 'fill-none stroke-base-100',
}
