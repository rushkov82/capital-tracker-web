ALTER TABLE operations
ADD COLUMN IF NOT EXISTS user_id BIGINT;

UPDATE operations
SET user_id = 1
WHERE user_id IS NULL;

ALTER TABLE operations
ALTER COLUMN user_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_operations_user_id ON operations (user_id);
CREATE INDEX IF NOT EXISTS idx_operations_user_date ON operations (user_id, operation_date DESC, created_at DESC);
