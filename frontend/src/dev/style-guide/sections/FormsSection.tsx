import { Card, FormField } from '@/components/ui'
import { SectionBlock } from '../components/SectionBlock'

export function FormsSection() {
  return (
    <SectionBlock id="formularios" title="Campos de formulario" description="El error va bajo el campo, con icono y texto.">
      <Card size="lg" className="grid gap-6 md:grid-cols-3">
        <FormField id="demo-email" label="Correo" type="email" placeholder="nombre@uao.edu.co" />
        <FormField id="demo-hint" label="Contraseña" type="password" hint="Mínimo 8 caracteres" />
        <FormField
          id="demo-error"
          label="Correo"
          type="email"
          defaultValue="correo-invalido"
          error="Ingresa un correo con formato válido"
        />
      </Card>
    </SectionBlock>
  )
}
