-- =====================================================================
-- MARKETPLACE UNIVERSITARIO UAO · POSTGRESQL 15+
-- =====================================================================
-- Modelo: una sola base de datos y un solo esquema.
--
-- ROLES (solo dos):
--   * admin   (platform_admins): aprueba o rechaza el registro de tiendas
--             y administra las categorías globales.
--   * usuario (users): compra en cualquier tienda. Si abre una tienda y el
--             admin la aprueba, además vende en ella.
--
-- REGLAS DE NEGOCIO que la base de datos hace cumplir:
--   * Un usuario tiene 0 o 1 tienda "viva" (PENDING, ACTIVE o SUSPENDED).
--     Si el admin la rechaza (REJECTED) puede volver a solicitar otra.
--   * Un dueño NO puede comprar ni reseñar en su propia tienda (trigger).
--     Sí puede comprar en las tiendas de los demás.
--   * Una tienda solo recibe pedidos y publica productos si está ACTIVE
--     (trigger). Mientras está PENDING puede preparar borradores (DRAFT).
--   * Todo producto tiene al menos una variante (trigger diferido). El
--     stock vive SOLO en las variantes. Un producto sin variantes reales
--     lleva una variante por defecto (p. ej. "Única").
--   * Para comprar, el usuario debe tener teléfono registrado (trigger).
--   * Los productos de un pedido pertenecen a la tienda del pedido (trigger).
--   * Un pedido no se entrega sin haber confirmado el pago.
--
-- PAGOS: acuerdo directo comprador-vendedor, el dinero no pasa por la
--   plataforma. Se registra el método acordado y cuándo el vendedor
--   confirmó haber recibido el dinero (orders.paid_at).
--
-- AISLAMIENTO ENTRE TIENDAS: lo hace el backend, filtrando siempre por
--   tenant_id (products, orders, support_messages son las únicas tablas
--   con tenant_id; el resto cuelga de ellas). No se usa Row-Level Security.
--
-- DATOS DERIVADOS (no se guardan, se calculan): stock total, número de
--   reseñas y promedio de calificación -> vista product_stats.
--   Notificaciones del vendedor -> consultar pedidos en PENDING y mensajes
--   de soporte en NUEVO.
--
-- BORRADOS: se prefiere desactivar usuarios y archivar productos.
--   Un producto con pedidos no se puede borrar (RESTRICT). Una variante
--   sí: el pedido conserva variant_name como historial.
--
-- REQUISITOS: PostgreSQL 15 o superior (ON DELETE SET NULL (columnas)).
--   Extensión citext (viene incluida).
--
-- EJECUCIÓN: sobre una BASE VACÍA ya seleccionada. Todo el archivo va en
--   una sola transacción: si algo falla, no queda nada a medias.
-- =====================================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS citext;


-- ---------------------------------------------------------------------
-- Tipos enumerados
-- ---------------------------------------------------------------------
CREATE TYPE tenant_status     AS ENUM ('PENDING', 'ACTIVE', 'REJECTED', 'SUSPENDED');
CREATE TYPE account_status    AS ENUM ('ACTIVE', 'INACTIVE');

CREATE TYPE product_status    AS ENUM ('PUBLISHED', 'DRAFT', 'ARCHIVED');
CREATE TYPE product_condition AS ENUM ('NEW', 'USED');

-- El pago NO es un estado del pedido: se deduce de orders.paid_at.
CREATE TYPE order_status      AS ENUM ('PENDING', 'PACKING', 'DELIVERED', 'CANCELLED');
CREATE TYPE payment_method    AS ENUM ('CASH', 'TRANSFER', 'NEQUI', 'DAVIPLATA', 'OTHER');

CREATE TYPE support_kind      AS ENUM ('PETICION', 'QUEJA', 'RECLAMO', 'SUGERENCIA', 'CONTACTO');
CREATE TYPE support_status    AS ENUM ('NUEVO', 'EN_PROCESO', 'RESUELTO', 'CERRADO');


-- ---------------------------------------------------------------------
-- Funciones auxiliares
-- ---------------------------------------------------------------------
-- Mantiene updated_at al día en cada UPDATE.
CREATE FUNCTION set_updated_at() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;


