import { Container, Stage } from '@/components/layout'
import { Heading, Overline, Text } from '@/components/typography'
import { ButtonLink } from '@/components/ui'
import { ROUTES } from '@/config/routes'

export function NotFoundPage() {
  return (
    <Stage className="flex items-center">
      <Container className="flex flex-col items-start gap-5 py-16">
        <Overline tone="accent">Error 404</Overline>
        <Heading variant="h1Caps" tone="onDark">
          Página no encontrada
        </Heading>
        <Text tone="onDarkMuted" className="max-w-[380px]">
          La dirección que escribiste no existe o ya no está disponible.
        </Text>
        <ButtonLink href={ROUTES.home} size="lg">
          Volver al inicio
        </ButtonLink>
      </Container>
    </Stage>
  )
}
