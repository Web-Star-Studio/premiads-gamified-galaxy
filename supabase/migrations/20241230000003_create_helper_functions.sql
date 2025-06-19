-- Função para buscar missões desbloqueadas para um anunciante
CREATE OR REPLACE FUNCTION get_unlocked_missions_for_advertiser(advertiser_id UUID)
RETURNS TABLE (mission_id UUID)
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT mission_id 
  FROM advertiser_crm_unlocks 
  WHERE advertiser_id = $1;
$$; 