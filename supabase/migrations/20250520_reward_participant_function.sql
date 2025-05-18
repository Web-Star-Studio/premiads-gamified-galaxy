-- Função para recompensar participantes ao concluir missões
CREATE OR REPLACE FUNCTION public.reward_participant_for_submission(submission_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_mission_id UUID;
    v_points INT;
    v_exists BOOLEAN;
BEGIN
    -- Verifica se a submissão existe e está com status 'approved'
    SELECT 
        user_id, mission_id INTO v_user_id, v_mission_id
    FROM 
        public.mission_submissions
    WHERE 
        id = submission_id
        AND status = 'approved';

    -- Se não encontrou submissão ou não está aprovada, sai
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Submissão não encontrada ou não aprovada';
    END IF;

    -- Pega os pontos da missão
    SELECT points INTO v_points
    FROM public.missions
    WHERE id = v_mission_id;

    IF v_points IS NULL THEN
        RAISE EXCEPTION 'Missão não encontrada ou sem pontos definidos';
    END IF;

    -- Verifica se já existe recompensa para esta submissão para evitar duplicação
    SELECT EXISTS (
        SELECT 1 FROM public.mission_rewards
        WHERE submission_id = reward_participant_for_submission.submission_id
    ) INTO v_exists;

    -- Se não existe recompensa, então cria uma
    IF NOT v_exists THEN
        -- Insere registro na tabela de recompensas
        INSERT INTO public.mission_rewards (
            user_id, 
            mission_id, 
            submission_id, 
            points_earned, 
            rewarded_at
        )
        VALUES (
            v_user_id, 
            v_mission_id, 
            submission_id, 
            v_points, 
            NOW()
        );

        -- Atualiza pontos do usuário diretamente
        UPDATE public.profiles
        SET 
            points = COALESCE(points, 0) + v_points,
            updated_at = NOW()
        WHERE 
            id = v_user_id;
            
        -- Atualiza também o status da missão como ativa
        UPDATE public.missions
        SET 
            status = 'ativa',
            updated_at = NOW()
        WHERE 
            id = v_mission_id;
            
        RAISE NOTICE 'Pontos (%) adicionados ao usuário (%)', v_points, v_user_id;
    END IF;
END;
$$; 