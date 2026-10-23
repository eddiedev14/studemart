import { Card, IconChip } from '@/components/ui'
import { Heading, Overline } from '@/components/typography'
import { FiPackage, FiShoppingBag } from '@/icons'

// Alturas en % y días de la semana. Es solo ilustración, no son datos reales.
const bars = [40, 65, 50, 80, 55, 90, 70]
const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

export function SellVisual() {
  return (
    <>
      <Card className="flex flex-col gap-4">
        <div>
          <Overline>Mi tienda</Overline>
          <Heading variant="h4" as="p">
            Ventas de la semana
          </Heading>
        </div>
        <div className="flex h-28 items-end gap-2" aria-hidden="true">
          {bars.map((height, index) => (
            <div
              key={index}
              className="flex-1 rounded-t-lg bg-secondary"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <div className="flex gap-2 text-caption text-base-content/70" aria-hidden="true">
          {days.map((day, index) => (
            <span key={index} className="flex-1 text-center">
              {day}
            </span>
          ))}
        </div>
      </Card>
      <IconChip
        icon={FiShoppingBag}
        tone="primary"
        size="lg"
        className="absolute -right-3 -top-6 md:-right-6"
      />
      <IconChip icon={FiPackage} tone="accent" size="md" className="absolute -bottom-6 right-10" />
    </>
  )
}
