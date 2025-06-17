-- Migração para corrigir missões sem advertiser_id
-- Esta migração garante que todas as missões tenham um advertiser_id válido

-- 1. Adicionar coluna advertiser_id se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'missions'
      AND column_name = 'advertiser_id'
  ) THEN
    ALTER TABLE missions ADD COLUMN advertiser_id UUID REFERENCES auth.users(id);
  END IF;
END
$$;

-- 2. Atualizar missões sem advertiser_id usando o campo created_by
UPDATE missions
SET advertiser_id = created_by
WHERE advertiser_id IS NULL AND created_by IS NOT NULL;

-- 3. Criar um índice para melhorar a performance de consultas por advertiser_id
CREATE INDEX IF NOT EXISTS idx_missions_advertiser_id ON missions(advertiser_id);

-- 4. Adicionar uma trigger para garantir que novas missões sempre tenham advertiser_id
CREATE OR REPLACE FUNCTION ensure_mission_advertiser_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.advertiser_id IS NULL THEN
    NEW.advertiser_id := NEW.created_by;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ensure_mission_advertiser_id ON missions;
CREATE TRIGGER trg_ensure_mission_advertiser_id
BEFORE INSERT OR UPDATE ON missions
FOR EACH ROW
EXECUTE FUNCTION ensure_mission_advertiser_id();

-- 5. Atualizar a política RLS para permitir que anunciantes vejam suas próprias missões
DROP POLICY IF EXISTS "Anunciantes can view their own missions" ON missions;
CREATE POLICY "Anunciantes can view their own missions" ON missions
FOR SELECT
USING (
  auth.uid() = advertiser_id OR
  auth.uid() = created_by
);

-- 6. Garantir que a política de modificação de missões também use advertiser_id
DROP POLICY IF EXISTS "Anunciantes can modify their own missions" ON missions;
CREATE POLICY "Anunciantes can modify their own missions" ON missions
FOR ALL
USING (
  auth.uid() = advertiser_id OR
  auth.uid() = created_by
);

-- 7. Log da operação
INSERT INTO migration_logs (migration_name, executed_at, details)
VALUES (
  '20240601000000_fix_mission_advertiser_id',
  NOW(),
  'Fixed missions without advertiser_id and added protection mechanisms'
)
ON CONFLICT (migration_name) DO NOTHING; 