import { REGISTER_AVAILABLE } from '@/config/features'
import { ROUTES } from '@/config/routes'

export type FooterLink = {
  label: string
  href: string
}

export type FooterColumnData = {
  title: string
  links: FooterLink[]
}

export const footerColumns: FooterColumnData[] = [
  {
    title: 'Plataforma',
    links: [
      { label: 'Compra', href: '#compra' },
      { label: 'Vende', href: '#vende' },
      { label: 'Sigue tu pedido', href: '#seguimiento' },
    ],
  },
  {
    title: 'Tu cuenta',
    links: [
      { label: 'Iniciar sesión', href: ROUTES.login },
      ...(REGISTER_AVAILABLE ? [{ label: 'Crear cuenta', href: ROUTES.register }] : []),
    ],
  },
]
