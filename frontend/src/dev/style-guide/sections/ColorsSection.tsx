import { Heading, Text } from '@/components/typography'
import { cn } from '@/lib/cn'
import { SectionBlock } from '../components/SectionBlock'
import { TokenValue } from '../components/TokenValue'
import { colorGroups } from './colors.data'

export function ColorsSection() {
  return (
    <SectionBlock
      id="colores"
      title="Colores"
      description="Tokens del tema studemart. Se usan por nombre (bg-primary, text-base-content), nunca con hex."
    >
      {colorGroups.map((group) => (
        <div key={group.title} className="flex flex-col gap-4">
          <Heading variant="h4">{group.title}</Heading>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {group.colors.map((color) => (
              <div key={color.name} className="overflow-hidden rounded-2xl border border-base-300 bg-base-100">
                <div className={cn('flex h-24 items-end p-3 text-h4', color.bgClass, color.contentClass)}>
                  Aa
                </div>
                <div className="flex flex-col gap-1 p-3">
                  <Text variant="sm" className="font-bold">{color.name}</Text>
                  <Text variant="caption" tone="muted"><TokenValue token={color.token} /></Text>
                  <Text variant="caption" tone="muted">
                    {color.ratio} · {color.passesAA ? 'AA' : 'No AA'}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </SectionBlock>
  )
}
