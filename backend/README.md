# Studemart API

Esqueleto del backend para que las parejas trabajen en paralelo. NestJS, PostgreSQL, Docker y las librerías ya están listos. Las features no tienen lógica de negocio.

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

En desarrollo el esquema se sincroniza desde las entidades. No hace falta crear migraciones durante el sprint. `src/database/migrations/` queda reservada para producción.

## Cómo empezar

```bash
cd backend
cp .env.example .env
npm install
npm run docker:db
npm run start:dev
```

- API: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/api/docs`
- PostgreSQL: `localhost:5432`, base `studemart`, usuario y contraseña `studemart`

Si el puerto 5432 ya está ocupado, cambia el puerto publicado en `docker-compose.yml` y `DATABASE_PORT` en `.env`.

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
