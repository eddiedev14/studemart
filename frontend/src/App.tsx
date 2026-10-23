import { StyleGuidePage } from '@/dev/style-guide'
import { CartProvider } from '@/features/cart/context/CartProvider'
import { AppRouter } from '@/routes'
import { Toaster } from '@/shared/components/Toaster'

// La guía de estilos solo existe en desarrollo: /dev/style-guide
const showStyleGuide = import.meta.env.DEV && window.location.pathname === '/dev/style-guide'

export function App() {
  return (
    <CartProvider>
      {showStyleGuide ? <StyleGuidePage /> : <AppRouter />}
      <Toaster />
    </CartProvider>
  )
}
