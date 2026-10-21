# Studemart API

API de Studemart construida con NestJS y PostgreSQL. Este backend incluye el registro de emprendedores y la consulta de categorías de tienda. Otras features siguen en desarrollo.

## Cómo trabajar sin pisarse

Cada pareja trabaja solo dentro de su carpeta en `src/features/`. El módulo de esa feature ya está importado en `app.module.ts`.

- El controlador, el servicio, los DTO y las entidades se crean dentro de la feature.
- El controlador y el servicio se registran en el `*.module.ts` de esa misma carpeta.
- No se modifica `app.module.ts` para registrar una feature que ya existe.
- No se agregan entidades en `database/`. La entidad vive en `features/<nombre>/entities/` y se registra con `TypeOrmModule.forFeature([Entidad])` en el módulo de la feature. TypeORM las carga solas.
- No se agregan dependencias sin acordarlo con el equipo.
- Una variable de entorno nueva se agrega en `.env.example`, en `src/config/env.validation.ts` y en `src/config/configuration.ts`.

| Carpeta | Qué se implementa ahí |
| ------- | --------------------- |
| `features/auth` | Registro, login, JWT y strategies de Passport |
| `features/users` | Datos del usuario |
| `features/stores` | Tienda y aprobación o rechazo del administrador |
| `features/products` | Productos, catálogo general y búsqueda |
| `features/carts` | Carrito |
| `features/orders` | Pedidos y consulta de estado |
| `features/dashboard` | Dashboard del emprendedor y métricas del administrador |

`common/guards` y `common/decorators` los llena la pareja de autenticación. El resto de las parejas solo los importa. No se crea otro guard de JWT.

Los roles válidos están en `src/common/enums/role.enum.ts`:

| Valor | Rol |
| ----- | --- |
| `buyer` | Comprador |
| `entrepreneur` | Emprendedor |
| `admin` | Administrador |

## Estructura

```
src/
├── main.ts                 # Prefijo /api, CORS, validación y Swagger
├── app.module.ts           # Config, base de datos y features ya importadas
├── common/
│   ├── decorators/         # Reservado para @Public(), @Roles(), @CurrentUser()
│   ├── enums/role.enum.ts
│   ├── filters/
│   ├── guards/             # Reservado para JWT y roles
│   └── interfaces/
├── config/                 # Variables de entorno
├── database/               # Conexión compartida. migrations/ queda para después
└── features/
    ├── auth/               # dto/ y strategies/
    ├── users/              # dto/ y entities/
    ├── stores/
    ├── products/
    ├── carts/
    ├── orders/
    └── dashboard/
```

Dentro de una feature, los archivos siguen este nombre: `<feature>.module.ts`, `<feature>.controller.ts`, `<feature>.service.ts`.

## Librerías

| Librería | Uso |
| -------- | --- |
| `@nestjs/config`, `joi` | Variables de entorno |
| `@nestjs/typeorm`, `typeorm`, `pg` | PostgreSQL |
| `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt` | JWT |
| `bcryptjs` | Hash de contraseñas |
| `class-validator`, `class-transformer` | Validación de DTO |
| `@nestjs/swagger` | Contrato en `/api/docs` |
| `helmet` | Cabeceras HTTP |

TypeORM no sincroniza el esquema (`synchronize: false`): las tablas, restricciones y triggers deben existir antes de iniciar la API. El esquema de referencia es `databasescript_postgresql.sql`. La base necesita PostgreSQL 15 o superior y la extensión `citext`.

## Cómo ejecutar en Windows sin Docker

1. Instala e inicia PostgreSQL 15 o superior. Anota el puerto, usuario y contraseña (por ejemplo, el instalador puede configurar el puerto `5433`).
2. En pgAdmin, crea una base de datos vacía llamada `studemart`.
3. Abre la base `studemart` en pgAdmin, abre **Tools → Query Tool**, carga `databasescript_postgresql.sql` y ejecútalo con **F5**. Debe ejecutarse una sola vez en la base vacía.
4. En una terminal PowerShell, desde la raíz del repositorio, crea el archivo de variables y entra a backend:

