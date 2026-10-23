import { Heading, Text } from '@/components/typography'
import { Icon } from '@/components/ui'
import { mvpIcons } from '@/icons'
import { SectionBlock } from '../components/SectionBlock'

export function IconsSection() {
  return (
    <SectionBlock id="iconos" title="Iconos" description="Feather (react-icons/fi). Tamaños de 16, 20 y 24 px.">
      <div className="flex items-end gap-6 rounded-2xl bg-base-100 p-6">
        <Icon icon={mvpIcons.FiShoppingBag} size="sm" />
        <Icon icon={mvpIcons.FiShoppingBag} size="md" />
        <Icon icon={mvpIcons.FiShoppingBag} size="lg" />
        <Heading variant="h4" as="p">16 · 20 · 24 px</Heading>
      </div>
      <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
        {Object.entries(mvpIcons).map(([name, icon]) => (
          <div key={name} className="flex flex-col items-center gap-2 rounded-2xl border border-base-300 bg-base-100 p-4">
            <Icon icon={icon} size="lg" />
            <Text variant="caption" tone="muted">{name}</Text>
          </div>
        ))}
      </div>
    </SectionBlock>
  )
}
