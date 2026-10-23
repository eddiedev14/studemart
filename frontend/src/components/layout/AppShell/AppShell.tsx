import type { ReactNode } from 'react'
import { AppNavbar } from '@/components/layout/AppNavbar'
import { Container } from '@/components/layout/Container'

/** Estructura de las pantallas internas: Navbar oscuro y contenido sobre base-200. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-base-200">
      <AppNavbar />
      <main>
        <Container className="py-12 md:py-16">{children}</Container>
      </main>
    </div>
  )
}
