-- Migration para criar sistema de desbloqueio de dados do CRM

-- Tabela para controlar quais dados de campanha foram desbloqueados
CREATE TABLE IF NOT EXISTS advertiser_crm_unlocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  advertiser_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  rifas_cost INTEGER DEFAULT 2, -- Custo em rifas para desbloquear
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(advertiser_id, mission_id)
);

-- Índices para performance
CREATE INDEX idx_advertiser_crm_unlocks_advertiser_id ON advertiser_crm_unlocks(advertiser_id);
CREATE INDEX idx_advertiser_crm_unlocks_mission_id ON advertiser_crm_unlocks(mission_id);

-- RLS para advertiser_crm_unlocks
ALTER TABLE advertiser_crm_unlocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own CRM unlocks" ON advertiser_crm_unlocks
FOR SELECT USING (advertiser_id = auth.uid());

CREATE POLICY "Users can insert their own CRM unlocks" ON advertiser_crm_unlocks
FOR INSERT WITH CHECK (advertiser_id = auth.uid()); 