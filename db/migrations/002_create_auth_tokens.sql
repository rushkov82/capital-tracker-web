CREATE TABLE IF NOT EXISTS auth_tokens (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email_confirm', 'password_reset')),
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_auth_tokens_user_id ON auth_tokens (user_id);
CREATE INDEX IF NOT EXISTS idx_auth_tokens_type ON auth_tokens (type);
CREATE INDEX IF NOT EXISTS idx_auth_tokens_expires_at ON auth_tokens (expires_at);
