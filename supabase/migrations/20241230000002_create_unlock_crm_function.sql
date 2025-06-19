-- Migration para criar função de desbloqueio de dados do CRM

CREATE OR REPLACE FUNCTION unlock_crm_mission_details(
  p_advertiser_id UUID,
  p_mission_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  advertiser_rifas INTEGER;
  required_rifas INTEGER := 2;
  unlock_record RECORD;
BEGIN
  -- Verificar se o usuário é realmente um anunciante
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = p_advertiser_id 
    AND user_type = 'anunciante'
  ) THEN
    RAISE EXCEPTION 'Apenas anunciantes podem desbloquear dados de CRM';
  END IF;

  -- Verificar se a missão pertence ao anunciante
  IF NOT EXISTS (
    SELECT 1 FROM missions 
    WHERE id = p_mission_id 
    AND advertiser_id = p_advertiser_id
  ) THEN
    RAISE EXCEPTION 'Missão não encontrada ou não pertence ao anunciante';
  END IF;

  -- Verificar se os dados já foram desbloqueados
  SELECT * INTO unlock_record
  FROM advertiser_crm_unlocks
  WHERE advertiser_id = p_advertiser_id 
  AND mission_id = p_mission_id;

  IF FOUND THEN
    RETURN json_build_object(
      'success', true,
      'message', 'Dados já foram desbloqueados anteriormente',
      'already_unlocked', true
    );
  END IF;

  -- Verificar rifas disponíveis
  SELECT rifas INTO advertiser_rifas
  FROM profiles
  WHERE id = p_advertiser_id;

  IF advertiser_rifas IS NULL OR advertiser_rifas < required_rifas THEN
    RAISE EXCEPTION 'Anunciante não possui rifas suficientes. Necessário: %, Disponível: %', 
      required_rifas, COALESCE(advertiser_rifas, 0);
  END IF;

  -- Debitar rifas do anunciante
  UPDATE profiles
  SET rifas = rifas - required_rifas,
      updated_at = NOW()
  WHERE id = p_advertiser_id;

  -- Registrar desbloqueio
  INSERT INTO advertiser_crm_unlocks (
    advertiser_id,
    mission_id,
    rifas_cost
  ) VALUES (
    p_advertiser_id,
    p_mission_id,
    required_rifas
  );

  -- Registrar transação de débito de rifas
  INSERT INTO transactions (
    user_id,
    type,
    amount,
    description,
    created_at
  ) VALUES (
    p_advertiser_id,
    'debit',
    required_rifas,
    'Desbloqueio de dados CRM - Missão: ' || p_mission_id,
    NOW()
  );

  RETURN json_build_object(
    'success', true,
    'message', 'Dados desbloqueados com sucesso',
    'rifas_debited', required_rifas,
    'already_unlocked', false
  );

EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION '%', SQLERRM;
END;
$$; 