-- ---------------------------------------------------------------------
-- Tablas globales: cuentas
-- ---------------------------------------------------------------------
-- Ser admin = estar en esta tabla. Solo hay un rol de administración.
CREATE TABLE platform_admins (
  id            text PRIMARY KEY,
  name          text NOT NULL,
  email         citext NOT NULL,
  password_hash text,
  status        account_status NOT NULL DEFAULT 'INACTIVE',
  created_at    timestamptz(3) NOT NULL DEFAULT now(),
  updated_at    timestamptz(3) NOT NULL DEFAULT now(),
  CONSTRAINT platform_admins_email_key UNIQUE (email),
  CONSTRAINT platform_admins_active_password_chk
    CHECK (status <> 'ACTIVE' OR (password_hash IS NOT NULL AND length(password_hash) > 0))
);

-- Cuenta única de cada estudiante. Solo correos @uao.edu.co.
-- Nombre, correo y teléfono viven AQUÍ y nada más: los pedidos y los
-- mensajes de soporte los leen de esta tabla.
CREATE TABLE users (
  id                text PRIMARY KEY,
  name              text NOT NULL,
  email             citext NOT NULL,
  password_hash     text,
  google_id         text,
  phone             text,
  status            account_status NOT NULL DEFAULT 'INACTIVE',
  email_verified_at timestamptz(3),
  terms_accepted_at timestamptz(3),
  created_at        timestamptz(3) NOT NULL DEFAULT now(),
  updated_at        timestamptz(3) NOT NULL DEFAULT now(),
  CONSTRAINT users_email_key UNIQUE (email),
  CONSTRAINT users_google_id_key UNIQUE (google_id),
  CONSTRAINT users_email_domain_chk
    CHECK (email::text ~* '^[a-z0-9._%+-]+@uao\.edu\.co$'),
  -- Una cuenta activa debe tener el correo verificado y una forma de entrar.
  CONSTRAINT users_active_chk
    CHECK (status <> 'ACTIVE'
           OR (email_verified_at IS NOT NULL
               AND (password_hash IS NOT NULL OR google_id IS NOT NULL)))
);

CREATE TABLE password_reset_tokens (
  id         text PRIMARY KEY,
  user_id    text NOT NULL,
  token_hash text NOT NULL,
  expires_at timestamptz(3) NOT NULL,
  used_at    timestamptz(3),
  created_at timestamptz(3) NOT NULL DEFAULT now(),
  CONSTRAINT password_reset_tokens_token_hash_key UNIQUE (token_hash),
  CONSTRAINT password_reset_tokens_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT password_reset_tokens_expiry_chk CHECK (expires_at > created_at)
);
CREATE INDEX password_reset_tokens_user_id_idx ON password_reset_tokens (user_id);


-- ---------------------------------------------------------------------
-- Tiendas y categorías
-- ---------------------------------------------------------------------
-- Tienda = tenant. Nace PENDING y la revisa un admin.
-- La dirección pública se deduce del slug (slug + dominio base), por eso
-- no hay columna "domain".
CREATE TABLE tenants (
  id               bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  owner_id         text NOT NULL,
  name             text NOT NULL,
  description      text NOT NULL,   -- qué es y qué vende la tienda; lo revisa el admin
  category_slug    citext NOT NULL,
  slug             text NOT NULL,
  logo_url         text,
  banner_url       text,
  status           tenant_status NOT NULL DEFAULT 'PENDING',
  reviewed_by_id   text,
  reviewed_at      timestamptz(3),
  rejection_reason text,
  created_at       timestamptz(3) NOT NULL DEFAULT now(),
  updated_at       timestamptz(3) NOT NULL DEFAULT now(),
  CONSTRAINT tenants_owner_id_fkey
    FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE RESTRICT,
  CONSTRAINT tenants_reviewed_by_id_fkey
    FOREIGN KEY (reviewed_by_id) REFERENCES platform_admins (id) ON DELETE RESTRICT,
  CONSTRAINT tenants_description_chk CHECK (length(btrim(description)) > 0),
  CONSTRAINT tenants_slug_chk
    CHECK (slug ~ '^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$'),
  -- Aprobar o rechazar deja constancia de quién y cuándo.
  CONSTRAINT tenants_review_chk
    CHECK (status NOT IN ('ACTIVE', 'REJECTED')
           OR (reviewed_by_id IS NOT NULL AND reviewed_at IS NOT NULL)),
  CONSTRAINT tenants_rejection_reason_chk
    CHECK (status <> 'REJECTED'
           OR (rejection_reason IS NOT NULL AND length(btrim(rejection_reason)) > 0))
);
-- Una tienda viva (PENDING, ACTIVE o SUSPENDED) por estudiante. Las
-- REJECTED quedan como historial y no cuentan: el usuario puede volver a
-- solicitar. Por la misma razón, el slug de una tienda rechazada queda
-- libre para reutilizarse.
CREATE UNIQUE INDEX tenants_owner_id_key ON tenants (owner_id) WHERE status <> 'REJECTED';
CREATE UNIQUE INDEX tenants_slug_key     ON tenants (slug)     WHERE status <> 'REJECTED';
CREATE INDEX tenants_owner_id_idx ON tenants (owner_id);
CREATE INDEX tenants_status_idx ON tenants (status);
CREATE INDEX tenants_reviewed_by_id_idx ON tenants (reviewed_by_id);

