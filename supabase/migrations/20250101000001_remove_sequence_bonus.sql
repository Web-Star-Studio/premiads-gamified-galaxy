-- Migration to remove sequence bonus functionality
-- Remove sequence bonus functionality from missions and related tables

-- 1. Drop daily_streaks table as it's only used for sequence bonus
DROP TABLE IF EXISTS daily_streaks CASCADE;

-- 2. Remove sequence_bonus and streak_multiplier columns from missions table
ALTER TABLE missions 
  DROP COLUMN IF EXISTS sequence_bonus,
  DROP COLUMN IF EXISTS streak_multiplier;

-- 3. Update create_campaign_atomic function to remove sequence bonus parameters
CREATE OR REPLACE FUNCTION create_campaign_atomic(
  p_title text,
  p_description text,
  p_type text,
  p_target_audience text,
  p_requirements text,
  p_end_date timestamptz,
  p_rifas integer,
  p_tickets_reward integer,
  p_cashback_reward numeric,
  p_max_participants integer
)
RETURNS uuid AS $$
DECLARE
  advertiser_id uuid := auth.uid();
  total_debit_amount integer := p_rifas * p_max_participants;
  current_rifas integer;
  new_campaign_id uuid;
BEGIN
  -- 1. Check if advertiser has enough rifas
  SELECT rifas INTO current_rifas FROM public.profiles
  WHERE id = advertiser_id;

  IF current_rifas IS NULL OR current_rifas < total_debit_amount THEN
    RAISE EXCEPTION 'insufficient rifas balance';
  END IF;

  -- 2. Debit the rifas from the advertiser's profile
  UPDATE public.profiles
  SET rifas = rifas - total_debit_amount
  WHERE id = advertiser_id;

  -- 3. Insert the new mission (without sequence_bonus and streak_multiplier)
  INSERT INTO public.missions (
    title, description, type, target_audience, requirements,
    tickets_reward, cashback_reward, created_by, status, expires_at
  )
  VALUES (
    p_title, p_description, p_type, p_target_audience, p_requirements,
    p_tickets_reward, p_cashback_reward, advertiser_id, 'ativa', p_end_date
  ) RETURNING id INTO new_campaign_id;

  RETURN new_campaign_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Update process_mission_rewards function to remove sequence bonus logic
CREATE OR REPLACE FUNCTION process_mission_rewards(
  p_submission_id text,
  p_user_id text,
  p_mission_id text
)
RETURNS json AS $$
DECLARE
  v_mission RECORD;
  v_points NUMERIC := 0;
  v_has_badge BOOLEAN := FALSE;
  v_has_lootbox BOOLEAN := FALSE;
  v_reward_data JSONB := '{}'::jsonb;
BEGIN
  RAISE NOTICE 'Starting process_mission_rewards for submission %, user %, mission %', 
               p_submission_id, p_user_id, p_mission_id;

  -- Get mission details (without sequence_bonus fields)
  SELECT 
    title,
    rifas,
    has_badge,
    has_lootbox,
    badge_image_url,
    selected_lootbox_rewards
  INTO v_mission
  FROM missions
  WHERE id = p_mission_id::uuid;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Mission not found: %', p_mission_id;
  END IF;

  RAISE NOTICE 'Mission found: title=%, has_badge=%, has_lootbox=%', 
               v_mission.title, v_mission.has_badge, v_mission.has_lootbox;

  v_points := v_mission.rifas;
  v_has_badge := v_mission.has_badge;
  v_has_lootbox := v_mission.has_lootbox;

  -- Add points to user
  UPDATE profiles 
  SET rifas = rifas + v_points
  WHERE id = p_user_id::uuid;

  -- Build reward data (without streak_bonus)
  v_reward_data := jsonb_build_object(
    'points', v_points,
    'has_badge', v_has_badge,
    'has_lootbox', v_has_lootbox,
    'badge_image_url', v_mission.badge_image_url,
    'selected_lootbox_rewards', v_mission.selected_lootbox_rewards
  );

  -- Award badge if mission has badge
  IF v_has_badge THEN
    INSERT INTO user_badges (
      user_id, mission_id, badge_name, badge_image_url
    ) VALUES (
      p_user_id::uuid, p_mission_id::uuid, 
      v_mission.title || ' Badge', v_mission.badge_image_url
    );
  END IF;

  RAISE NOTICE 'Rewards processed successfully. Points: %, Badge: %, LootBox: %', 
               v_points, v_has_badge, v_has_lootbox;

  RETURN v_reward_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 