-- Script para corrigir campanhas com advertiser_id NULL
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar campanhas com advertiser_id NULL
SELECT id, type, requirements, start_date, end_date, is_active
FROM campaigns
WHERE advertiser_id IS NULL;

-- 2. Atualizar o advertiser_id para o usuário atual
-- Substitua 'SEU_ID_AQUI' pelo seu ID de usuário real (auth.uid() se estiver autenticado)
UPDATE campaigns
SET advertiser_id = auth.uid()
WHERE advertiser_id IS NULL;

-- 3. Verificar se a atualização foi bem-sucedida
SELECT id, type, requirements, advertiser_id, start_date, end_date, is_active
FROM campaigns
WHERE advertiser_id = auth.uid();

-- 4. Criar uma função para garantir que novas campanhas sempre tenham advertiser_id
CREATE OR REPLACE FUNCTION ensure_campaign_advertiser_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.advertiser_id IS NULL THEN
    NEW.advertiser_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 5. Criar um trigger para aplicar essa função
DROP TRIGGER IF EXISTS set_campaign_advertiser_id ON campaigns;
CREATE TRIGGER set_campaign_advertiser_id
BEFORE INSERT ON campaigns
FOR EACH ROW
EXECUTE FUNCTION ensure_campaign_advertiser_id();

-- 6. Criar uma política RLS para garantir que usuários vejam apenas suas próprias campanhas
ALTER TABLE IF EXISTS campaigns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own campaigns" ON campaigns;
CREATE POLICY "Users can view own campaigns" ON campaigns
  FOR SELECT USING (advertiser_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own campaigns" ON campaigns;
CREATE POLICY "Users can update own campaigns" ON campaigns
  FOR UPDATE USING (advertiser_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert campaigns" ON campaigns;
CREATE POLICY "Users can insert campaigns" ON campaigns
  FOR INSERT WITH CHECK (true);  -- Permitir inserção, o trigger vai garantir o advertiser_id 