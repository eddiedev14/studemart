# HU-01 · Inicio de sesión y paneles por rol (backend)

Implementación en las features `auth` y `dashboard`. No se modificó el frontend ni se agregaron dependencias. Todos los endpoints usan el prefijo `/api`; Swagger está en `/api/docs`.

## Base de datos y roles

El esquema base ya existe en `backend/databasescript_postgresql.sql` y Docker Compose lo monta para una base vacía. El SQL adjunto también usa `platform_admins`, `users` y `tenants`, pero difiere del esquema del repositorio en otras columnas y tipos; no se reemplaza ni se ejecuta sobre una base existente.

El login consulta únicamente las columnas de cuentas compartidas por ambos esquemas. No necesita una columna `role`:

| Rol de API     | Nombre de negocio      | Origen                                                         |
| -------------- | ---------------------- | -------------------------------------------------------------- |
| `admin`        | Admin                  | Cuenta `ACTIVE` en `platform_admins`                           |
| `buyer`        | Comprador              | Cuenta `ACTIVE` en `users`, sin tienda `ACTIVE`                |
| `entrepreneur` | Vendedor / emprendedor | Cuenta `ACTIVE` en `users`, propietaria de una tienda `ACTIVE` |

Una cuenta `INACTIVE`, sin contraseña local o inexistente recibe el mismo error de credenciales. Una tienda `PENDING`, `REJECTED` o `SUSPENDED` no concede permisos de vendedor. El rol se vuelve a consultar en cada solicitud protegida: perder una tienda activa retira el acceso al panel de vendedor inmediatamente. Cada panel acepta únicamente su propio rol.

### Migración nueva

Aplicar `src/features/auth/migrations/001-auth-sessions.sql` **después** del esquema base. Es una migración aditiva e idempotente que crea `auth_sessions` e índices; no borra datos ni modifica tablas de otras features. No se ejecuta automáticamente (`synchronize: false`).

Desde `backend`, con PostgreSQL de Docker ya iniciado:

```powershell
Get-Content -Raw -Encoding utf8 src/features/auth/migrations/001-auth-sessions.sql | docker compose exec -T postgres psql -v ON_ERROR_STOP=1 -U studemart -d studemart
```

Si la base aún no existe, `docker compose up -d postgres` inicializa una base vacía con el esquema del repositorio. Si se elige el SQL adjunto como esquema base, se aplica primero en una base vacía y después se aplica la migración de sesiones. No ejecutar dos esquemas base en la misma base.

Los ejemplos de cuentas del esquema base están `INACTIVE` y no tienen contraseña, por lo que no sirven para entrar directamente. Las cuentas que se utilicen deben estar activas, tener `password_hash` generado con bcrypt (recomendado costo 12), y cumplir las restricciones de activación de su esquema. La aprobación de tiendas, el alta de administradores y la activación de cuentas no forman parte de esta HU.

### Configuración

Se reutilizan `JWT_SECRET`, `JWT_EXPIRES_IN` y las variables PostgreSQL existentes en `.env.example`. Usar un secreto aleatorio propio en producción. `JWT_EXPIRES_IN` acepta enteros positivos con `s`, `m`, `h` o `d`, entre `1s` y `30d`; el valor predeterminado es `1d`. Un formato inválido impide el arranque. Tokens HS256, emisor `studemart-api`, audiencia `studemart-web`.

## Endpoints

| Método | Endpoint                      | Autorización                               | Salida correcta                           |
| ------ | ----------------------------- | ------------------------------------------ | ----------------------------------------- |
| POST   | `/api/auth/login`             | Público; solo cuentas de `users`           | 200, token y usuario comprador o vendedor |
| POST   | `/api/auth/admin/login`       | Público; solo cuentas de `platform_admins` | 200, token y usuario administrador        |
| GET    | `/api/auth/me`                | Bearer vigente, cualquier rol              | 200, usuario y rol actuales               |
| POST   | `/api/auth/logout`            | Bearer vigente, cualquier rol              | 200, confirmación de revocación           |
| GET    | `/api/dashboard/buyer`        | Bearer; `buyer`                            | 200, panel del comprador                  |
| GET    | `/api/dashboard/entrepreneur` | Bearer; `entrepreneur`                     | 200, panel del vendedor                   |
| GET    | `/api/dashboard/admin`        | Bearer; `admin`                            | 200, panel del administrador              |

### Login: entrada y salida del servicio

Ambos endpoints de login aceptan únicamente:

```json
{
  "email": "ana@uao.edu.co",
  "password": "UnaClaveSegura123"
}
```

Correo obligatorio, válido, máximo 191 caracteres; se recorta y convierte a minúsculas. Contraseña obligatoria de texto, no compuesta solo por espacios, máximo 72 caracteres y 72 bytes UTF-8 para evitar truncamiento de bcrypt. La contraseña se compara exactamente como se recibió, sin recortarla. El correo de administrador no exige dominio universitario. Se rechazan campos adicionales, incluido `role`.

`AuthLoginService.login(dto, accountType)` devuelve:

```json
{
  "token": "<JWT firmado>",
  "user": {
    "id": "usr-ana",
    "name": "Ana Pérez",
    "email": "ana@uao.edu.co",
    "role": "buyer"
  }
}
```

Para vendedor, `role` es `entrepreneur`; para administrador, `admin`. Cada login crea una sesión independiente en PostgreSQL antes de devolver el token. Ninguna respuesta incluye contraseña ni hash. Las credenciales incorrectas no crean una sesión ni devuelven token. Tener un mismo correo en ambas tablas no mezcla identidades: cada puerta consulta únicamente su tabla.

### Consultar sesión

