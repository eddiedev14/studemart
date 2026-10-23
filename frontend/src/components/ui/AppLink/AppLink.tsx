import type { ComponentProps } from 'react'
import { Link } from 'react-router-dom'

type AppLinkProps = Omit<ComponentProps<'a'>, 'href'> & {
  href: string
}

const PLAIN_ANCHOR = /^(https?:|mailto:|tel:|#)/

/**
 * Enlace único de la app: rutas internas con el router (sin recargar la página)
 * y anclas (#seccion), correos o URLs externas con un <a> normal.
 */
export function AppLink({ href, ...rest }: AppLinkProps) {
  if (PLAIN_ANCHOR.test(href)) {
    return <a href={href} {...rest} />
  }
  return <Link to={href} {...rest} />
}
