# Studemart

Marketplace multi-tienda para los emprendimientos estudiantiles de la Universidad Autónoma de Occidente (UAO), Cali, Colombia. Proyecto de la asignatura Proyecto Informático (MVP en 6 semanas).

## Descripción

Cada emprendimiento tiene su propia tienda dentro de la plataforma. Los compradores navegan un catálogo general, arman un carrito con productos de varias tiendas y hacen pedidos (pago contraentrega). Los emprendedores gestionan sus pedidos y ven su dashboard. El administrador universitario aprueba tiendas y consulta métricas globales.

### Roles

| Rol                    | Qué hace                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| Comprador (estudiante) | Se registra, explora el catálogo, busca, arma el carrito, hace pedidos y consulta su estado |
| Emprendedor            | Registra su tienda, publica productos, gestiona pedidos entrantes y ve su dashboard         |
| Administrador          | Aprueba o rechaza tiendas y ve métricas globales                                            |

### Alcance del MVP

HU incluidas: 01, 02, 03, 05, 06, 08, 09, 10, 11, 12, 13, 15, 16, 17, 21, 22.

Fuera de alcance: pasarela de pago, lugar de entrega, cancelación de pedidos, reseñas, cupones, favoritos, suspensión de tiendas y CRUD de categorías.

## Estructura del repositorio

```
studemart/
├── README.md
├── frontend/     # React + Vite + TypeScript
└── backend/      # NestJS + PostgreSQL + Docker (se agregará en el Sprint 1)
```

Cada carpeta es un proyecto independiente con sus propias dependencias. No se instalan paquetes en la raíz.

## Stack

**Frontend:** React, Vite, TypeScript, React Router DOM, React Hook Form, Axios, Tailwind CSS, daisyUI. Estado global con Context API y hooks.

**Backend:** NestJS, PostgreSQL, Docker. Autenticación con JWT y roles.

## Cómo empezar

### Requisitos

- Node.js 20.19+ (o 22.12+)
- npm
- Git

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`.

Scripts disponibles:

| Comando           | Acción                      |
| ----------------- | --------------------------- |
| `npm run dev`     | Servidor de desarrollo      |
| `npm run build`   | Build de producción         |
| `npm run preview` | Previsualiza el build       |
| `npm run lint`    | Revisa el código con ESLint |

### Backend

Pendiente. Las instrucciones se agregarán cuando el equipo de backend cree el proyecto.

## Flujo de trabajo

### Ramas

| Rama                        | Uso                                                                                     |
| --------------------------- | --------------------------------------------------------------------------------------- |
| `main`                      | Código estable, entregable. Solo recibe merges desde `develop` al cierre de cada sprint |
| `develop`                   | Integración continua del equipo                                                         |
| `feature/hu-XX-descripcion` | Una rama por historia de usuario (ej. `feature/hu-08-catalogo-general`)                 |
| `fix/descripcion-corta`     | Correcciones puntuales                                                                  |

Reglas:

1. Nunca se hace push directo a `main` ni a `develop`.
2. Cada HU se trabaja en su propia rama, creada desde `develop`.
3. Las HU las resuelve una pareja (un integrante de backend y uno de frontend). Si dos parejas comparten una HU, definen primero el contrato compartido (tipos, endpoints, componentes) y se reparten por slices verticales.
4. Antes de abrir el PR: `git pull origin develop`, resolver conflictos y verificar que `npm run build` y `npm run lint` pasan.

### Pull requests

- Título con el mismo formato de commit, por ejemplo `feat: add product catalog grid (HU-08)`.
- Descripción con: HU que resuelve, qué cambió y cómo probarlo.
- Al menos una aprobación de alguien que no sea parte de la pareja.
- Se hace merge con squash hacia `develop`.

### Convención de commits

Formato: `tipo: descripción corta en inglés, en minúscula y en imperativo`.

| Tipo       | Uso                                         | Ejemplo                                  |
| ---------- | ------------------------------------------- | ---------------------------------------- |
| `feat`     | Nueva funcionalidad                         | `feat: create a new product`             |
| `fix`      | Corrección de un error                      | `fix: validate stock when updating cart` |
| `ui`       | Cambios visuales o de interfaz              | `ui: design a new card`                  |
| `refactor` | Reestructuración sin cambiar comportamiento | `refactor: extract cart context logic`   |
| `style`    | Formato, espacios, punto y coma             | `style: format files with prettier`      |
| `docs`     | Documentación                               | `docs: update setup instructions`        |
| `test`     | Pruebas                                     | `test: add login form tests`             |
| `chore`    | Tareas de mantenimiento y configuración     | `chore: update dependencies`             |
| `build`    | Build, Vite, Docker, CI                     | `build: configure path aliases`          |

## Convenciones del frontend

- Los formularios se construyen siempre con React Hook Form.
- Todas las peticiones HTTP pasan por la instancia única de Axios en `src/api/`. No se usa `fetch` ni se crean otras instancias.
- Se priorizan las clases de daisyUI antes de escribir CSS propio.
- Los colores se usan desde el tema (`primary`, `secondary`, `base-100`, etc.), no con valores hexadecimales sueltos.
- No se agregan dependencias sin acordarlo con el equipo.
- Componentes en PascalCase, hooks con prefijo `use`, archivos de utilidades en camelCase.

## Equipo

### Frontend

- Eddie Santiago Delgado
- Manuel Betancurt
- Melany Ceballos
- María Camila Serna
- André Rodriguez
- Alex Silva
- Laura Campo
- Daniel Estevan Ruíz

### Backend

- Christian David Home
- Esteban Nicolas Sanchez
- Daniel Santiago Truque
- Sebastian Leiton
- David Penagos
- Alejandro Muñoz
- Lucas García
- Daniel Vivas
