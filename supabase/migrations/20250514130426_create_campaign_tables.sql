-- Tabela para armazenar os tokens/créditos dos usuários anunciantes
CREATE TABLE IF NOT EXISTS user_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    total_tokens INTEGER NOT NULL DEFAULT 0,
    used_tokens INTEGER NOT NULL DEFAULT 0,
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
    points_range JSONB NOT NULL, -- e.g. {"min": 50, "max": 150}
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    cost_in_tokens INTEGER NOT NULL,
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

-- Tabela para registrar pontos ganhos pelos usuários
CREATE TABLE IF NOT EXISTS mission_rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    submission_id UUID NOT NULL REFERENCES mission_submissions(id) ON DELETE CASCADE,
    points_earned INTEGER NOT NULL,
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

-- Função para verificar se o anunciante tem tokens suficientes para criar uma campanha
CREATE OR REPLACE FUNCTION check_tokens_before_mission_creation()
RETURNS TRIGGER AS $$
DECLARE
    available_tokens INTEGER;
BEGIN
    SELECT (total_tokens - used_tokens) INTO available_tokens
    FROM user_tokens
    WHERE user_id = NEW.created_by;
    
    IF available_tokens IS NULL THEN
        RAISE EXCEPTION 'Usuário não possui tokens disponíveis';
    END IF;
    
    IF available_tokens < NEW.cost_in_tokens THEN
        RAISE EXCEPTION 'Tokens insuficientes para criar esta campanha';
    END IF;
    
    -- Atualizar tokens usados
    UPDATE user_tokens
    SET used_tokens = used_tokens + NEW.cost_in_tokens
    WHERE user_id = NEW.created_by;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para verificar tokens antes de criar missão
CREATE TRIGGER check_tokens_trigger
BEFORE INSERT ON missions
FOR EACH ROW
EXECUTE FUNCTION check_tokens_before_mission_creation();

-- Função para atualizar pontos do usuário quando uma submissão for aprovada
CREATE OR REPLACE FUNCTION update_user_points_on_approval()
RETURNS TRIGGER AS $$
DECLARE
    points_range JSONB;
    points_to_award INTEGER;
BEGIN
    IF NEW.status = 'aprovado' AND OLD.status != 'aprovado' THEN
        -- Buscar o range de pontos da missão
        SELECT m.points_range INTO points_range
        FROM missions m
        WHERE m.id = NEW.mission_id;
        
        -- Calcular pontos aleatórios dentro do range
        points_to_award := floor(random() * (
            (points_range->>'max')::INTEGER - (points_range->>'min')::INTEGER + 1
        ) + (points_range->>'min')::INTEGER);
        
        -- Inserir na tabela de recompensas
        INSERT INTO mission_rewards (user_id, mission_id, submission_id, points_earned)
        VALUES (NEW.user_id, NEW.mission_id, NEW.id, points_to_award);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar pontos do usuário
CREATE TRIGGER update_points_trigger
AFTER UPDATE ON mission_submissions
FOR EACH ROW
EXECUTE FUNCTION update_user_points_on_approval();

-- Políticas RLS (Row Level Security)

-- Ativar RLS nas tabelas
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_validation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_rewards ENABLE ROW LEVEL SECURITY;

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
            SELECT 1 FROM auth.users u
            WHERE u.id = auth.uid() AND u.user_metadata->>'user_type' IN ('admin', 'moderator')
        )
    );

-- Política para user_tokens
CREATE POLICY tokens_user_policy ON user_tokens
    FOR ALL
    TO authenticated
    USING (user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM auth.users u
            WHERE u.id = auth.uid() AND u.user_metadata->>'user_type' IN ('admin', 'moderator')
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
            SELECT 1 FROM auth.users u
            WHERE u.id = auth.uid() AND u.user_metadata->>'user_type' IN ('admin', 'moderator')
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
            SELECT 1 FROM auth.users u
            WHERE u.id = auth.uid() AND u.user_metadata->>'user_type' IN ('admin', 'moderator')
        )
    );
