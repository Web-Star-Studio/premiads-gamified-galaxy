CREATE OR REPLACE FUNCTION get_advertiser_metrics(advertiser_id_param uuid)
RETURNS TABLE(
    missions_completed BIGINT,
    unique_users BIGINT,
    completion_rate NUMERIC,
    engagement_rate NUMERIC
) AS $$
DECLARE
    total_missions_count BIGINT;
    completed_missions_this_month BIGINT;
    unique_participants BIGINT;
    total_submissions BIGINT;
    approved_submissions BIGINT;
    missions_with_approved_submissions BIGINT;
BEGIN
    -- Contar o número total de missões do anunciante
    SELECT COUNT(*)
    INTO total_missions_count
    FROM missions
    WHERE advertiser_id = advertiser_id_param;

    -- Contar missões completadas (submissions aprovadas) no último mês
    SELECT COUNT(DISTINCT m.id)
    INTO completed_missions_this_month
    FROM missions m
    JOIN mission_submissions ms ON m.id = ms.mission_id
    WHERE m.advertiser_id = advertiser_id_param
      AND ms.status = 'approved'
      AND ms.created_at >= date_trunc('month', now());

    -- Contar usuários únicos que participaram das missões do anunciante
    SELECT COUNT(DISTINCT ms.user_id)
    INTO unique_participants
    FROM mission_submissions ms
    JOIN missions m ON ms.mission_id = m.id
    WHERE m.advertiser_id = advertiser_id_param;
    
    -- Contar o total de submissões para as missões do anunciante
    SELECT COUNT(*)
    INTO total_submissions
    FROM mission_submissions ms
    JOIN missions m ON ms.mission_id = m.id
    WHERE m.advertiser_id = advertiser_id_param;
    
    -- Contar o total de submissões aprovadas
    SELECT COUNT(*)
    INTO approved_submissions
    FROM mission_submissions ms
    JOIN missions m ON ms.mission_id = m.id
    WHERE m.advertiser_id = advertiser_id_param AND ms.status = 'approved';

    -- Calcular missões que têm pelo menos uma submission aprovada
    SELECT COUNT(DISTINCT m.id)
    INTO missions_with_approved_submissions
    FROM missions m
    JOIN mission_submissions ms ON m.id = ms.mission_id
    WHERE m.advertiser_id = advertiser_id_param
      AND ms.status = 'approved';

    -- Retornar os resultados
    RETURN QUERY
    SELECT
        approved_submissions AS missions_completed,
        unique_participants AS unique_users,
        CASE
            WHEN total_submissions > 0 THEN (approved_submissions::NUMERIC / total_submissions) * 100
            ELSE 0
        END AS completion_rate,
        CASE
            WHEN total_missions_count > 0 THEN (missions_with_approved_submissions::NUMERIC / total_missions_count) * 100
            ELSE 0
        END AS engagement_rate;
END;
$$ LANGUAGE plpgsql; 