-- Categorías GLOBALES de la plataforma, administradas por el admin. Así
-- "Ropa" es la misma para todas las tiendas y el comprador puede explorar
-- por categoría entre tiendas. Íconos y colores son cosa del frontend.
CREATE TABLE categories (
  slug       citext PRIMARY KEY,
  name       text NOT NULL,
  created_at timestamptz(3) NOT NULL DEFAULT now(),
  updated_at timestamptz(3) NOT NULL DEFAULT now(),
  CONSTRAINT categories_name_key UNIQUE (name)
);

ALTER TABLE tenants
  ADD CONSTRAINT tenants_category_fkey
  FOREIGN KEY (category_slug) REFERENCES categories (slug)
  ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX tenants_category_idx ON tenants (category_slug);


-- ---------------------------------------------------------------------
-- Catálogo de la tienda
-- ---------------------------------------------------------------------
CREATE TABLE products (
  id            text PRIMARY KEY,
  tenant_id     bigint NOT NULL,
  slug          citext NOT NULL,
  name          text NOT NULL,
  description   text,
  status        product_status NOT NULL DEFAULT 'PUBLISHED',
  condition     product_condition NOT NULL DEFAULT 'NEW',
  price         numeric(12,2) NOT NULL,
  offer_price   numeric(12,2),          -- si no es NULL, el producto está en oferta
  category_slug citext NOT NULL,
  created_at    timestamptz(3) NOT NULL DEFAULT now(),
  updated_at    timestamptz(3) NOT NULL DEFAULT now(),
  CONSTRAINT products_slug_key UNIQUE (tenant_id, slug),
  CONSTRAINT products_tenant_id_fkey
    FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE RESTRICT,
  CONSTRAINT products_category_fkey
    FOREIGN KEY (category_slug) REFERENCES categories (slug)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT products_price_chk CHECK (price >= 0),
  CONSTRAINT products_offer_chk
    CHECK (offer_price IS NULL OR (offer_price >= 0 AND offer_price < price))
);
CREATE INDEX products_tenant_status_created_idx ON products (tenant_id, status, created_at DESC);
CREATE INDEX products_category_status_idx ON products (category_slug, status);

-- La imagen principal es la de menor sort_order (empate: la más antigua).
CREATE TABLE product_images (
  id         text PRIMARY KEY,
  product_id text NOT NULL,
  url        text NOT NULL,
  alt        text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz(3) NOT NULL DEFAULT now(),
  updated_at timestamptz(3) NOT NULL DEFAULT now(),
  CONSTRAINT product_images_product_fkey
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
);
CREATE INDEX product_images_product_idx ON product_images (product_id, sort_order);

-- Todo producto tiene al menos una variante (ej. talla S, M, L, o "Única").
-- El stock vive solo aquí.
CREATE TABLE product_variants (
  id         text PRIMARY KEY,
  product_id text NOT NULL,
  name       text NOT NULL,
  stock      integer NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz(3) NOT NULL DEFAULT now(),
  updated_at timestamptz(3) NOT NULL DEFAULT now(),
  CONSTRAINT product_variants_product_name_key UNIQUE (product_id, name),
  -- Permite a order_items validar que variante y producto coinciden.
  CONSTRAINT product_variants_product_id_id_key UNIQUE (product_id, id),
  CONSTRAINT product_variants_product_fkey
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
  CONSTRAINT product_variants_stock_chk CHECK (stock >= 0)
);


