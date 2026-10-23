import { Container } from '@/components/layout'
import { Heading, Overline, Text } from '@/components/typography'
import { BrandSection } from './sections/BrandSection'
import { ButtonsSection } from './sections/ButtonsSection'
import { ColorsSection } from './sections/ColorsSection'
import { FeedbackSection } from './sections/FeedbackSection'
import { FormsSection } from './sections/FormsSection'
import { IconsSection } from './sections/IconsSection'
import { StageSection } from './sections/StageSection'
import { TypographySection } from './sections/TypographySection'

export function StyleGuidePage() {
  return (
    <main>
      <header className="border-b border-base-300 py-12">
        <Container className="flex flex-col gap-2">
          <Overline>Studemart</Overline>
          <Heading variant="h1">Guía de estilos</Heading>
          <Text tone="muted">Colores, tipografía, logo y componentes base del proyecto.</Text>
        </Container>
      </header>
      <ColorsSection />
      <TypographySection />
      <BrandSection />
      <IconsSection />
      <ButtonsSection />
      <FormsSection />
      <FeedbackSection />
      <StageSection />
    </main>
  )
}