Enviar `Authorization: Bearer <token>`. `AuthLoginService.authenticate(token)` verifica firma, expiración, emisor, audiencia, sesión persistida y cuenta activa; entrega internamente `{ user, sessionId }` al guard. `GET /api/auth/me` expone solo:

```json
{
  "user": {
    "id": "usr-ana",
    "name": "Ana Pérez",
    "email": "ana@uao.edu.co",
    "role": "buyer"
  }
}
```

### Cerrar sesión

`POST /api/auth/logout`, sin body, con Bearer. `AuthLoginService.logout(sessionId)` revoca únicamente la sesión enviada y devuelve:

```json
{ "message": "Sesión cerrada correctamente." }
```

Reutilizar el token revocado falla con 401, incluso antes de que expire. Otras sesiones del usuario siguen activas. Si el token ya está vencido o revocado, logout responde 401 y el cliente igualmente debe borrar su copia local.

### Paneles: salida del servicio

`DashboardService.welcome(title, user)` devuelve el título, la bienvenida y los datos públicos del usuario. Ejemplo de comprador:

```json
{
  "title": "Panel del comprador",
  "message": "Bienvenido/a, Ana Pérez.",
  "user": {
    "id": "usr-ana",
    "name": "Ana Pérez",
    "email": "ana@uao.edu.co",
    "role": "buyer"
  }
}
```

Los otros títulos son `Panel del vendedor` y `Panel del administrador`. El nombre y el rol siempre se obtienen de la cuenta validada, nunca del body ni de parámetros del cliente.

## Errores

400 por validación conserva el formato del `ValidationPipe` existente:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": ["Ingresa un correo electrónico válido."]
}
```

401 por credenciales incorrectas:

```json
{
  "statusCode": 401,
  "error": "Unauthorized",
  "code": "INVALID_CREDENTIALS",
  "message": "Correo o contraseña incorrectos."
}
```

| Estado | `code`                | Significado                                                                      |
| ------ | --------------------- | -------------------------------------------------------------------------------- |
| 401    | `INVALID_CREDENTIALS` | Correo/contraseña incorrectos o cuenta no habilitada                             |
| 401    | `SESSION_REQUIRED`    | Falta un encabezado Bearer válido                                                |
| 401    | `INVALID_TOKEN`       | Firma, emisor, audiencia o contenido del token inválidos                         |
| 401    | `TOKEN_EXPIRED`       | JWT vencido: `Tu sesión venció. Inicia sesión de nuevo.`                         |
| 401    | `SESSION_REVOKED`     | Sesión cerrada, inexistente o vencida en PostgreSQL                              |
| 401    | `SESSION_INVALID`     | Cuenta eliminada o desactivada                                                   |
| 403    | `ROLE_FORBIDDEN`      | Rol diferente al permitido: `No tienes permiso para entrar a este panel.`        |
| 500    | `SERVER_ERROR`        | Fallo interno: `No pudimos procesar tu solicitud. Inténtalo de nuevo más tarde.` |

Los errores con `code` mantienen los campos `statusCode`, `error`, `code`, `message`. Un error interno no expone consultas, contraseñas ni detalles de PostgreSQL. Un fallo del servidor no se convierte en error de credenciales.

## Integración que corresponde al frontend

Este cambio implementa el backend. El servidor responde JSON y estados HTTP; las redirecciones y mensajes bajo campos corresponden al frontend:

- Usar la instancia única de Axios para login y enviar el Bearer en solicitudes protegidas.
- El contrato `{ token, user }` y los endpoints de login coinciden con el servicio existente. Su mapper ya acepta `buyer`, `entrepreneur` y `admin`.
- `buyer` → `/comprador`; `entrepreneur` → `/emprendedor`; `admin` → `/administradorStudemart/panel`.
- La decisión de dónde persistir el token sigue correspondiendo al equipo de frontend. Esta API entrega Bearer en JSON y no configura cookies.
- Tras recargar, recuperar el token persistido y consultar `/api/auth/me`; el token conserva su validez hasta el vencimiento o revocación.
- Ante cualquier 401 en una solicitud protegida, borrar la sesión local y volver al login. Si `code` es `TOKEN_EXPIRED`, mostrar su aviso. Un 401 del propio login debe mostrar el error de credenciales.
- Ante un 403, llevar al panel del rol vigente sin borrar una sesión válida.
- Al cerrar sesión, llamar a logout y borrar usuario/token locales; los `ProtectedRoute` del cliente deben bloquear de nuevo los paneles.

## Verificación

Desde `backend`:

```powershell
npm run build
npm test -- --runInBand
.\node_modules\.bin\eslint.cmd "{src,apps,libs,test}/**/*.ts"
```

Las pruebas HTTP ejecutan controladores, validación, guards, servicios y JWT reales, con almacenamiento de cuentas/sesiones en memoria. Cubren los tres roles y la matriz de permisos, validación sin consultar credenciales, errores de login, separación de acceso administrativo, recuperación de sesión, logout y rechazo de reutilización, expiración, tokens alterados, desactivación de cuentas, cambio de rol y errores internos. El registro de emprendedores mantiene sus pruebas existentes.

Las versiones instaladas de las integraciones Nest son ESM; el test HTTP las carga mediante el cargador nativo de Node, sin sustituir su implementación, para convivir con la versión de Jest del repositorio. Se recomienda Node 24 para ejecutar esta batería.

No se ejecutó la migración ni se verificó la conexión contra una base PostgreSQL real en este entorno: Docker Desktop no tiene el motor disponible. La validación de la migración y del arranque completo con la base debe hacerse al disponer de PostgreSQL. El test e2e global existente también requiere esa base y las variables de entorno.
