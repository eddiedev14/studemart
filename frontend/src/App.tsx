export const App = () => {
  return (
    <div className="p-8">
      <button className="btn btn-primary">Studemart App</button>
    </div>
  );
};

/*
  MONTAJE DE PRUEBA DEL CARRITO (HU-11)
  Para probar el carrito: comenta el App de arriba y descomenta este bloque.
  No subas este cambio. Al terminar: git restore frontend/src/App.tsx
  Se borra cuando existan el router, el Navbar y el catálogo.

import { CartDrawer } from '@/features/cart/components/CartDrawer'
import { CartProvider } from '@/features/cart/context/CartProvider'
import { CartDevPanel } from '@/features/cart/mocks/CartDevPanel'
import { CartPage } from '@/pages/CartPage'
import { Toaster } from '@/shared/components/Toaster'

export const App = () => {
  return (
    <CartProvider>
      <header className="flex items-center justify-between border-b border-base-300 px-10 py-3">
        <span className="text-xl font-extrabold text-primary">Studemart</span>
        <CartDrawer />
      </header>
      <CartDevPanel />
      <CartPage />
      <Toaster />
    </CartProvider>
  )
}
*/