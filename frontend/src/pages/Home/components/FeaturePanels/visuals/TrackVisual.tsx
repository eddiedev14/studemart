import { Card, IconChip, OrderStatusBadge } from '@/components/ui'
import { Heading, Text } from '@/components/typography'
import { FiTruck } from '@/icons'
import type { OrderStatus } from '@/components/ui/OrderStatusBadge/orderStatus.config'

const steps: { status: OrderStatus; note: string }[] = [
  { status: 'preparing', note: 'El emprendedor arma tu pedido' },
  { status: 'ready', note: 'Listo para recoger en el campus' },
  { status: 'delivered', note: 'Recibido' },
]

export function TrackVisual() {
  return (
    <>
      <Card className="flex flex-col gap-4">
        <div>
          <Text variant="caption" tone="muted" numeric>
            Pedido #1024
          </Text>
          <Heading variant="h4" as="p">
            Pulsera artesanal
          </Heading>
        </div>
        <ol className="flex flex-col gap-3">
          {steps.map((step) => (
            <li key={step.status} className="flex flex-wrap items-center gap-3">
              <OrderStatusBadge status={step.status} />
              <Text variant="sm" tone="muted">
                {step.note}
              </Text>
            </li>
          ))}
        </ol>
      </Card>
      <IconChip
        icon={FiTruck}
        tone="secondary"
        size="lg"
        className="absolute -right-3 -top-6 md:-right-6"
      />
    </>
  )
}
