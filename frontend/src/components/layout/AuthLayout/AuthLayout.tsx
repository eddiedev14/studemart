import type { ReactNode } from 'react'
import { Container } from '@/components/layout/Container'
import { Navbar } from '@/components/layout/Navbar'
import { Stage } from '@/components/layout/Stage'
import { Heading, Overline, Text } from '@/components/typography'
import { Card } from '@/components/ui'
import { ROUTES } from '@/config/routes'

type AuthLayoutProps = {
  overline?: string
  title: string
  description: string
  /** Botón o enlace a la derecha del Navbar. */
  navAction?: ReactNode
  /** Contenido de la tarjeta blanca (el formulario). */
  children: ReactNode
}

/** Escenario oscuro de dos columnas para login y registro: texto a la izquierda, tarjeta a la derecha. */
export function AuthLayout({ overline, title, description, navAction, children }: AuthLayoutProps) {
  return (
    <Stage className="flex flex-col">
      <Navbar brandHref={ROUTES.home} actions={navAction} />
      <main className="flex flex-1 items-center py-12 md:py-16">
        <Container className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <div className="flex flex-col items-start gap-4">
            {overline && <Overline tone="accent">{overline}</Overline>}
            <Heading variant="h1Caps" tone="onDark">
              {title}
            </Heading>
            <Text tone="onDarkMuted" className="max-w-[380px]">
              {description}
            </Text>
          </div>
          <Card size="lg" className="mx-auto w-full max-w-md md:mx-0 md:ml-auto">
            {children}
          </Card>
        </Container>
      </main>
    </Stage>
  )
}
