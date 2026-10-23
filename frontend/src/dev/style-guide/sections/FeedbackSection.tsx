import { Alert, OrderStatusBadge } from '@/components/ui'
import { FiClock } from '@/icons'
import { SectionBlock } from '../components/SectionBlock'

export function FeedbackSection() {
  return (
    <SectionBlock id="mensajes" title="Mensajes y estados" description="Los errores usan el token error; el aviso de sesión vencida usa warning.">
      <div className="grid gap-4 md:grid-cols-2">
        <Alert variant="error">Correo o contraseña incorrectos.</Alert>
        <Alert variant="error">No pudimos conectar con el servidor. Intenta de nuevo.</Alert>
        <Alert variant="warning" icon={FiClock}>Tu sesión venció. Inicia sesión de nuevo.</Alert>
        <Alert variant="success">Tu tienda fue aprobada.</Alert>
      </div>
      <div className="flex flex-wrap gap-3">
        <OrderStatusBadge status="preparing" />
        <OrderStatusBadge status="ready" />
        <OrderStatusBadge status="delivered" />
      </div>
    </SectionBlock>
  )
}
