-- Migração para implementar sistema de desbloqueio por participante
-- Arquivo: 20250119000000_participant_unlock_system.sql

-- 1. Criar tabela para rastrear desbloqueios por participante individual
CREATE TABLE IF NOT EXISTS advertiser_participant_unlocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advertiser_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  rifas_cost INTEGER DEFAULT 2,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Unique constraint para evitar desbloqueios duplicados
  UNIQUE(advertiser_id, participant_id, mission_id)
);

-- 2. Adicionar índices para performance
CREATE INDEX IF NOT EXISTS idx_advertiser_participant_unlocks_advertiser 
  ON advertiser_participant_unlocks(advertiser_id);
CREATE INDEX IF NOT EXISTS idx_advertiser_participant_unlocks_participant 
  ON advertiser_participant_unlocks(participant_id);
CREATE INDEX IF NOT EXISTS idx_advertiser_participant_unlocks_mission 
  ON advertiser_participant_unlocks(mission_id);

-- 3. Habilitar RLS
ALTER TABLE advertiser_participant_unlocks ENABLE ROW LEVEL SECURITY;

-- 4. Políticas RLS
-- Anunciantes podem ver apenas suas próprias liberações
CREATE POLICY "advertiser_participant_unlocks_select_own" ON advertiser_participant_unlocks
  FOR SELECT USING (advertiser_id = auth.uid());

-- Anunciantes podem inserir liberações apenas para si mesmos
CREATE POLICY "advertiser_participant_unlocks_insert_own" ON advertiser_participant_unlocks
  FOR INSERT WITH CHECK (advertiser_id = auth.uid());

-- 5. Função para debitar rifas e registrar desbloqueio por participante
CREATE OR REPLACE FUNCTION unlock_participant_demographics(
  p_advertiser_id UUID,
  p_participant_id UUID,
  p_mission_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_rifas INTEGER;
  v_required_rifas INTEGER := 2;
  v_unlock_exists BOOLEAN := FALSE;
  v_result JSON;
BEGIN
  -- Verificar se já existe desbloqueio para este participante
  SELECT EXISTS(
    SELECT 1 FROM advertiser_participant_unlocks 
    WHERE advertiser_id = p_advertiser_id 
    AND participant_id = p_participant_id 
    AND mission_id = p_mission_id
  ) INTO v_unlock_exists;
  
  IF v_unlock_exists THEN
    RETURN json_build_object(
      'success', true,
      'message', 'Participante já desbloqueado anteriormente',
      'already_unlocked', true
    );
  END IF;
  
  -- Verificar saldo de rifas do anunciante
  SELECT rifas INTO v_current_rifas
  FROM advertiser_profiles
  WHERE user_id = p_advertiser_id;
  
  IF v_current_rifas IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Perfil do anunciante não encontrado'
    );
  END IF;
  
  IF v_current_rifas < v_required_rifas THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Saldo insuficiente de rifas'
    );
  END IF;
  
  -- Debitar rifas
  UPDATE advertiser_profiles 
  SET rifas = rifas - v_required_rifas
  WHERE user_id = p_advertiser_id;
  
  -- Registrar transação de rifas
  INSERT INTO rifas_transactions (
    user_id,
    mission_id,
    transaction_type,
    amount,
    description
  ) VALUES (
    p_advertiser_id,
    p_mission_id,
    'spent',
    v_required_rifas,
    'Desbloqueio de dados demográficos do participante ' || p_participant_id
  );
  
  -- Registrar desbloqueio
  INSERT INTO advertiser_participant_unlocks (
    advertiser_id,
    participant_id,
    mission_id,
    rifas_cost
  ) VALUES (
    p_advertiser_id,
    p_participant_id,
    p_mission_id,
    v_required_rifas
  );
  
  RETURN json_build_object(
    'success', true,
    'message', 'Dados do participante desbloqueados com sucesso',
    'rifas_debited', v_required_rifas,
    'already_unlocked', false
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Erro interno: ' || SQLERRM
    );
END;
$$;

-- 6. Função para verificar se um participante foi desbloqueado
CREATE OR REPLACE FUNCTION check_participant_unlocked(
  p_advertiser_id UUID,
  p_participant_id UUID,
  p_mission_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM advertiser_participant_unlocks 
    WHERE advertiser_id = p_advertiser_id 
    AND participant_id = p_participant_id 
    AND mission_id = p_mission_id
  );
END;
$$;

-- 7. View para facilitar consultas de desbloqueios
CREATE OR REPLACE VIEW advertiser_unlocks_summary AS
SELECT 
  apu.advertiser_id,
  apu.mission_id,
  m.title as mission_title,
  COUNT(apu.participant_id) as participants_unlocked,
  SUM(apu.rifas_cost) as total_rifas_spent,
  MIN(apu.unlocked_at) as first_unlock_at,
  MAX(apu.unlocked_at) as last_unlock_at
FROM advertiser_participant_unlocks apu
JOIN missions m ON m.id = apu.mission_id
GROUP BY apu.advertiser_id, apu.mission_id, m.title;

-- 8. Comentários para documentação
COMMENT ON TABLE advertiser_participant_unlocks IS 'Registra desbloqueios de dados demográficos por participante individual';
COMMENT ON FUNCTION unlock_participant_demographics IS 'Função para debitar rifas e registrar desbloqueio de dados demográficos de um participante específico';
COMMENT ON FUNCTION check_participant_unlocked IS 'Verifica se um participante específico foi desbloqueado por um anunciante';
COMMENT ON VIEW advertiser_unlocks_summary IS 'Resumo dos desbloqueios por missão para facilitar análises'; 