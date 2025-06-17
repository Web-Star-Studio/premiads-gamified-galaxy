-- Versão mínima para corrigir problemas de segurança
-- Executar em partes para identificar o erro

-- Parte 1: Verificar tabelas existentes
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Parte 2: Habilitar RLS nas tabelas existentes 
-- (executar após verificar quais tabelas existem)
/*
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.mission_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_cashbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.mission_validation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.mission_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cashback_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cashback_redemptions ENABLE ROW LEVEL SECURITY;
*/

-- Parte 3: Corrigir função existente para usar search_path
-- (executar após verificar se a função existe)
/*
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
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  advertiser_id uuid := auth.uid();
  total_debit_amount int := p_rifas * p_max_participants;
  current_rifas int;
  new_mission_id uuid;
begin
  -- Input validation
  if advertiser_id is null then
    raise exception 'Authentication required';
  end if;
  
  -- Criar missão na tabela missions
  insert into public.missions (
    title, description, type, target_audience, requirements,
    tickets_reward, cashback_reward, created_by,
    status, expires_at, created_at, updated_at
  )
  values (
    p_title, p_description, p_type, p_audience, p_requirements,
    p_tickets_reward, p_cashback_reward, advertiser_id,
    'pendente', p_end_date, now(), now()
  ) returning id into new_mission_id;

  return new_mission_id;
end;
$$;
*/

-- Parte 4: Criar função segura para obter perfil do usuário
/*
CREATE OR REPLACE FUNCTION get_user_profile(user_id uuid default auth.uid())
returns json
language plpgsql
security definer
set search_path = public
as $$
begin
  if user_id is null then
    raise exception 'Authentication required';
  end if;
  
  return (
    select json_build_object(
      'id', id,
      'username', username,
      'email', email,
      'rifas', rifas,
      'tickets', tickets,
      'points', points,
      'level', level,
      'role', role,
      'created_at', created_at,
      'updated_at', updated_at
    )
    from public.profiles 
    where id = user_id
  );
end;
$$;

GRANT EXECUTE ON FUNCTION get_user_profile TO authenticated;
*/ 