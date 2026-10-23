import { Container, Section } from '@/components/layout'
import { Heading, Overline } from '@/components/typography'
import { faqItems } from './faq.data'
import { FaqItem } from './FaqItem'

export function Faq() {
  return (
    <Section id="preguntas" className="scroll-mt-24 pt-0">
      <Container className="grid gap-10 md:grid-cols-[1fr_2fr] md:gap-16">
        <div className="flex flex-col gap-4">
          <Overline tone="accent">Preguntas frecuentes</Overline>
          <Heading variant="h2Caps" tone="onDark">
            Antes de empezar
          </Heading>
        </div>
        <div className="flex flex-col gap-3">
          {faqItems.map((item) => (
            <FaqItem key={item.question} {...item} />
          ))}
        </div>
      </Container>
    </Section>
  )
}
