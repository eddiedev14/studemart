import { Overline } from '@/components/typography'
import { AppLink } from '@/components/ui/AppLink'
import type { FooterColumnData } from './footer.data'

export function FooterColumn({ title, links }: FooterColumnData) {
  return (
    <nav aria-label={title} className="flex flex-col gap-4">
      <Overline tone="accent">{title}</Overline>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <AppLink
              href={link.href}
              className="text-body text-neutral-content/70 transition-colors hover:text-neutral-content focus-visible:text-neutral-content"
            >
              {link.label}
            </AppLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
