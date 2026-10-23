# DESIGN.md — Studemart Design System v1.1

> Fuente de verdad visual para Claude Code y v0.
> Origen del diseño: Figma `Studemart-Design-System` (file key `tuaGeJmB3fBhC2D9hei8NU`, página "Design System").
> Origen del código: `origin/develop` @ `048ce57` ("fix: align theme colors with design system"), archivo `frontend/src/styles/index.css`.
> Marketplace multi-tienda para los emprendimientos estudiantiles de la UAO (Cali, Colombia).

**Orden de autoridad:** (1) `src/styles/index.css` para lo que ya está implementado, (2) Figma para lo que el tema no cubre, (3) este archivo. Cuando (1) y (2) difieren, la sección 4 lo lista y dice qué hacer. No resuelvas la diferencia por tu cuenta.

Si algo no aparece ni en el tema ni en Figma, **no lo inventes**: compón con los tokens existentes y deja `// TODO(design): ...`.

---

## 0. Stack real (verificado en `develop`)

| Pieza | Versión | Nota |
| --- | --- | --- |
| React | 19 | Con React Compiler (`babel-plugin-react-compiler`) |
| Vite | 8 | Alias `@` → `src/` (en `vite.config.ts` y `tsconfig`) |
| TypeScript | ~6.0 | `verbatimModuleSyntax`, `erasableSyntaxOnly` (sin `enum`, sin `namespace`) |
| Tailwind CSS | 4.3 | Vía `@tailwindcss/vite`. **No existe `tailwind.config.js`**: todo vive en el CSS |
| daisyUI | 5.7 | Tema propio `studemart`, `themes: false` |
| Raleway | `@fontsource-variable/raleway` | Se importa en `main.tsx`. Familia CSS: `'Raleway Variable'` |
| Íconos | `react-icons` 5 | Solo `react-icons/fi` (Feather) |
| Formularios | `react-hook-form` + `zod` + `@hookform/resolvers` | Solo al conectar lógica; **no** en trabajo de solo UI |
| HTTP | `axios` | Instancia única en `src/api/` |
| Router | `react-router-dom` 7 | |

**Estilo de código** (`.prettierrc`): sin punto y coma, comillas simples, `jsxSingleQuote: false` (atributos JSX con comillas dobles), coma final `all`, ancho 100, 2 espacios. Exports **con nombre** (`export const App = () => {}`), no `default`. Importa con el alias: `import { Button } from '@/shared/components/ui/Button'`.

---

## 1. Reglas no negociables

1. **Colores solo desde el tema.** `bg-primary`, `text-base-content`, `border-base-300`. Nunca hex, `rgb()`, `oklch()` sueltos ni colores de Tailwind (`bg-red-500`, `text-gray-600`).
2. **Una tipografía: Raleway.** Sin otra familia.
3. **Un set de íconos: Feather (`react-icons/fi`).** Nada de emojis ni SVG a mano.
4. **Clases de daisyUI primero** (`btn`, `input`, `badge`, `card`, `alert`, `tabs`, `join`…); Tailwind para layout y ajustes; CSS propio solo si no hay otra salida.
5. **Radios con clases semánticas** (`rounded-box`, `rounded-field`, `rounded-selector`), nunca `rounded-[12px]`. Así un cambio de tema se hace una sola vez en `index.css`.
6. **El rojo `primary` no comunica error.** Los errores usan `error` + ícono + texto.
7. **Nunca estado solo con color.** Siempre ícono o texto además.
8. **Sin sombras `shadow-*`.** Figma no las usa (ver 4.2 sobre `--depth`).
9. **Solo modo claro.** El tema define `prefersdark: false` y Figma no tiene modo oscuro.
10. No agregues dependencias sin acordarlo con el equipo.

---

## 2. Colores

Los valores del tema están en `oklch`. **Verifiqué cada uno convirtiéndolo a sRGB: los 15 coinciden exactamente con los hex de Figma.** Usa el nombre del token; el hex es solo referencia.

