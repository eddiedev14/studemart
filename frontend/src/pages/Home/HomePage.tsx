import { Footer, Navbar, Stage } from '@/components/layout'
import { ButtonLink } from '@/components/ui'
import { REGISTER_AVAILABLE } from '@/config/features'
import { ROLE_HOME } from '@/config/roles'
import { ROUTES } from '@/config/routes'
import { useAuth } from '@/features/auth'
import { Faq } from './components/Faq'
import { FeaturePanels } from './components/FeaturePanels'
import { FinalCta } from './components/FinalCta'
import { Hero } from './components/Hero'
import { homeNavLinks } from './home.content'

export function HomePage() {
  const { user } = useAuth()

  return (
    <Stage className="flex flex-col">
      <Navbar
        brandHref={ROUTES.home}
        links={homeNavLinks}
        actions={
          user ? (
            <ButtonLink href={ROLE_HOME[user.role]} variant="secondary" shape="nav">
              Mi panel
            </ButtonLink>
          ) : (
            <>
              {REGISTER_AVAILABLE && (
                <ButtonLink
                  href={ROUTES.register}
                  variant="outlineDark"
                  shape="nav"
                  className="hidden sm:inline-flex"
                >
                  Crear cuenta
                </ButtonLink>
              )}
              <ButtonLink href={ROUTES.login} variant="secondary" shape="nav">
                Iniciar sesión
              </ButtonLink>
            </>
          )
        }
      />
      <main className="flex-1">
        <Hero />
        <FeaturePanels />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </Stage>
  )
}
