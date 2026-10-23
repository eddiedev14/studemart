import { Container, Section, Stage } from '@/components/layout'
import { Heading, Overline, Text } from '@/components/typography'
import { Button, Card, IconChip } from '@/components/ui'
import { FiPackage, FiShoppingBag, FiTruck } from '@/icons'
import { SectionBlock } from '../components/SectionBlock'

export function StageSection() {
  return (
    <SectionBlock id="escenario" title="Escenario oscuro" description="Composición de la pantalla de inicio con los tokens del tema.">
      <Stage fullHeight={false} className="overflow-hidden rounded-3xl">
        <Section className="py-16 md:py-20">
          <Container className="grid items-center gap-12 md:grid-cols-2">
            <div className="flex flex-col items-start gap-6">
              <Overline tone="accent">Marketplace UAO</Overline>
              <Heading variant="displayCaps" tone="onDark">
                Compra y vende dentro del campus
              </Heading>
              <Text tone="onDarkMuted" className="max-w-[380px]">
                El marketplace de los emprendimientos estudiantiles de la UAO.
              </Text>
              <div className="flex flex-wrap gap-4">
                <Button size="lg">Iniciar sesión</Button>
                <Button variant="secondary">Crear cuenta</Button>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-sm">
              <Card size="md" className="flex flex-col gap-3">
                <Overline>Accesorios</Overline>
                <Heading variant="h4" as="p">Pulsera artesanal</Heading>
                <Text variant="sm" tone="muted">
                  Pulsera tejida a mano por estudiantes de diseño. Disponible en tres colores.
                </Text>
                <Text numeric className="text-h4 font-bold">$ 18.000</Text>
                <Button size="md">Agregar al carrito</Button>
              </Card>
              <IconChip icon={FiShoppingBag} tone="primary" size="lg" className="absolute -right-3 -top-6 md:-right-6" />
              <IconChip icon={FiTruck} tone="secondary" size="lg" className="absolute -right-3 top-1/2 md:-right-6" />
              <IconChip icon={FiPackage} tone="accent" size="md" className="absolute -bottom-8 left-10" />
            </div>
          </Container>
        </Section>
        <Container className="grid gap-6 pb-16 md:grid-cols-3">
          <Card tone="primary" size="lg" className="flex flex-col gap-3">
            <Heading variant="h3" as="h2" tone="inherit">Compra</Heading>
            <Text tone="inherit">Explora el catálogo de los emprendimientos del campus.</Text>
          </Card>
          <Card tone="secondary" size="lg" className="flex flex-col gap-3">
            <Heading variant="h3" as="h2" tone="inherit">Vende</Heading>
            <Text tone="inherit">Publica tu tienda y gestiona tus pedidos.</Text>
          </Card>
          <Card tone="accent" size="lg" className="flex flex-col gap-3">
            <Heading variant="h3" as="h2" tone="inherit">Sigue tu pedido</Heading>
            <Text tone="inherit">Preparando, listo y entregado.</Text>
          </Card>
        </Container>
      </Stage>
    </SectionBlock>
  )
}