-- ---------------------------------------------------------------------
-- Compradores: carrito y reseñas
-- ---------------------------------------------------------------------
-- Carrito = las filas de este usuario. No hay tabla "carts": para comprar
-- hay que iniciar sesión, así que el carrito de invitado vive en el
-- navegador. La tienda se deduce de la variante -> producto -> tenant.
CREATE TABLE cart_items (
  user_id    text NOT NULL,
  variant_id text NOT NULL,
  qty        integer NOT NULL DEFAULT 1,
  created_at timestamptz(3) NOT NULL DEFAULT now(),
  updated_at timestamptz(3) NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, variant_id),
  CONSTRAINT cart_items_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  -- Si se borra la variante, desaparece del carrito en lugar de bloquear el borrado.
  CONSTRAINT cart_items_variant_fkey
    FOREIGN KEY (variant_id) REFERENCES product_variants (id) ON DELETE CASCADE,
  CONSTRAINT cart_items_qty_chk CHECK (qty > 0)
);
CREATE INDEX cart_items_variant_idx ON cart_items (variant_id);

CREATE TABLE reviews (
  id         text PRIMARY KEY,
  product_id text NOT NULL,
  user_id    text NOT NULL,
  rating     integer NOT NULL,
  title      text,
  body       text NOT NULL,
  created_at timestamptz(3) NOT NULL DEFAULT now(),
  updated_at timestamptz(3) NOT NULL DEFAULT now(),
  CONSTRAINT reviews_product_user_key UNIQUE (product_id, user_id),
  CONSTRAINT reviews_product_fkey
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
  CONSTRAINT reviews_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT reviews_rating_chk CHECK (rating BETWEEN 1 AND 5)
);
CREATE INDEX reviews_user_idx ON reviews (user_id);


-- ---------------------------------------------------------------------
-- Pedidos
-- ---------------------------------------------------------------------
-- Un pedido es de UNA tienda. Si el carrito mezcla tiendas, el backend
-- crea un pedido por tienda. Nombre, correo y teléfono del comprador se
-- leen de users. El pago es un acuerdo directo: payment_method es lo
-- acordado y paid_at es cuándo el vendedor confirmó haber recibido el dinero.
CREATE TABLE orders (
  id             text PRIMARY KEY,
  tenant_id      bigint NOT NULL,
  code           citext NOT NULL,
  user_id        text NOT NULL,             -- todo comprador es un usuario registrado
  status         order_status NOT NULL DEFAULT 'PENDING',
  payment_method payment_method NOT NULL,
  paid_at        timestamptz(3),
  reference      text,                      -- punto de encuentro en el campus
  total          numeric(12,2) NOT NULL,    -- valor acordado al comprar (foto del momento)
  delivered_at   timestamptz(3),
  created_at     timestamptz(3) NOT NULL DEFAULT now(),
  updated_at     timestamptz(3) NOT NULL DEFAULT now(),
  CONSTRAINT orders_code_key UNIQUE (tenant_id, code),
  -- Permite a support_messages validar que pedido y tienda coinciden.
  CONSTRAINT orders_tenant_id_id_key UNIQUE (tenant_id, id),
  CONSTRAINT orders_tenant_id_fkey
    FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE RESTRICT,
  CONSTRAINT orders_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE RESTRICT,
  CONSTRAINT orders_total_chk CHECK (total >= 0),
  CONSTRAINT orders_delivered_chk CHECK ((status = 'DELIVERED') = (delivered_at IS NOT NULL)),
  -- No se entrega sin haber confirmado el pago.
  CONSTRAINT orders_delivered_paid_chk CHECK (status <> 'DELIVERED' OR paid_at IS NOT NULL)
);
CREATE INDEX orders_user_idx ON orders (user_id, created_at DESC);
CREATE INDEX orders_tenant_status_created_idx ON orders (tenant_id, status, created_at DESC);