| Token | Hex (Figma) | Texto encima | Contraste | Uso |
| --- | --- | --- | --- | --- |
| `primary` | `#D3122B` | `primary-content` `#FFFFFF` | 5.40:1 AA | Acción principal, marca, overline, panel de marca |
| `secondary` | `#0F6B6F` | `secondary-content` `#FFFFFF` | 6.26:1 AA | Acciones secundarias |
| `accent` | `#7FD6CF` | `accent-content` `#10191A` | 10.56:1 AA | Detalles puntuales (el pin del logo es de este color) |
| `neutral` | `#1A1416` | `neutral-content` `#F3ECEA` | 15.57:1 AA | Superficies oscuras (footer, tooltips) |
| `base-100` | `#FFFFFF` | `base-content` `#1A1416` | 18.17:1 AA | Fondo de página y tarjetas |
| `base-200` | `#FAF6F5` | `base-content` | 16.93:1 AA | Fondo de secciones, bloques, inputs deshabilitados |
| `base-300` | `#EBE3E1` | `base-content` | 14.37:1 AA | Bordes y divisores |
| `info` | `#0284C7` | `info-content` `#FFFFFF` | **4.10:1 NO AA** | Estado "Listo" |
| `success` | `#15803D` | `success-content` `#FFFFFF` | 5.02:1 AA | "Entregado", confirmaciones |
| `warning` | `#F59E0B` | `warning-content` `#1A1416` | 8.46:1 AA | "Preparando", stock bajo |
| `error` | `#A4161A` | `error-content` `#FFFFFF` | 7.75:1 AA | Errores, sin stock |

**Regla 60 / 30 / 10:** 60 % neutros (`base-100`/`base-200`), 30 % `primary`, 10 % `secondary` y `accent`.

### 2.1 Texto secundario

Figma pinta descripciones, captions y metadatos con `#6B6264` (5.91:1 sobre blanco). **No es un token del tema.** Usa `text-base-content/65`: da `#6A6668`, 5.66:1, visualmente idéntico y sin hex suelto. No uses `/60` o menos (cae a 4.75:1 o peor en tamaños pequeños) ni `text-gray-*`.

### 2.2 Estados del pedido

| Estado | Token | Clases | Ícono |
| --- | --- | --- | --- |
| Preparando | `warning` | `badge badge-warning` | `FiClock` |
| Listo | `info` | `badge badge-info` | `FiPackage` |
| Entregado | `success` | `badge badge-success` | `FiCheckCircle` |

Inventario: **Stock bajo** → `warning` + `FiAlertCircle`. **Sin stock** → `error` + `FiAlertCircle`.

---

## 3. Tipografía

**Familia:** `font-sans` = `'Raleway Variable'` (ya es la fuente por defecto en `@theme`). Es variable: cualquier peso entre 100 y 900 está disponible, pero **el sistema usa solo 400, 500, 600, 700 y 800**.
**Mono:** solo para bloques de código (`font-mono`, la del sistema). Roboto Mono de Figma no está instalada; no la agregues.

### 3.1 Numerales

Raleway usa numerales de estilo antiguo por defecto. En **precios, cantidades, tablas y métricas** activa numerales lineales: `[font-feature-settings:'lnum']`. Formato `$ 18.000` (espacio tras el signo, punto de miles, COP):

```ts
new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
```

> Verifica en el navegador que el paquete variable respeta `lnum`. Si no, avisa al diseñador.

### 3.2 Escala (reproduce Figma)

El tema redefine `text-xs … text-4xl` con interlineados propios que **difieren de Figma** en varios estilos (ver 4.3). Para clavar Figma, **combina siempre tamaño + `leading-*` explícito**:

| Estilo | Figma (tamaño / line-height) | Peso | Tracking | Clases |
| --- | --- | --- | --- | --- |
| Display | 56 / 64 | 800 | −2 % | `text-[56px] leading-16 font-extrabold tracking-[-0.02em]` |
| H1 | 40 / 48 | 700 | −1 % | `text-[40px] leading-12 font-bold tracking-[-0.01em]` |
| H2 | 32 / 40 | 700 | 0 | `text-[32px] leading-10 font-bold` |
| H3 | 24 / 32 | 600 | 0 | `text-2xl font-semibold` |
| H4 | 20 / 28 | 600 | 0 | `text-xl leading-7 font-semibold` |
| Body/Large | 18 / 28 | 400 | 0 | `text-lg font-normal` |
| Body/Base | 16 / 24 | 400 | 0 | `text-base leading-6 font-normal` |
| Body/Small | 14 / 20 | 500 | 0 | `text-sm leading-5 font-medium` |
| Caption | 12 / 16 | 500 | 0 | `text-xs leading-4 font-medium` |
| Overline | 12 / 16 | 700 | +8 % | `text-xs leading-4 font-bold uppercase tracking-[0.08em]` |
| Button | 14 / 20 | 600 | 0 | `text-sm leading-5 font-semibold` |

