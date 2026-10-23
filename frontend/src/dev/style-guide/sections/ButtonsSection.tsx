import { Stage } from '@/components/layout'
import { Button } from '@/components/ui'
import { FiLogOut, FiShoppingCart } from '@/icons'
import { SectionBlock } from '../components/SectionBlock'

export function ButtonsSection() {
  return (
    <SectionBlock id="botones" title="Botones" description="Radio de 12 px. Un solo botón rojo por grupo.">
      <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-base-100 p-6">
        <Button>Primario</Button>
        <Button size="lg">Primario grande</Button>
        <Button variant="secondary">Secundario</Button>
        <Button variant="ghost">Fantasma</Button>
        <Button variant="danger">Eliminar</Button>
        <Button leftIcon={FiShoppingCart}>Agregar al carrito</Button>
        <Button loading>Cargando</Button>
        <Button disabled>Deshabilitado</Button>
      </div>
      <Stage fullHeight={false} className="flex flex-wrap items-center gap-4 rounded-2xl p-6">
        <Button size="lg">Iniciar sesión</Button>
        <Button variant="secondary">Crear cuenta</Button>
        <Button variant="outlineDark">Catálogo</Button>
        <Button variant="secondary" shape="nav">Iniciar sesión</Button>
        <Button variant="outlineDark" leftIcon={FiLogOut}>Cerrar sesión</Button>
      </Stage>
    </SectionBlock>
  )
}
