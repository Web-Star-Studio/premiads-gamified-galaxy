-- Script completo para corrigir problemas com campanhas
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar a estrutura atual da tabela campaigns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'campaigns' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Verificar campanhas com advertiser_id NULL
SELECT id, title, type, requirements, start_date, end_date, is_active
FROM campaigns
WHERE advertiser_id IS NULL;

-- 3. Atualizar o advertiser_id para o usuário atual
DO $$
BEGIN
  -- Atualizar todas as campanhas sem advertiser_id para o usuário atual
  UPDATE campaigns
  SET advertiser_id = auth.uid(),
      updated_at = now()
  WHERE advertiser_id IS NULL;
  
  RAISE NOTICE 'Campanhas atualizadas com advertiser_id = %', auth.uid();
END $$;

-- 4. Verificar se a atualização foi bem-sucedida
SELECT id, title, advertiser_id, start_date, end_date, is_active
FROM campaigns
WHERE advertiser_id = auth.uid();

-- 5. Criar uma função para garantir que novas campanhas sempre tenham advertiser_id
CREATE OR REPLACE FUNCTION ensure_campaign_advertiser_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.advertiser_id IS NULL THEN
    NEW.advertiser_id := auth.uid();
    
    -- Registrar em log para debug
    RAISE NOTICE 'Trigger definiu advertiser_id = % para campanha', NEW.advertiser_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 6. Criar um trigger para aplicar essa função
DROP TRIGGER IF EXISTS set_campaign_advertiser_id ON campaigns;
CREATE TRIGGER set_campaign_advertiser_id
BEFORE INSERT ON campaigns
FOR EACH ROW
EXECUTE FUNCTION ensure_campaign_advertiser_id();

-- 7. Corrigir a função de criação de campanhas
CREATE OR REPLACE FUNCTION create_campaign_and_debit_credits(
  p_title text,
  p_description text,
  p_type text,
  p_audience text,
  p_requirements jsonb,
  p_start_date timestamptz,
  p_end_date timestamptz,
  p_has_badges boolean,
  p_has_lootbox boolean,
  p_streak_bonus boolean,
  p_streak_multiplier numeric,
  p_random_points boolean,
  p_points_range int[],
  p_rifas int,
  p_tickets_reward int,
  p_cashback_reward numeric,
  p_max_participants int,
  p_cashback_amount_per_raffle numeric,
  p_target_filter jsonb,
  p_badge_image_url text,
  p_min_purchase numeric,
  p_selected_loot_box_rewards text[],
  p_form_schema jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  advertiser_id uuid := auth.uid();
  total_debit_amount int := p_rifas * p_max_participants;
  current_rifas int;
  new_campaign_id uuid;
BEGIN
  -- Input validation
  IF advertiser_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  IF p_title IS NULL OR trim(p_title) = '' THEN
    RAISE EXCEPTION 'Campaign title is required';
  END IF;
  
  IF p_rifas <= 0 OR p_max_participants <= 0 THEN
    RAISE EXCEPTION 'Invalid rifas or participants count';
  END IF;

  -- Check rifas balance
  SELECT rifas INTO current_rifas FROM public.profiles
  WHERE id = advertiser_id;

  IF current_rifas IS NULL OR current_rifas < total_debit_amount THEN
    RAISE EXCEPTION 'Insufficient rifas balance. Required: %, Available: %', 
      total_debit_amount, COALESCE(current_rifas, 0);
  END IF;

  -- Debit rifas
  UPDATE public.profiles
  SET rifas = rifas - total_debit_amount,
      updated_at = now()
  WHERE id = advertiser_id;

  -- Criar campanha com advertiser_id explícito
  INSERT INTO public.campaigns (
    advertiser_id, -- CAMPO EXPLÍCITO
    title, description, type, target_audience, requirements,
    start_date, end_date, has_badges, has_lootbox,
    streak_bonus, streak_multiplier, random_points, points_range,
    rifas_per_participant, tickets_reward, cashback_reward, max_participants,
    cashback_per_raffle, target_filter, badge_image_url,
    min_purchase, lootbox_rewards, form_schema,
    status, created_at, updated_at
  )
  VALUES (
    advertiser_id, -- VALOR EXPLÍCITO
    p_title, p_description, p_type, p_audience, p_requirements,
    p_start_date, p_end_date, p_has_badges, p_has_lootbox,
    p_streak_bonus, p_streak_multiplier, p_random_points, p_points_range,
    p_rifas, p_tickets_reward, p_cashback_reward, p_max_participants,
    p_cashback_amount_per_raffle, p_target_filter, p_badge_image_url,
    p_min_purchase, p_selected_loot_box_rewards, p_form_schema,
    'active', now(), now() -- Status ACTIVE para aparecer na interface
  ) RETURNING id INTO new_campaign_id;

  -- Log para debug
  RAISE NOTICE 'Campanha criada com ID % e advertiser_id %', new_campaign_id, advertiser_id;

  RETURN new_campaign_id;
END;
$$;

-- 8. Conceder permissões
GRANT EXECUTE ON FUNCTION create_campaign_and_debit_credits TO authenticated;

-- 9. Configurar políticas RLS para campanhas
ALTER TABLE IF EXISTS campaigns ENABLE ROW LEVEL SECURITY;

-- Política para visualizar campanhas próprias
DROP POLICY IF EXISTS "Users can view own campaigns" ON campaigns;
CREATE POLICY "Users can view own campaigns" ON campaigns
  FOR SELECT USING (advertiser_id = auth.uid());

-- Política para atualizar campanhas próprias
DROP POLICY IF EXISTS "Users can update own campaigns" ON campaigns;
CREATE POLICY "Users can update own campaigns" ON campaigns
  FOR UPDATE USING (advertiser_id = auth.uid());

-- Política para inserir campanhas
DROP POLICY IF EXISTS "Users can insert campaigns" ON campaigns;
CREATE POLICY "Users can insert campaigns" ON campaigns
  FOR INSERT WITH CHECK (advertiser_id = auth.uid() OR advertiser_id IS NULL);

-- 10. Verificar resultado final
SELECT '✅ Correções de campanhas aplicadas com sucesso!' AS resultado; 