`text-2xl` (24/32) y `text-lg` (18/28) coinciden con Figma tal cual. Display, H1 y H2 no existen en la escala del tema: van con tamaño arbitrario. Evita `text-3xl` y `text-4xl` (30 y 36 px): **no existen en Figma**.

### 3.3 Color de texto

- Títulos y cuerpo: `text-base-content`.
- Overline: `text-primary`.
- Descripciones, captions, metadatos: `text-base-content/65` (ver 2.1).
- Sobre `primary`: `text-primary-content`.

### 3.4 Uso

| Elemento | Estilo |
| --- | --- |
| Hero / panel de marca | Display |
| Título de página | H1 |
| Título de sección | H2 / H3 |
| Título de tarjeta | H3 |
| Precio en tarjeta | H4 + `lnum` |
| Descripción de producto | Body/Base, texto secundario |
| Categoría sobre el título | Overline `text-primary` |
| Texto de botón | Button |
| Label de campo | Body/Small |
| Texto de ayuda / error de campo | Caption |

Un solo `<h1>` por página. No saltes niveles de encabezado.

---

## 4. Tema real vs. Figma (diferencias abiertas)

El tema de `index.css` ya está alineado en **colores**. En lo demás hay diferencias. **Hasta que el equipo decida, sigue la columna "Qué hacer".**

### 4.1 Radios

| Elemento | Figma | Tema hoy | Qué hacer |
| --- | --- | --- | --- |
| Tarjetas | 16 px | `--radius-box: 0.75rem` (12 px) | Usa `rounded-box` |
| Botones, inputs, bloques | 12 px | `--radius-field: 0.5rem` (8 px) | Usa `rounded-field` |
| Badges, pills | 999 px | `--radius-selector: 1rem` (16 px → pill en alto 32) | Usa `rounded-selector` / `badge` |

**Propuesta para el diseñador/equipo:** subir a `--radius-box: 1rem` y `--radius-field: 0.75rem`. Como todo el código usa clases semánticas, el cambio es de dos líneas.

### 4.2 Sombras

`--depth: 1` en el tema hace que daisyUI agregue un relieve sutil a botones y otras piezas. **Figma no tiene sombras** (separa con borde). Propuesta: `--depth: 0`. No añadas `shadow-*` manualmente.

### 4.3 Escala tipográfica (interlineados del tema)

| Estilo | Figma | Tema hoy | Qué hacer |
| --- | --- | --- | --- |
| Caption / Overline (12) | 16 | 18 | `leading-4` explícito |
| Body/Small, Button (14) | 20 | 22 | `leading-5` explícito |
| Body/Base (16) | 24 | 26 | `leading-6` explícito |
| H4 (20) | 28 | 30 | `leading-7` explícito |
| 18 y 24 | 28 / 32 | 28 / 32 | Sin cambio |

Propuesta: igualar los interlineados del tema a Figma y agregar `--text-5xl/6xl` para H1 y Display.

### 4.4 Alto de controles

`--size-field: 0.25rem` → `btn` e `input` miden **40 px**; Figma usa **44 px**. En los componentes: `h-11 min-h-11`. Alternativa de tema: `--size-field: 0.275rem` (probar en navegador).

### 4.5 Contraste de `info`

4.10:1 con texto blanco (Figma lo marca "No AA"). Afecta el badge "Listo". Se respeta tal cual; decisión del diseñador.

### 4.6 Lo que Figma no define

Sin navbar/footer, inputs y estados de error de campo, tablas, dashboard, modal, paginación, imagen de producto, estados vacíos, responsive ni modo oscuro. Compón con las reglas de la sección 7 y marca con `// TODO(design)`.

---

## 5. Espaciado y layout

Grilla de 4 px. Valores observados en Figma:

