import { Container, Section } from '@/components/layout'
import { Heading, Highlight, Overline, Text } from '@/components/typography'
import { ButtonLink } from '@/components/ui'
import { ROUTES } from '@/config/routes'
import { REGISTER_AVAILABLE } from '@/config/features'
import { heroContent } from '../../home.content'
import { HeroShowcase } from './HeroShowcase'

export function Hero() {
  return (
    <Section className="overflow-x-clip py-16 md:py-24">
      <Container className="grid items-center gap-16 md:grid-cols-2 md:gap-12">
        <div className="flex flex-col items-start gap-6">
          <Overline tone="accent">{heroContent.overline}</Overline>
          <Heading variant="displayCaps" tone="onDark">
            {heroContent.titleStart} <Highlight>{heroContent.titleHighlight}</Highlight>
          </Heading>
          <Text tone="onDarkMuted" className="max-w-[380px]">
            {heroContent.description}
          </Text>
          <div className="flex flex-wrap gap-4">
            <ButtonLink href={ROUTES.login} size="lg">
              {heroContent.primaryCta}
            </ButtonLink>
            <ButtonLink
              href={ROUTES.register}
              variant="secondary"
              size="lg"
              disabled={!REGISTER_AVAILABLE}
              title={REGISTER_AVAILABLE ? undefined : 'Próximamente'}
            >
              {heroContent.secondaryCta}
            </ButtonLink>
          </div>
        </div>

        <HeroShowcase />
      </Container>
    </Section>
  )
}