-- Los datos del producto (name, variant_name, unit_price) son una FOTO del
-- momento de la compra: se guardan a propósito para conservar el historial
-- aunque después cambie o se borre el producto o la variante.
CREATE TABLE order_items (
  id           text PRIMARY KEY,
  order_id     text NOT NULL,
  product_id   text NOT NULL,
  variant_id   text,
  name         text NOT NULL,
  variant_name text NOT NULL,
  unit_price   numeric(12,2) NOT NULL,
  qty          integer NOT NULL,
  CONSTRAINT order_items_order_fkey
    FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
  -- Un producto con pedidos no se borra: se archiva.
  CONSTRAINT order_items_product_fkey
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE RESTRICT,
  -- Si se borra la variante, el pedido conserva variant_name y solo pierde el vínculo.
  CONSTRAINT order_items_variant_fkey
    FOREIGN KEY (product_id, variant_id)
    REFERENCES product_variants (product_id, id) ON DELETE SET NULL (variant_id),
  CONSTRAINT order_items_unit_price_chk CHECK (unit_price >= 0),
  CONSTRAINT order_items_qty_chk CHECK (qty > 0)
);
CREATE INDEX order_items_order_idx ON order_items (order_id);
CREATE INDEX order_items_product_variant_idx ON order_items (product_id, variant_id);


-- ---------------------------------------------------------------------
-- Soporte (PQRS dirigido a una tienda)
-- ---------------------------------------------------------------------
-- Quien escribe es siempre un usuario: nombre, correo y teléfono se leen
-- de users. Si el mensaje trata de un pedido, se enlaza al pedido (de la
-- misma tienda).
CREATE TABLE support_messages (
  id           text PRIMARY KEY,
  tenant_id    bigint NOT NULL,
  radicado     citext NOT NULL,
  kind         support_kind NOT NULL,
  status       support_status NOT NULL DEFAULT 'NUEVO',
  user_id      text NOT NULL,
  order_id     text,
  subject      text NOT NULL,
  message      text NOT NULL,
  response     text,
  responded_at timestamptz(3),
  created_at   timestamptz(3) NOT NULL DEFAULT now(),
  updated_at   timestamptz(3) NOT NULL DEFAULT now(),
  CONSTRAINT support_messages_radicado_key UNIQUE (tenant_id, radicado),
  CONSTRAINT support_messages_tenant_id_fkey
    FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE RESTRICT,
  CONSTRAINT support_messages_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE RESTRICT,
  CONSTRAINT support_messages_order_fkey
    FOREIGN KEY (tenant_id, order_id) REFERENCES orders (tenant_id, id)
    ON DELETE SET NULL (order_id),
  CONSTRAINT support_messages_response_chk CHECK ((response IS NULL) = (responded_at IS NULL))
);
CREATE INDEX support_messages_status_created_idx ON support_messages (tenant_id, status, created_at DESC);
CREATE INDEX support_messages_kind_idx ON support_messages (tenant_id, kind);
CREATE INDEX support_messages_user_idx ON support_messages (user_id);
CREATE INDEX support_messages_order_idx ON support_messages (tenant_id, order_id)
  WHERE order_id IS NOT NULL;


-- ---------------------------------------------------------------------
-- Vista de datos derivados (stock total, reseñas, promedio)
-- ---------------------------------------------------------------------
-- Se calculan al consultar: nunca quedan desactualizados.
CREATE VIEW product_stats AS
SELECT
  p.id AS product_id,
  coalesce((SELECT sum(v.stock) FROM product_variants v WHERE v.product_id = p.id), 0)::integer
    AS stock,
  (SELECT count(*) FROM reviews r WHERE r.product_id = p.id)::integer
    AS review_count,
  coalesce((SELECT round(avg(r.rating), 1) FROM reviews r WHERE r.product_id = p.id), 0)::numeric(2,1)
    AS rating_avg
FROM products p;


-- ---------------------------------------------------------------------
-- Triggers de updated_at (en toda tabla que tenga esa columna)
-- ---------------------------------------------------------------------
DO $$
DECLARE t text;
BEGIN
  FOR t IN
    SELECT c.table_name
    FROM information_schema.columns c
    JOIN information_schema.tables tb
      ON tb.table_schema = c.table_schema AND tb.table_name = c.table_name
    WHERE c.table_schema = 'public'
      AND c.column_name = 'updated_at'
      AND tb.table_type = 'BASE TABLE'
  LOOP
    EXECUTE format(
      'CREATE TRIGGER %I BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_updated_at()',
      t || '_set_updated_at', t);
  END LOOP;