| px | Tailwind | Dónde |
| --- | --- | --- |
| 8 | `gap-2` | Ícono ↔ texto, label ↔ valor |
| 16 | `gap-4` / `p-4` | Elementos de una tarjeta, bloques de código |
| 24 | `gap-6` / `px-6` | Entre grupos, padding horizontal de botón |
| 32 | `p-8` | Padding de tarjetas |
| 48 | `gap-12` | Entre secciones |
| 80 | `p-20` | Padding de página en desktop |

- Borde estándar: `border border-base-300`. Divisor: `h-px bg-base-300`.
- Lienzo de referencia: 1440 px, contenido 1280 px centrado (`max-w-7xl mx-auto`). Tarjeta de producto de referencia: 400 px.
- **Responsive no está definido en Figma.** Usa los breakpoints de Tailwind, apila en móvil y reduce padding (`px-4 md:px-8 lg:px-20`). Marca con `// TODO(design)`.

---

## 6. Iconografía

- `import { FiShoppingBag } from 'react-icons/fi'` — **solo `fi`**.
- Trazo 2 px (default de Feather; no lo cambies). Color `currentColor`: se controla con `text-*`.
- Decorativos: `aria-hidden="true"`. Botón de solo ícono: `aria-label`.

| Tamaño | Uso |
| --- | --- |
| 16 | Inline con texto |
| 20 | Botones e inputs |
| 24 | Navegación y estados con etiqueta |

Cada ícono va en un slot de 24 × 24. (El 32 px de Figma es solo de la hoja de documentación.)

**Los 18 íconos del MVP (únicos permitidos sin consultar):** `FiHome` `FiSearch` `FiShoppingBag` `FiShoppingCart` `FiUser` `FiPackage` `FiTruck` `FiClock` `FiCheckCircle` `FiAlertCircle` `FiInfo` `FiPlus` `FiMinus` `FiTrash2` `FiBarChart2` `FiLogOut` `FiX` `FiMenu`.

Si necesitas otro (p. ej. `FiMail`, `FiLock`, `FiEye`), **no está en el sistema**: no lo uses sin acordarlo; deja `// TODO(design)`. Mientras tanto, campos sin ícono.

**Uso semántico (definido en Figma):** Entregado `FiCheckCircle` + `text-success` · Listo `FiInfo` + `text-info` · Stock bajo `FiAlertCircle` + `text-warning` · Sin stock `FiAlertCircle` + `text-error`. Ícono 24 px + `gap-2` + etiqueta Body/Small 600.

---

## 7. Marca y logos

Archivos ya en el repo (`frontend/src/assets/`):

| Archivo | Qué es | Dónde usarlo |
| --- | --- | --- |
| `red-logo.webp` | Bolsa "S" con birrete, **rojo sobre fondo claro** (500×500) | Fondos `base-100` / `base-200`; navbar, formularios |
| `white-logo.webp` | Mismo logo, **blanco con pin `accent`, fondo transparente** (500×500) | Sobre `bg-primary` (paneles de marca, footer rojo) |
| `logo.webp` | Logo blanco **con fondo rojo incluido** (269×247) | Ícono de app / favicon / avatar. No lo pongas sobre otros fondos |

```tsx
import redLogo from '@/assets/red-logo.webp'
import whiteLogo from '@/assets/white-logo.webp'

<img src={redLogo} alt="Studemart" className="size-12" />
```

Zona de respeto: 16 px libres. No recolorear, estirar ni sombrear. El `favicon.svg` de `index.html` apunta a un archivo que ya no existe en `public/`: pendiente.

---

## 8. Componentes

Solo los de Figma están definidos con medidas; el resto se compone con las mismas reglas.

### 8.1 Button (Figma)

Alto 44 · padding horizontal 24 · radio de campo · tipografía Button · `primary` / `primary-content`.

```tsx
<button type="button" className="btn btn-primary h-11 min-h-11 rounded-field px-6 text-sm leading-5 font-semibold">
  Agregar al carrito
</button>
```

Con ícono: 20 px a la izquierda, `gap-2`. Variantes `btn-secondary` y `btn-outline` con el mismo alto/radio/tipografía. Ancho completo: `w-full`. Deshabilitado: `btn-disabled`.

### 8.2 Badge de estado (Figma)

Alto 32 · padding 16 · pill · 14/20 SemiBold · fondo `{token}`, texto `{token}-content`.

```tsx
<span className="badge badge-warning h-8 rounded-selector px-4 text-sm leading-5 font-semibold">Preparando</span>
```

