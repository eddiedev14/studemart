-- Apply after the base schema. Compatible with users/platform_admins in both schemas.
BEGIN;

CREATE TABLE IF NOT EXISTS auth_sessions (
  id text PRIMARY KEY,
  account_id text NOT NULL,
  account_type text NOT NULL CHECK (account_type IN ('user', 'admin')),
  expires_at timestamptz(3) NOT NULL,
  revoked_at timestamptz(3),
  created_at timestamptz(3) NOT NULL DEFAULT now(),
  CONSTRAINT auth_sessions_expiry_chk CHECK (expires_at > created_at)
);

-- No FK: account_id belongs to users OR platform_admins; auth rechecks it per request.
CREATE INDEX IF NOT EXISTS auth_sessions_account_idx
  ON auth_sessions (account_type, account_id);
CREATE INDEX IF NOT EXISTS auth_sessions_expiry_idx ON auth_sessions (expires_at);

COMMIT;
