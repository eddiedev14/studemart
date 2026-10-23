import { Card, IconChip } from '@/components/ui'
import { Icon } from '@/components/ui/Icon'
import { Heading, Text } from '@/components/typography'
import { FiSearch, FiShoppingCart } from '@/icons'

const products = [
  { name: 'Pulsera artesanal', store: 'Hilos UAO', price: '$ 18.000' },
  { name: 'Cuaderno ilustrado', store: 'Trazos', price: '$ 25.000' },
  { name: 'Brownies x6', store: 'Dulce Campus', price: '$ 15.000' },
]

export function BuyVisual() {
  return (
    <>
      <Card className="flex flex-col gap-4">
        <div className="flex items-center gap-2 rounded-xl bg-base-200 px-4 py-3 text-base-content/70">
          <Icon icon={FiSearch} size="sm" />
          <Text variant="sm" tone="inherit">
            Buscar productos
          </Text>
        </div>
        <ul className="flex flex-col gap-3">
          {products.map((product) => (
            <li key={product.name} className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <Heading variant="h4" as="p" className="truncate text-body font-semibold">
                  {product.name}
                </Heading>
                <Text variant="caption" tone="muted">
                  {product.store}
                </Text>
              </div>
              <Text numeric className="shrink-0 whitespace-nowrap font-bold">
                {product.price}
              </Text>
            </li>
          ))}
        </ul>
      </Card>
      <IconChip
        icon={FiShoppingCart}
        tone="accent"
        size="lg"
        className="absolute -right-3 -top-6 md:-right-6"
      />
    </>
  )
}
