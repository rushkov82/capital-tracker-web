ALTER TABLE plan_settings
ADD COLUMN IF NOT EXISTS bonds_share numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS bonds_return numeric DEFAULT 8,
ADD COLUMN IF NOT EXISTS deposits_share numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS deposits_return numeric DEFAULT 8,
ADD COLUMN IF NOT EXISTS crypto_share numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS crypto_return numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS other_share numeric DEFAULT 0;

UPDATE plan_settings
SET
  bonds_return = COALESCE(bonds_return, 8),
  deposits_return = COALESCE(deposits_return, 8),
  crypto_return = COALESCE(crypto_return, 0),
  other_share = GREATEST(
    0,
    100
    - COALESCE(stocks_bonds_share, 0)
    - COALESCE(rub_cash_share, 0)
    - COALESCE(metals_share, 0)
    - COALESCE(real_estate_share, 0)
    - COALESCE(currency_share, 0)
  )
WHERE
  bonds_return IS NULL
  OR deposits_return IS NULL
  OR crypto_return IS NULL
  OR other_share IS NULL
  OR other_share = 0;