-- Migração para Sistema de Referências PremiAds
-- Para ser aplicada quando o Supabase sair do modo read-only

-- Tabela principal de códigos de referência
CREATE TABLE IF NOT EXISTS referencias (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    codigo TEXT UNIQUE NOT NULL,
    participante_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de indicações realizadas
CREATE TABLE IF NOT EXISTS indicacoes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    referencia_id UUID NOT NULL REFERENCES referencias(id) ON DELETE CASCADE,
    convidado_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('pendente', 'completo')) DEFAULT 'pendente',
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de recompensas por indicação
CREATE TABLE IF NOT EXISTS recompensas_indicacao (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    referencia_id UUID NOT NULL REFERENCES referencias(id) ON DELETE CASCADE,
    tipo TEXT CHECK (tipo IN ('bonus_3_amigos', 'bonus_5_amigos', 'bilhetes_extras')) NOT NULL,
    valor INTEGER NOT NULL DEFAULT 0,
    status TEXT CHECK (status IN ('disponivel', 'resgatado')) DEFAULT 'disponivel',
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_referencias_participante ON referencias(participante_id);
CREATE INDEX IF NOT EXISTS idx_referencias_codigo ON referencias(codigo);
CREATE INDEX IF NOT EXISTS idx_indicacoes_referencia ON indicacoes(referencia_id);
CREATE INDEX IF NOT EXISTS idx_indicacoes_convidado ON indicacoes(convidado_id);
CREATE INDEX IF NOT EXISTS idx_indicacoes_status ON indicacoes(status);
CREATE INDEX IF NOT EXISTS idx_recompensas_referencia ON recompensas_indicacao(referencia_id);
CREATE INDEX IF NOT EXISTS idx_recompensas_status ON recompensas_indicacao(status);

-- Políticas RLS
ALTER TABLE referencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE indicacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recompensas_indicacao ENABLE ROW LEVEL SECURITY;

-- Políticas para referencias
CREATE POLICY "Usuários podem ver suas próprias referências" ON referencias 
    FOR SELECT USING (auth.uid() = participante_id);

CREATE POLICY "Usuários podem criar suas próprias referências" ON referencias 
    FOR INSERT WITH CHECK (auth.uid() = participante_id);

-- Políticas para indicacoes
CREATE POLICY "Usuários podem ver indicações relacionadas a suas referências" ON indicacoes 
    FOR SELECT USING (
        referencia_id IN (
            SELECT id FROM referencias WHERE participante_id = auth.uid()
        )
    );

CREATE POLICY "Sistema pode criar indicações" ON indicacoes 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Sistema pode atualizar indicações" ON indicacoes 
    FOR UPDATE USING (true);

-- Políticas para recompensas_indicacao
CREATE POLICY "Usuários podem ver suas próprias recompensas" ON recompensas_indicacao 
    FOR SELECT USING (
        referencia_id IN (
            SELECT id FROM referencias WHERE participante_id = auth.uid()
        )
    );

CREATE POLICY "Sistema pode criar recompensas" ON recompensas_indicacao 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Sistema pode atualizar recompensas" ON recompensas_indicacao 
    FOR UPDATE USING (true);

-- Trigger para limpar dados orfãos (opcional)
CREATE OR REPLACE FUNCTION cleanup_orphaned_referrals()
RETURNS TRIGGER AS $$
BEGIN
  -- Limpar indicações órfãs quando uma referência é deletada
  DELETE FROM indicacoes WHERE referencia_id = OLD.id;
  -- Limpar recompensas órfãs quando uma referência é deletada  
  DELETE FROM recompensas_indicacao WHERE referencia_id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cleanup_referrals
  BEFORE DELETE ON referencias
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_orphaned_referrals();

-- Comentários para documentação
COMMENT ON TABLE referencias IS 'Tabela de códigos de referência únicos por participante';
COMMENT ON TABLE indicacoes IS 'Tabela de indicações realizadas via códigos de referência';
COMMENT ON TABLE recompensas_indicacao IS 'Tabela de recompensas geradas baseadas em marcos de indicações';

COMMENT ON COLUMN referencias.codigo IS 'Código único no formato USERNAME+ANO (ex: PREMIUMUSER2025)';
COMMENT ON COLUMN indicacoes.status IS 'Status da indicação: pendente (cadastrou) ou completo (fez primeira missão)';
COMMENT ON COLUMN recompensas_indicacao.tipo IS 'Tipo de recompensa: bonus_3_amigos, bonus_5_amigos, bilhetes_extras';
COMMENT ON COLUMN recompensas_indicacao.valor IS 'Valor da recompensa em pontos ou bilhetes'; 