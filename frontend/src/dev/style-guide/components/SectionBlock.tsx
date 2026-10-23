import type { ReactNode } from 'react'
import { Container } from '@/components/layout'
import { Heading, Text } from '@/components/typography'

type SectionBlockProps = {
  id: string
  title: string
  description?: string
  children: ReactNode
}

export function SectionBlock({ id, title, description, children }: SectionBlockProps) {
  return (
    <section id={id} className="border-b border-base-300 py-12">
      <Container className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <Heading variant="h2">{title}</Heading>
          {description && <Text tone="muted">{description}</Text>}
        </div>
        {children}
      </Container>
    </section>
  )
}
