import { Logo, LogoIcon, LogoTile } from '@/components/brand'
import { Stage } from '@/components/layout'
import { SectionBlock } from '../components/SectionBlock'

export function BrandSection() {
  return (
    <SectionBlock id="marca" title="Logo" description="Versión provisional hasta exportar los SVG del Figma.">
      <div className="flex flex-wrap items-center gap-8 rounded-2xl bg-base-100 p-6">
        <LogoIcon className="size-20" />
        <LogoTile className="size-20" />
        <Logo />
        <Logo variant="icon" />
      </div>
      <Stage fullHeight={false} className="flex flex-wrap items-center gap-8 rounded-2xl p-6">
        <LogoTile className="size-20" />
        <Logo onDark />
      </Stage>
    </SectionBlock>
  )
}
