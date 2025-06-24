-- Function to get user's cashback tokens
CREATE OR REPLACE FUNCTION get_user_cashback_tokens(user_id UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  advertiser_id UUID,
  sha_code TEXT,
  cashback_percentage INTEGER,
  status TEXT,
  validade TIMESTAMPTZ,
  campaign_id UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    id,
    user_id,
    advertiser_id,
    sha_code,
    cashback_percentage,
    status,
    validade,
    campaign_id,
    created_at,
    updated_at
  FROM public.cashback_tokens
  WHERE cashback_tokens.user_id = get_user_cashback_tokens.user_id
  ORDER BY created_at DESC;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_cashback_tokens(UUID) TO authenticated; 