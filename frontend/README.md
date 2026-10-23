# Frontend — Studemart

React 19, Vite, TypeScript, Tailwind CSS v4 y daisyUI 5. Iconos de Feather (`react-icons/fi`) y tipografía Raleway.

## Estructura de `src`

```
src/
├── styles/                 Estilos globales
│   ├── index.css           Punto de entrada
│   ├── daisyui.css         Configuración del plugin
│   ├── theme.css           Tema "studemart" (colores y radios)
│   ├── typography.css      Escala tipográfica y variantes en mayúsculas
│   └── base.css            Reglas base del documento
├── lib/
│   └── cn.ts               Une clases condicionales
├── icons/
│   └── index.ts            Iconos permitidos del MVP
├── components/
│   ├── brand/Logo/         Logo, LogoIcon, LogoTile
│   ├── typography/         Heading, Text, Overline
│   ├── layout/             Container, Section, Stage
│   └── ui/                 Button, FormField, Alert, Card, IconChip, OrderStatusBadge, Icon
└── dev/style-guide/        Guía visual con todos los componentes
```

## Reglas

- Los colores se usan por nombre de token (`bg-primary`, `text-base-content`), nunca con hex.
- El rojo `primary` no se usa para errores. Los errores usan `error`, con icono y texto.
- Sobre el fondo oscuro (`Stage`) no va texto en `primary`, `secondary` ni `error`.
- Los titulares en mayúsculas (`displayCaps`, `h1Caps`, `h2Caps`) son solo para pantallas de escenario.
- Los precios y números de tablas llevan la clase `price` (o `numeric` en `Text`).
- Un solo set de iconos: se importan desde `@/icons` y se dibujan con `Icon` (16, 20 o 24 px).
- Los imports usan el alias `@/` (apunta a `src/`).

## Cómo agregar un componente

Cada componente vive en su propia carpeta:

```
components/ui/NombreComponente/
├── NombreComponente.tsx          Componente
├── nombreComponente.styles.ts    Variantes y clases, si las tiene
└── index.ts                      Exporta lo público
```

Después se exporta desde el `index.ts` de su grupo y se agrega a la guía de estilos en `src/dev/style-guide/sections/`.

## Scripts

| Comando           | Acción                      |
| ----------------- | --------------------------- |
| `npm run dev`     | Servidor de desarrollo      |
| `npm run build`   | Build de producción         |
| `npm run preview` | Previsualiza el build       |
| `npm run lint`    | Revisa el código con ESLint |

## Autenticación

Flujo: `LoginForm` → `useAuth().login()` → `authService` → `apiClient` (Axios) → backend.

```
src/
├── config/        routes.ts (rutas), roles.ts (panel y opciones del Navbar por rol), features.ts, env.ts
├── features/auth/ AuthProvider, useAuth, auth.storage.ts, components/LoginForm
├── services/      api/apiClient.ts (Axios + token + 401), auth/auth.service.ts, auth.mock.ts
└── routes/        AppRouter, ProtectedRoute (roles permitidos), GuestRoute (login)
```

- **Mock sin backend:** `VITE_USE_MOCK_AUTH=true` en `.env.development`. Usuarios y contraseña aparecen en la pantalla de login. Para pasar al backend real, poner `false` y definir `VITE_API_URL`.
- **Contrato del backend:** `POST /auth/login` y `POST /auth/admin/login` con `{ email, password }`; responden `200 { token, user: { id, name, email, role } }` o `401`. Cada endpoint rechaza los roles que no le tocan. Si el backend nombra distinto los roles, se ajusta en `services/auth/auth.mapper.ts`.
- **Dónde se guarda la sesión:** `features/auth/auth.storage.ts` (hoy `localStorage`; decisión pendiente con el equipo).
- **Administrador:** entra escribiendo `/administradorStudemart` (nadie lo enlaza). Es discreción, no seguridad: el backend debe validar el rol siempre.
- **Probar el 401:** en desarrollo, en la consola del navegador: `studemartDev.expireSession()`.
- **Opciones del Navbar:** `config/roles.ts`. Las pantallas que no existen tienen `soon: true`; quitarlo cuando se construyan.
