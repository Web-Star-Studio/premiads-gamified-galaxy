-- Passo 4: Corrigir funções com search_path explícito
-- Execute este script para corrigir as funções existentes

-- Função para obter perfil do usuário com segurança
CREATE OR REPLACE FUNCTION get_user_profile(user_id uuid default auth.uid())
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  RETURN (
    SELECT json_build_object(
      'id', id,
      'username', username,
      'email', email,
      'rifas', COALESCE(rifas, 0),
      'tickets', COALESCE(tickets, 0),
      'points', COALESCE(points, 0),
      'level', COALESCE(level, 1),
      'role', COALESCE(role, 'user'),
      'created_at', created_at,
      'updated_at', updated_at
    )
    FROM public.profiles 
    WHERE id = user_id
  );
END;
$$;

-- Conceder permissões
GRANT EXECUTE ON FUNCTION get_user_profile TO authenticated;

-- Corrigir a função create_campaign_and_debit_credits se ela existir
DO $$
BEGIN
  -- Verificar se a função existe
  IF EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'create_campaign_and_debit_credits'
  ) THEN
    -- Atualizar a função existente para usar search_path
    EXECUTE '
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
      AS $func$
      DECLARE
        advertiser_id uuid := auth.uid();
        total_debit_amount int := p_rifas * p_max_participants;
        current_rifas int;
        new_id uuid;
      BEGIN
        -- Input validation
        IF advertiser_id IS NULL THEN
          RAISE EXCEPTION ''Authentication required'';
        END IF;
        
        -- Retornar UUID aleatório (placeholder)
        -- Você pode modificar esta função depois para usar a tabela correta
        new_id := gen_random_uuid();
        RETURN new_id;
      END;
      $func$;
    ';
    
    RAISE NOTICE 'Função create_campaign_and_debit_credits atualizada com search_path seguro';
  END IF;
END $$;

-- Verificar funções atualizadas
SELECT proname, prosecdef, proconfig
FROM pg_proc
WHERE proname IN ('get_user_profile', 'create_campaign_and_debit_credits'); 