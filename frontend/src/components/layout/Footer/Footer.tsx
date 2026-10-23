import { Logo } from '@/components/brand'
import { Container } from '@/components/layout/Container'
import { Text } from '@/components/typography'
import { cn } from '@/lib/cn'
import { footerColumns } from './footer.data'
import { FooterColumn } from './FooterColumn'

type FooterProps = {
  className?: string
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn('bg-neutral py-16 text-neutral-content', className)}>
      <Container className="flex flex-col gap-12">
        <div className="grid gap-12 md:grid-cols-[1fr_auto] md:gap-24">
          <div className="flex max-w-xs flex-col gap-4">
            <Logo onDark />
            <Text tone="onDarkMuted" variant="sm">
              El marketplace de los emprendimientos estudiantiles de la UAO.
            </Text>
          </div>
          <div className="grid grid-cols-2 gap-12 md:gap-24">
            {footerColumns.map((column) => (
              <FooterColumn key={column.title} {...column} />
            ))}
          </div>
        </div>
        <Text variant="caption" tone="onDarkMuted">
          © {new Date().getFullYear()} Studemart · Proyecto Informático UAO
        </Text>
      </Container>
    </footer>
  )
}
