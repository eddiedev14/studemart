import { Container, Section } from '@/components/layout'
import { Heading, Highlight, Text } from '@/components/typography'
import { ButtonLink } from '@/components/ui'
import { REGISTER_AVAILABLE } from '@/config/features'
import { ROUTES } from '@/config/routes'
import { finalCtaContent } from '../../home.content'

export function FinalCta() {
  return (
    <Section className="pt-0">
      <Container className="flex flex-col items-center gap-6 text-center">
        <Heading variant="displayCaps" as="h2" tone="onDark" className="max-w-3xl">
          {finalCtaContent.titleStart}{' '}
          <Highlight tone="accent">{finalCtaContent.titleHighlight}</Highlight>
        </Heading>
        <Text tone="onDarkMuted" className="max-w-[420px]">
          {finalCtaContent.description}
        </Text>
        <div className="flex flex-wrap justify-center gap-4">
          <ButtonLink href={ROUTES.login} size="lg">
            {finalCtaContent.primaryCta}
          </ButtonLink>
          <ButtonLink
            href={ROUTES.register}
            variant="secondary"
            size="lg"
            disabled={!REGISTER_AVAILABLE}
            title={REGISTER_AVAILABLE ? undefined : 'Próximamente'}
          >
            {finalCtaContent.secondaryCta}
          </ButtonLink>
        </div>
      </Container>
    </Section>
  )
}