END $$;


-- ---------------------------------------------------------------------
-- Reglas de negocio que un CHECK no puede expresar (miran otra tabla)
-- ---------------------------------------------------------------------
-- 1. Un dueño no compra en su propia tienda.
CREATE FUNCTION forbid_owner_self_purchase() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM tenants t
             WHERE t.id = NEW.tenant_id AND t.owner_id = NEW.user_id) THEN
    RAISE EXCEPTION 'El dueño de la tienda % no puede comprar en su propia tienda', NEW.tenant_id
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER orders_no_self_purchase
  BEFORE INSERT OR UPDATE OF tenant_id, user_id ON orders
  FOR EACH ROW EXECUTE FUNCTION forbid_owner_self_purchase();

-- 2. Un dueño no reseña los productos de su propia tienda.
CREATE FUNCTION forbid_owner_self_review() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF EXISTS (SELECT 1
             FROM products p
             JOIN tenants t ON t.id = p.tenant_id
             WHERE p.id = NEW.product_id AND t.owner_id = NEW.user_id) THEN
    RAISE EXCEPTION 'El dueño de la tienda no puede reseñar sus propios productos'
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER reviews_no_self_review
  BEFORE INSERT OR UPDATE OF product_id, user_id ON reviews
  FOR EACH ROW EXECUTE FUNCTION forbid_owner_self_review();

-- 3. Un pedido nuevo exige tienda ACTIVE y comprador con teléfono (el
--    vendedor necesita contactarlo). Los pedidos ya creados se pueden
--    seguir actualizando (entregar, cancelar) aunque la tienda se suspenda.
CREATE FUNCTION check_new_order() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM tenants t
                 WHERE t.id = NEW.tenant_id AND t.status = 'ACTIVE') THEN
    RAISE EXCEPTION 'La tienda % no está activa: no puede recibir pedidos', NEW.tenant_id
      USING ERRCODE = 'check_violation';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM users u
                 WHERE u.id = NEW.user_id
                   AND u.phone IS NOT NULL AND btrim(u.phone) <> '') THEN
    RAISE EXCEPTION 'El comprador debe registrar un teléfono antes de hacer un pedido'
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER orders_check_new_order
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION check_new_order();

-- 4. Un producto solo se PUBLICA en una tienda ACTIVE. En PENDING el dueño
--    puede preparar borradores (DRAFT). Solo se revisa al publicar (o al
--    crear ya publicado): editar precio o variantes de lo ya publicado no
--    se bloquea.
CREATE FUNCTION require_active_tenant_to_publish() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.status = 'PUBLISHED'
     AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'PUBLISHED')
     AND NOT EXISTS (SELECT 1 FROM tenants t
                     WHERE t.id = NEW.tenant_id AND t.status = 'ACTIVE') THEN
    RAISE EXCEPTION 'La tienda % no está activa: no puede publicar productos', NEW.tenant_id
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER products_tenant_must_be_active_to_publish
  BEFORE INSERT OR UPDATE OF status ON products
  FOR EACH ROW EXECUTE FUNCTION require_active_tenant_to_publish();

-- 5. Los productos de un pedido son de la tienda del pedido.
--    (Como las tablas hijas ya no llevan tenant_id, esto lo valida un trigger.)
CREATE FUNCTION order_items_same_tenant() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF NOT EXISTS (SELECT 1
                 FROM orders o
                 JOIN products p ON p.tenant_id = o.tenant_id
                 WHERE o.id = NEW.order_id AND p.id = NEW.product_id) THEN
    RAISE EXCEPTION 'El producto % no pertenece a la tienda del pedido %',
      NEW.product_id, NEW.order_id
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER order_items_same_tenant_chk
  BEFORE INSERT OR UPDATE OF order_id, product_id ON order_items
  FOR EACH ROW EXECUTE FUNCTION order_items_same_tenant();

-- 6. Todo producto tiene al menos una variante. La revisión es DIFERIDA
--    (al COMMIT), así se puede crear el producto y luego sus variantes en
--    la misma transacción. Borrar un producto entero sí se permite.
CREATE FUNCTION ensure_product_has_variant() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
  pid text;
