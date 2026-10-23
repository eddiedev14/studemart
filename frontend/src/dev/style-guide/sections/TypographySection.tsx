import { Heading, Overline, Text } from '@/components/typography'
import { SectionBlock } from '../components/SectionBlock'

const sample = 'Compra y vende dentro del campus'

export function TypographySection() {
  return (
    <SectionBlock
      id="tipografia"
      title="Tipografía"
      description="Raleway en cinco pesos. Escala base de 16 px."
    >
      <div className="flex flex-col gap-6 rounded-2xl bg-base-100 p-6">
        <Heading variant="display">{sample}</Heading>
        <Heading variant="h1" as="p">{sample}</Heading>
        <Heading variant="h2" as="p">{sample}</Heading>
        <Heading variant="h3" as="p">{sample}</Heading>
        <Heading variant="h4" as="p">{sample}</Heading>
        <Text variant="lg">{sample}</Text>
        <Text>{sample}</Text>
        <Text variant="sm">{sample}</Text>
        <Text variant="caption">{sample}</Text>
        <Overline>Tiendas destacadas</Overline>
        <Text numeric className="text-h3 font-bold">$ 18.000</Text>
      </div>
      <div className="flex flex-col gap-6 rounded-2xl bg-neutral p-6 text-neutral-content">
        <Heading variant="displayCaps" tone="onDark">{sample}</Heading>
        <Heading variant="h1Caps" as="p" tone="onDark">Bienvenido de vuelta</Heading>
        <Heading variant="h2Caps" as="p" tone="onDark">Sigue tu pedido</Heading>
        <Text tone="onDarkMuted">El marketplace de los emprendimientos estudiantiles de la UAO.</Text>
        <Overline tone="accent">Marketplace UAO</Overline>
      </div>
    </SectionBlock>
  )
}
