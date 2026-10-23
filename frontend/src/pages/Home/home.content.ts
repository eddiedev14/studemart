import type { NavbarLink } from '@/components/layout/Navbar'

/**
 * Textos de la pantalla de inicio. Son provisionales:
 * se cambian aquí sin tocar los componentes.
 */

export const homeNavLinks: NavbarLink[] = [
  { label: 'Compra', href: '#compra' },
  { label: 'Vende', href: '#vende' },
  { label: 'Sigue tu pedido', href: '#seguimiento' },
  { label: 'Preguntas', href: '#preguntas' },
]

export const heroContent = {
  overline: 'Marketplace UAO',
  titleStart: 'Compra y vende dentro del',
  titleHighlight: 'campus',
  description: 'El marketplace de los emprendimientos estudiantiles de la UAO.',
  primaryCta: 'Iniciar sesión',
  secondaryCta: 'Crear cuenta',
}

export const featurePanelsContent = {
  buy: {
    id: 'compra',
    overline: 'Para compradores',
    title: 'Compra',
    description:
      'Explora los productos de los emprendimientos de tu campus, agrégalos al carrito y haz tu pedido en un solo lugar.',
  },
  sell: {
    id: 'vende',
    overline: 'Para emprendedores',
    title: 'Vende',
    description:
      'Abre tu tienda, publica tus productos y recibe los pedidos de tus compañeros sin salir de la universidad.',
  },
  track: {
    id: 'seguimiento',
    overline: 'Pedidos',
    title: 'Sigue tu pedido',
    description:
      'Mira en qué paso va cada compra: el emprendedor la prepara, la deja lista y tú la recibes.',
  },
}

export const finalCtaContent = {
  titleStart: 'Tu campus ya tiene',
  titleHighlight: 'mercado',
  description: 'Inicia sesión o crea tu cuenta para empezar a comprar o vender.',
  primaryCta: 'Iniciar sesión',
  secondaryCta: 'Crear cuenta',
}