```powershell
Set-Location backend
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
npm install
```

5. Edita `backend\.env` con la conexión a tu PostgreSQL. Por ejemplo, si el servidor escucha en el puerto `5433` y el usuario es `postgres`:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5433
DATABASE_USER=postgres
DATABASE_PASSWORD=la_contraseña_configurada_en_postgresql
DATABASE_NAME=studemart
```

Conserva también las variables `PORT`, `CORS_ORIGIN`, `JWT_SECRET` y `JWT_EXPIRES_IN` del archivo de ejemplo. `PORT` es el puerto de la API, no el de PostgreSQL.

6. Desde la carpeta `backend`, inicia la API:

```powershell
npm run start:dev
```

- API: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/api/docs`

Deja esa terminal abierta mientras pruebas la API. Si aparece un error de conexión, comprueba que el servicio PostgreSQL esté iniciado, que la base exista y que usuario, contraseña y `DATABASE_PORT` en `.env` coincidan con PostgreSQL.

### Alternativa: ejecutar PostgreSQL con Docker

Si tienes Docker Desktop instalado y en ejecución, desde `backend` puedes iniciar la base así:

```powershell
npm run docker:db
```

El contenedor publica PostgreSQL en el puerto `5432`, con base y credenciales `studemart`. En una base nueva, Docker ejecuta `databasescript_postgresql.sql` automáticamente al crear el volumen. La inicialización no se repite si el volumen ya existe.

| Comando | Acción |
| ------- | ------ |
| `npm run start:dev` | API en modo watch. Requiere PostgreSQL |
| `npm run build` | Compila a `dist/` |
| `npm run lint` | ESLint |
| `npm test` | Pruebas unitarias |
| `npm run test:e2e` | Arranque de la API. Requiere PostgreSQL |
| `npm run docker:db` | Solo PostgreSQL |
| `npm run docker:down` | Apaga los contenedores |

Para levantar la API dentro de Docker: `docker compose --profile api up --build`.

## Registro de emprendedores

- `GET /api/stores/categories` devuelve las categorías disponibles con `slug` y `name`.
- `POST /api/auth/entrepreneur/register` recibe `name`, `email`, `password`, `storeName`, `storeDescription` y `storeCategory` (el `slug` devuelto por el endpoint de categorías).
- El alta crea al usuario emprendedor y su tenant/tienda en una sola transacción. La contraseña se almacena hasheada y la tienda queda con estado `PENDING`.
- Correo y nombre de tienda duplicados responden `409 Conflict` con los códigos `EMAIL_ALREADY_REGISTERED` y `STORE_NAME_ALREADY_EXISTS`.
- Las categorías se consultan desde la tabla global `categories` del script PostgreSQL y se guardan en `tenants.category_slug`; el catálogo no está duplicado en el código del backend.
- De acuerdo con el esquema, el usuario se crea como `INACTIVE` hasta que verifique su correo; la respuesta incluye el estado `PENDING` de la tienda para que el panel pueda mostrarlo.
- Restricciones: el correo debe ser válido y pertenecer a `@uao.edu.co`, contraseña de 8 a 72 caracteres, nombre de tienda de 3 a 191 caracteres y descripción de hasta 280 caracteres.

### Prueba rápida con Postman

1. Consulta categorías: método `GET`, URL `http://localhost:3000/api/stores/categories`.
2. Registra una tienda: método `POST`, URL `http://localhost:3000/api/auth/entrepreneur/register`. En **Body → raw → JSON**, envía un correo nuevo que termine en `@uao.edu.co` y un `storeCategory` existente:

```json
{
  "name": "Ana Emprendedora",
  "email": "ana.prueba@uao.edu.co",
  "password": "ClaveSegura123",
  "storeName": "Tienda de Ana",
  "storeDescription": "Productos artesanales hechos en Cali.",
  "storeCategory": "ropa"
}
```

Una respuesta satisfactoria incluye `store.status: "PENDING"`. Usa un correo y nombre de tienda distintos en cada prueba de registro exitosa; repetirlos permite comprobar los conflictos de duplicados.
