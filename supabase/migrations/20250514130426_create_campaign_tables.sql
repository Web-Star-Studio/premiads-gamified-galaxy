-- Tabela para armazenar o saldo de cashback dos usuários
CREATE TABLE IF NOT EXISTS user_cashbacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    total_cashback NUMERIC(10,2) NOT NULL DEFAULT 0,
    redeemed_cashback NUMERIC(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de campanhas/missões
CREATE TABLE IF NOT EXISTS missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    type VARCHAR(50) NOT NULL, -- 'formulario', 'foto', 'video', 'check-in', 'redes_sociais', 'cupom', 'pesquisa', 'avaliacao'
    target_audience VARCHAR(100), -- 'todos', 'premium', 'beta', etc.
    tickets_reward INTEGER NOT NULL DEFAULT 0,
    cashback_reward NUMERIC(10,2) NOT NULL DEFAULT 0,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pendente', -- 'ativa', 'pendente', 'encerrada'
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para submissões de missões pelos usuários
CREATE TABLE IF NOT EXISTS mission_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    proof_url TEXT[],  -- Array de URLs para provas (fotos, vídeos, etc.)
    proof_text TEXT,   -- Texto explicativo ou resposta
    status VARCHAR(20) NOT NULL DEFAULT 'pendente', -- 'pendente', 'aprovado', 'rejeitado', 'segunda_instancia', 'descartado'
    validated_by UUID REFERENCES auth.users(id),
    admin_validated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para registrar os históricos de validação
CREATE TABLE IF NOT EXISTS mission_validation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES mission_submissions(id) ON DELETE CASCADE,
    validated_by UUID NOT NULL REFERENCES auth.users(id),
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    result VARCHAR(20) NOT NULL, -- 'aprovado', 'rejeitado'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para registrar recompensas (tickets + cashback) ganhos pelos usuários
CREATE TABLE IF NOT EXISTS mission_rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    submission_id UUID NOT NULL REFERENCES mission_submissions(id) ON DELETE CASCADE,
    tickets_earned INTEGER NOT NULL,
    cashback_earned NUMERIC(10,2) NOT NULL,
    rewarded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_missions_created_by ON missions(created_by);
CREATE INDEX IF NOT EXISTS idx_missions_status ON missions(status);
CREATE INDEX IF NOT EXISTS idx_mission_submissions_user_id ON mission_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_mission_submissions_mission_id ON mission_submissions(mission_id);
CREATE INDEX IF NOT EXISTS idx_mission_submissions_status ON mission_submissions(status);
CREATE INDEX IF NOT EXISTS idx_mission_rewards_user_id ON mission_rewards(user_id);

-- Funções e Triggers

-- Função para atualizar tickets e cashback do usuário quando uma submissão for aprovada
CREATE OR REPLACE FUNCTION update_user_rewards_on_approval()
RETURNS TRIGGER AS $$
DECLARE
    v_tickets INTEGER;
    v_cashback NUMERIC(10,2);
BEGIN
    IF NEW.status = 'aprovado' AND OLD.status != 'aprovado' THEN
        -- Buscar recompensas definidas na missão
        SELECT m.tickets_reward, m.cashback_reward INTO v_tickets, v_cashback
        FROM missions m
        WHERE m.id = NEW.mission_id;

        -- Inserir registro de recompensa
        INSERT INTO mission_rewards (user_id, mission_id, submission_id, tickets_earned, cashback_earned)
        VALUES (NEW.user_id, NEW.mission_id, NEW.id, v_tickets, v_cashback);

        -- Atualizar/Inserir saldo de cashback agregado
        INSERT INTO user_cashbacks (user_id, total_cashback)
        VALUES (NEW.user_id, v_cashback)
        ON CONFLICT (user_id) DO UPDATE
        SET total_cashback = user_cashbacks.total_cashback + EXCLUDED.total_cashback,
            updated_at = now();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar tickets e cashback do usuário
CREATE TRIGGER update_rewards_trigger
AFTER UPDATE ON mission_submissions
FOR EACH ROW
EXECUTE FUNCTION update_user_rewards_on_approval();

-- Políticas RLS (Row Level Security)

-- Ativar RLS nas tabelas
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_cashbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_validation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_rewards ENABLE ROW LEVEL SECURITY;

-- Garantir que políticas antigas sejam removidas antes de recriar
DROP POLICY IF EXISTS missions_advertisers_policy ON missions;
DROP POLICY IF EXISTS submissions_user_policy ON mission_submissions;
DROP POLICY IF EXISTS cashbacks_user_policy ON user_cashbacks;
DROP POLICY IF EXISTS validation_logs_policy ON mission_validation_logs;
DROP POLICY IF EXISTS rewards_user_policy ON mission_rewards;

-- Política para missions (anunciantes podem ver/editar suas próprias missões, participantes veem missões ativas)
CREATE POLICY missions_advertisers_policy ON missions
    FOR ALL
    TO authenticated
    USING (
        created_by = auth.uid() OR
        (status = 'ativa' AND auth.uid() IS NOT NULL)
    );

-- Política para submissions
CREATE POLICY submissions_user_policy ON mission_submissions
    FOR ALL
    TO authenticated
    USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM missions m
            WHERE m.id = mission_id AND m.created_by = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid() AND p.user_type IN ('admin', 'moderator')
        )
    );

-- Política para user_cashbacks
CREATE POLICY cashbacks_user_policy ON user_cashbacks
    FOR ALL
    TO authenticated
    USING (user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid() AND p.user_type IN ('admin', 'moderator')
        )
    );

-- Política para validation_logs
CREATE POLICY validation_logs_policy ON mission_validation_logs
    FOR ALL
    TO authenticated
    USING (
        validated_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM mission_submissions ms
            WHERE ms.id = submission_id AND ms.user_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid() AND p.user_type IN ('admin', 'moderator')
        )
    );

-- Política para rewards
CREATE POLICY rewards_user_policy ON mission_rewards
    FOR ALL
    TO authenticated
    USING (user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM missions m
            WHERE m.id = mission_id AND m.created_by = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid() AND p.user_type IN ('admin', 'moderator')
        )
    );
