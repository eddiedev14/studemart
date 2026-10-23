export type ColorToken = {
  name: string
  token: string
  bgClass: string
  contentClass: string
  ratio: string
  passesAA: boolean
}

export type ColorGroup = {
  title: string
  colors: ColorToken[]
}

export const colorGroups: ColorGroup[] = [
  {
    title: 'Marca',
    colors: [
      { name: 'primary', token: '--color-primary', bgClass: 'bg-primary', contentClass: 'text-primary-content', ratio: '5.40:1', passesAA: true },
      { name: 'secondary', token: '--color-secondary', bgClass: 'bg-secondary', contentClass: 'text-secondary-content', ratio: '6.26:1', passesAA: true },
      { name: 'accent', token: '--color-accent', bgClass: 'bg-accent', contentClass: 'text-accent-content', ratio: '10.56:1', passesAA: true },
    ],
  },
  {
    title: 'Neutros y fondos',
    colors: [
      { name: 'neutral', token: '--color-neutral', bgClass: 'bg-neutral', contentClass: 'text-neutral-content', ratio: '15.57:1', passesAA: true },
      { name: 'base-100', token: '--color-base-100', bgClass: 'bg-base-100', contentClass: 'text-base-content', ratio: '18.17:1', passesAA: true },
      { name: 'base-200', token: '--color-base-200', bgClass: 'bg-base-200', contentClass: 'text-base-content', ratio: '16.93:1', passesAA: true },
      { name: 'base-300', token: '--color-base-300', bgClass: 'bg-base-300', contentClass: 'text-base-content', ratio: '14.37:1', passesAA: true },
    ],
  },
  {
    title: 'Semánticos',
    colors: [
      { name: 'info', token: '--color-info', bgClass: 'bg-info', contentClass: 'text-info-content', ratio: '4.10:1', passesAA: false },
      { name: 'success', token: '--color-success', bgClass: 'bg-success', contentClass: 'text-success-content', ratio: '5.02:1', passesAA: true },
      { name: 'warning', token: '--color-warning', bgClass: 'bg-warning', contentClass: 'text-warning-content', ratio: '8.46:1', passesAA: true },
      { name: 'error', token: '--color-error', bgClass: 'bg-error', contentClass: 'text-error-content', ratio: '7.75:1', passesAA: true },
    ],
  },
]
