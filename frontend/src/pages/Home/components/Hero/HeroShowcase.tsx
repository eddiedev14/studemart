import { Card, IconChip, OrderStatusBadge } from '@/components/ui'
import { Button } from '@/components/ui'
import { Heading, Overline, Text } from '@/components/typography'
import { FiPackage, FiShoppingBag, FiTruck } from '@/icons'

/**
 * Composición decorativa del Hero: la tarjeta de producto del Figma
 * con fichas flotantes montadas en sus bordes.
 * Es solo ilustración, por eso se oculta a lectores de pantalla y no recibe foco.
 */
export function HeroShowcase() {
  return (
    <div aria-hidden="true" inert className="relative mx-auto w-full max-w-sm md:ml-auto md:mr-0">
      <Card className="flex flex-col gap-3">
        <Overline>Accesorios</Overline>
        <Heading variant="h4" as="p">
          Pulsera artesanal
        </Heading>
        <Text variant="sm" tone="muted">
          Pulsera tejida a mano por estudiantes de diseño. Disponible en tres colores.
        </Text>
        <Text numeric className="text-h4 font-bold">
          $ 18.000
        </Text>
        <Button>Agregar al carrito</Button>
      </Card>

      <IconChip
        icon={FiShoppingBag}
        tone="primary"
        size="lg"
        className="absolute -right-3 -top-6 md:-right-6"
      />
      <IconChip
        icon={FiTruck}
        tone="secondary"
        size="lg"
        className="absolute -right-3 top-1/2 md:-right-6"
      />
      <IconChip icon={FiPackage} tone="accent" size="md" className="absolute -bottom-8 right-16" />
      <div className="absolute -bottom-5 -left-3 rounded-full bg-base-100 p-1.5 md:-left-8">
        <OrderStatusBadge status="preparing" />
      </div>
    </div>
  )
}
