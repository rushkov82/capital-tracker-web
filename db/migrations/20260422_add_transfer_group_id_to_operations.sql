ALTER TABLE operations
ADD COLUMN IF NOT EXISTS transfer_group_id TEXT;

CREATE INDEX IF NOT EXISTS idx_operations_transfer_group_id
ON operations (transfer_group_id);