Crea `OrderStatusBadge` con `status: 'preparing' | 'ready' | 'delivered'` (tabla 2.2).

### 8.3 Tarjeta de producto (Figma)

Ancho 400 máx. · padding 32 · gap 16 · borde `base-300` · `rounded-box` · fondo `base-100` · sin sombra. Orden: overline (categoría) → H3 título → Body/Base descripción (secundario) → H4 precio (`lnum`) → botón primary.

```tsx
<article className="flex w-full max-w-[400px] flex-col gap-4 rounded-box border border-base-300 bg-base-100 p-8">
  <p className="text-xs leading-4 font-bold tracking-[0.08em] text-primary uppercase">Accesorios</p>
  <h3 className="text-2xl font-semibold">Pulsera artesanal</h3>
  <p className="text-base leading-6 text-base-content/65">
    Pulsera tejida a mano por estudiantes de diseño. Disponible en tres colores.
  </p>
  <p className="text-xl leading-7 font-semibold [font-feature-settings:'lnum']">$ 18.000</p>
  <button type="button" className="btn btn-primary h-11 min-h-11 w-fit rounded-field px-6 text-sm leading-5 font-semibold">
    Agregar al carrito
  </button>
</article>
```

### 8.4 Encabezado de sección (Figma)

Overline `text-primary` (`02 — COLORES`) → H1 → descripción Body/Large secundaria; `gap-4`; divisor `h-px bg-base-300` debajo con `gap-12`.

### 8.5 Bloque de código (Figma)

`bg-base-200`, `p-4`, `rounded-field`, `font-mono text-sm leading-6`. Etiqueta Caption encima, `gap-2`.

### 8.6 Alert

Principio de Figma: error = `error` + ícono + texto. `alert alert-error` (o `-success`, `-warning`, `-info`) con ícono semántico de 24 px y texto Body/Small, `rounded-field`.

### 8.7 Campos de formulario *(no definido en Figma: receta)*

```tsx
<label className="flex flex-col gap-2">
  <span className="text-sm leading-5 font-medium">Correo</span>
  <input type="email" className="input h-11 w-full rounded-field border-base-300 bg-base-100 focus:border-primary focus:outline-primary" placeholder="nombre@correo.com" />
  <span className="text-xs leading-4 font-medium text-base-content/65">Texto de ayuda opcional</span>
</label>
```

Error: `input-error` + línea Caption en `text-error` con `FiAlertCircle` 16 px (patrón ícono + texto). Gap entre campos: `gap-4`.

### 8.8 Segmented control *(no definido en Figma: receta)*

Dos opciones mutuamente excluyentes, estilo daisyUI `join` con radios: `<input type="radio" name="role" className="join-item btn" aria-label="Comprador" />`. La opción marcada se rellena con `primary` (`checked:btn-primary`). Mismo alto 44 px (`h-11 min-h-11`), tipografía Button, ancho `w-full` con opciones al 50 %. Cuando la opción cambia el contenido que se muestra, en trabajo de solo UI se resuelve **sin estado**: radios + variantes `has-[:checked]` / `peer-checked` de Tailwind. La lógica real (React Hook Form) se conecta después.

---

## 9. Accesibilidad

