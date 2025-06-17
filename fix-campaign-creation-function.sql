-- Script para corrigir a função de criação de campanhas
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar a definição atual da função
SELECT prosrc 
FROM pg_proc 
WHERE proname = 'create_campaign_and_debit_credits';

-- 2. Corrigir a função para garantir que o advertiser_id seja definido corretamente
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

  -- Create campaign - GARANTIR QUE advertiser_id SEJA INCLUÍDO
  INSERT INTO public.campaigns (
    advertiser_id, -- EXPLICITAMENTE INCLUIR ESTE CAMPO
    title, description, type, target_audience, requirements,
    start_date, end_date, has_badges, has_lootbox,
    streak_bonus, streak_multiplier, random_points, points_range,
    rifas_per_participant, tickets_reward, cashback_reward, max_participants,
    cashback_per_raffle, target_filter, badge_image_url,
    min_purchase, lootbox_rewards, form_schema,
    status, created_at, updated_at
  )
  VALUES (
    advertiser_id, -- EXPLICITAMENTE INCLUIR ESTE VALOR
    p_title, p_description, p_type, p_audience, p_requirements,
    p_start_date, p_end_date, p_has_badges, p_has_lootbox,
    p_streak_bonus, p_streak_multiplier, p_random_points, p_points_range,
    p_rifas, p_tickets_reward, p_cashback_reward, p_max_participants,
    p_cashback_amount_per_raffle, p_target_filter, p_badge_image_url,
    p_min_purchase, p_selected_loot_box_rewards, p_form_schema,
    'draft', now(), now()
  ) RETURNING id INTO new_campaign_id;

  RETURN new_campaign_id;
END;
$$;

-- 3. Conceder permissões
GRANT EXECUTE ON FUNCTION create_campaign_and_debit_credits TO authenticated; 