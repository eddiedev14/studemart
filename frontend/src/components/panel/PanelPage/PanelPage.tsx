import { AppShell } from '@/components/layout'
import { Heading, Overline, Text } from '@/components/typography'
import { Card } from '@/components/ui'
import { ROLE_LABEL } from '@/config/roles'
import { useAuth } from '@/features/auth'

type PanelPageProps = {
  title: string
  description: string
}

/** Pantalla base de cada panel: título y bienvenida con el nombre. */
export function PanelPage({ title, description }: PanelPageProps) {
  const { user } = useAuth()

  return (
    <AppShell>
      <Card size="lg" className="flex flex-col gap-3">
        {user && <Overline>{ROLE_LABEL[user.role]}</Overline>}
        <Heading variant="h1">{title}</Heading>
        <Text variant="lg">Hola, {user?.name}. Te damos la bienvenida a Studemart.</Text>
        <Text tone="muted">{description}</Text>
      </Card>
    </AppShell>
  )
}