- Contraste mínimo AA (excepción conocida: `info`).
- Objetivos táctiles ≥ 44 px.
- Foco visible: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`.
- Cada campo con `<label>`; grupo de radios con `<fieldset>` + `<legend>` (puede ser `sr-only`).
- `<html lang>` está en `en` en `index.html`; el contenido es español: pendiente de cambiar a `es`.
- Texto de interfaz en **español neutro**.

---

## 10. Estructura de carpetas

**Real en `develop`** (`frontend/src/`):

```
src/
├── api/        # Instancia única de Axios + funciones por recurso
├── assets/     # logo.webp, red-logo.webp, white-logo.webp
├── features/   # Un directorio por dominio (auth, catalog, cart, orders, stores, dashboard…)
├── pages/      # Una página por ruta; solo componen layout + features
├── router/     # React Router + guards por rol
├── shared/     # Todo lo reutilizable entre features
├── styles/
│   └── index.css   # Tailwind + tema daisyUI "studemart" (única fuente de tokens)
├── App.tsx
└── main.tsx
```

**Convención interna propuesta** (las carpetas hoy están vacías con `.gitkeep`):

```
features/auth/
├── components/   # LoginForm, BuyerSignupForm, EntrepreneurSignupForm, RoleSegmentedControl
├── schemas/      # Esquemas zod
└── index.ts
shared/
├── components/
│   ├── ui/       # Primitivas: Button, Badge, Input, Alert, SectionHeader
│   └── layout/   # AuthLayout, Navbar, Footer, Container
├── hooks/        # useDebounce…
├── utils/        # formatCop.ts…
└── types/        # Role: 'buyer' | 'entrepreneur' | 'admin'
```

Reglas:

- `shared/components/ui/*` solo recibe props; no llama a la API ni lee contexto.
- `features/*` componen primitivas de `shared`. Una feature no importa de otra.
- `pages/*` no tienen estilos propios.
- Componentes en PascalCase, un directorio por componente con `index.ts`; hooks con prefijo `use`; utilidades en camelCase.
- La rama `feature/hu-01-login-registro` creó `src/components/{brand,layout,typography,ui}`, que **no coincide** con esta estructura de `develop`. Alinear antes del merge.

Roles del producto: `buyer` (comprador), `entrepreneur` (emprendedor), `admin`.

---

## 11. Instrucciones para v0 y Claude Code

### Haz

- Lee este archivo completo antes de generar UI.
- TSX con componentes funcionales, props tipadas y exports con nombre.
- Solo tokens de la sección 2, escala de la sección 3.2 e íconos de la sección 6.
- Texto de interfaz en español neutro.
- Reutiliza `shared/components/ui/*` antes de crear algo nuevo.

### No hagas

- Hex, `rgb()`, `oklch()` ni colores de Tailwind fuera del tema.
- `shadow-*`, gradientes, glassmorphism, imágenes de stock.
- Otra fuente o pesos fuera de 400–800.
- Íconos fuera de `react-icons/fi` o fuera de la lista de 18 sin avisar.
- `fetch`, otra instancia de Axios, dependencias nuevas, modo oscuro.
- `useState`, `useEffect`, hooks propios ni handlers cuando el encargo es "solo UI".

### Checklist de fidelidad

- [ ] Ningún color fuera del tema (buscar `#`, `rgb(`, `oklch(`, `bg-red-`, `text-gray-`).
- [ ] Cada texto corresponde a una fila de 3.2, con su `leading-*` explícito.
- [ ] Radios con `rounded-box` / `rounded-field` / `rounded-selector`.
- [ ] Botones e inputs de 44 px (`h-11 min-h-11`).
- [ ] Íconos Feather a 16/20/24 y `currentColor`.
- [ ] Estados con ícono + texto.
- [ ] Revisado a 1440 px y a ~390 px.
- [ ] `npm run lint` y `npm run build` pasan.

---

## 12. Referencia Figma

URL: `https://www.figma.com/design/tuaGeJmB3fBhC2D9hei8NU/Studemart-Design-System`

| Sección | Nodo | Contenido |
| --- | --- | --- |
| 01 Portada | `7:34` | Nombre, versión, stack |
| 02 Colores | `8:13` | Tokens, estados del pedido, 60/30/10 |
| 03 Tipografía | `9:112` | Escala, tarjeta de producto |
| 04 Iconografía | `10:112` | Feather, tamaños, íconos del MVP |
| 05 Logos e íconos | `12:112` | Ícono rojo `11:113`, blanco `11:114` |

---

## 13. Decisiones abiertas para el diseñador / equipo

1. Radios del tema (12/8 px) vs Figma (16/12 px). Ver 4.1.
2. `--depth: 1` vs "sin sombras". Ver 4.2.
3. Interlineados del tema vs Figma; faltan Display/H1/H2 en la escala. Ver 4.3.
4. Alto de controles 40 vs 44 px. Ver 4.4.
5. `info` no cumple AA. Ver 4.5.
6. `#6B6264` no es token; se aproxima con `base-content/65`. Ver 2.1.
7. Íconos faltantes para formularios (`FiMail`, `FiLock`, `FiEye`).
8. Diseño de inputs, segmented control, navbar, footer, tablas, dashboard, responsive y modo oscuro.
9. Estructura de `src/`: `develop` (`shared/`, `features/`) vs la rama `hu-01` (`components/`).
10. `favicon.svg` ausente y `<html lang="en">`.