BEGIN
  IF TG_TABLE_NAME = 'products' THEN
    pid := NEW.id;
  ELSE
    pid := OLD.product_id;
  END IF;

  IF EXISTS (SELECT 1 FROM products WHERE id = pid)
     AND NOT EXISTS (SELECT 1 FROM product_variants WHERE product_id = pid) THEN
    RAISE EXCEPTION 'El producto % debe tener al menos una variante', pid
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NULL;
END;
$$;

CREATE CONSTRAINT TRIGGER products_must_have_variant
  AFTER INSERT ON products
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW EXECUTE FUNCTION ensure_product_has_variant();

CREATE CONSTRAINT TRIGGER variants_keep_at_least_one
  AFTER DELETE OR UPDATE OF product_id ON product_variants
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW EXECUTE FUNCTION ensure_product_has_variant();


-- ---------------------------------------------------------------------
-- Datos de ejemplo (puedes borrar todo este bloque)
-- ---------------------------------------------------------------------
-- Sin contraseñas: el backend las define y activa las cuentas.
INSERT INTO platform_admins (id, name, email, status)
VALUES ('platform-root', 'Administrador de la plataforma', 'admin@ecommerce.com', 'INACTIVE');

-- El estudiante 2 tiene teléfono: sin él no podría hacer pedidos.
INSERT INTO users (id, name, email, phone, status) VALUES
  ('seed-user-1', 'Estudiante Ejemplo Uno', 'estudiante1@uao.edu.co', '3000000001', 'INACTIVE'),
  ('seed-user-2', 'Estudiante Ejemplo Dos', 'estudiante2@uao.edu.co', '3000000002', 'INACTIVE');

-- Categorías globales (las administra el admin).
INSERT INTO categories (slug, name) VALUES
  ('ropa', 'Ropa'),
  ('accesorios', 'Accesorios'),
  ('snacks', 'Snacks y dulces'),
  ('libros', 'Libros y apuntes');

-- Tienda 1 aprobada; tienda 2 esperando revisión.
INSERT INTO tenants (id, owner_id, name, description, category_slug, slug, status, reviewed_by_id, reviewed_at) VALUES
  (1, 'seed-user-1', 'Variedades Los Primos', 'Venta de ropa y accesorios con el logo de la UAO, hechos por estudiantes.', 'ropa', 'variedades', 'ACTIVE', 'platform-root', now());
INSERT INTO tenants (id, owner_id, name, description, category_slug, slug, status) VALUES
  (2, 'seed-user-2', 'Primos', 'Venta de snacks y dulces en el campus.', 'snacks', 'primos', 'PENDING');

-- Las columnas identity se deben reajustar tras insertar ids a mano.
SELECT setval(pg_get_serial_sequence('tenants', 'id'), (SELECT max(id) FROM tenants));

INSERT INTO products (id, tenant_id, slug, name, description, condition, price, category_slug) VALUES
  ('seed-product-1', 1, 'camiseta-uao', 'Camiseta UAO', 'Camiseta de ejemplo', 'NEW', 40000.00, 'ropa');

INSERT INTO product_variants (id, product_id, name, stock, sort_order) VALUES
  ('seed-variant-s', 'seed-product-1', 'S', 3, 0),
  ('seed-variant-m', 'seed-product-1', 'M', 4, 1);

-- Pedido de ejemplo: el estudiante 2 (dueño de la tienda 2, aún PENDING)
-- le compra a la tienda 1 y recoge en el campus. Un dueño sí puede comprar
-- en tiendas ajenas; lo que no puede es comprar en la suya.
INSERT INTO orders (id, tenant_id, code, user_id, status, payment_method, paid_at, reference, total)
VALUES ('seed-order-1', 1, 'VLP-10001', 'seed-user-2', 'PACKING', 'NEQUI', now(),
        'Cafetería, bloque principal', 40000.00);

INSERT INTO order_items (id, order_id, product_id, variant_id, name, variant_name, unit_price, qty)
VALUES ('seed-item-1', 'seed-order-1', 'seed-product-1', 'seed-variant-s', 'Camiseta UAO', 'S', 40000.00, 1);

COMMIT;


-- Comprobar el resultado.
SELECT id, name, slug, status FROM tenants ORDER BY id;
SELECT * FROM product_stats;
