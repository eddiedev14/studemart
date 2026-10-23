import type { ReactNode } from 'react'
import { Heading, Overline, Text } from '@/components/typography'
import { Card } from '@/components/ui'
import type { CardTone } from '@/components/ui/Card/card.styles'
import { cn } from '@/lib/cn'

type FeaturePanelProps = {
  id: string
  tone: Exclude<CardTone, 'surface'>
  overline: string
  title: string
  description: string
  /** Composición de la derecha (tarjetas de ejemplo y fichas). */
  visual: ReactNode
  /** Pone la composición a la izquierda en escritorio. */
  reverse?: boolean
}

export function FeaturePanel({
  id,
  tone,
  overline,
  title,
  description,
  visual,
  reverse = false,
}: FeaturePanelProps) {
  return (
    <Card
      id={id}
      tone={tone}
      size="lg"
      className="scroll-mt-24 grid items-center gap-12 md:grid-cols-2 md:gap-16"
    >
      <div className={cn('flex flex-col gap-4', reverse && 'md:order-2')}>
        <Overline tone="inherit">{overline}</Overline>
        <Heading variant="h2" tone="inherit">
          {title}
        </Heading>
        <Text variant="lg" tone="inherit" className="max-w-[420px]">
          {description}
        </Text>
      </div>
      <div className={cn('relative mx-auto w-full max-w-sm', reverse && 'md:order-1')}>
        {visual}
      </div>
    </Card>
  )
}
