-- Function to validate and mark cashback coupon as used
CREATE OR REPLACE FUNCTION validate_cashback_coupon(
  p_sha_code TEXT,
  p_advertiser_id UUID
)
RETURNS TABLE (
  success BOOLEAN,
  message TEXT,
  token_data JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_token_record cashback_tokens%ROWTYPE;
  v_campaign_record cashback_campaigns%ROWTYPE;
BEGIN
  -- Check if coupon exists
  SELECT * INTO v_token_record
  FROM cashback_tokens
  WHERE sha_code = p_sha_code;
  
  -- If coupon doesn't exist
  IF NOT FOUND THEN
    RETURN QUERY SELECT 
      false as success,
      'Cupom não encontrado. Verifique o código.' as message,
      NULL::jsonb as token_data;
    RETURN;
  END IF;
  
  -- Check if coupon is expired
  IF v_token_record.validade < NOW() THEN
    RETURN QUERY SELECT 
      false as success,
      'Cupom expirado. Este cupom não pode mais ser usado.' as message,
      row_to_json(v_token_record)::jsonb as token_data;
    RETURN;
  END IF;
  
  -- Check if coupon is already used
  IF v_token_record.status = 'usado' THEN
    RETURN QUERY SELECT 
      false as success,
      'Cupom já foi utilizado anteriormente.' as message,
      row_to_json(v_token_record)::jsonb as token_data;
    RETURN;
  END IF;
  
  -- Check if coupon is inactive
  IF v_token_record.status != 'ativo' THEN
    RETURN QUERY SELECT 
      false as success,
      'Cupom inválido ou inativo.' as message,
      row_to_json(v_token_record)::jsonb as token_data;
    RETURN;
  END IF;
  
  -- Get campaign info to verify advertiser
  SELECT * INTO v_campaign_record
  FROM cashback_campaigns
  WHERE id = v_token_record.campaign_id;
  
  -- Check if advertiser owns this campaign (optional verification)
  IF v_campaign_record.advertiser_id != p_advertiser_id THEN
    RETURN QUERY SELECT 
      false as success,
      'Você não tem permissão para validar este cupom.' as message,
      row_to_json(v_token_record)::jsonb as token_data;
    RETURN;
  END IF;
  
  -- Mark coupon as used
  UPDATE cashback_tokens
  SET status = 'usado',
      updated_at = NOW()
  WHERE sha_code = p_sha_code;
  
  -- Get updated record
  SELECT * INTO v_token_record
  FROM cashback_tokens
  WHERE sha_code = p_sha_code;
  
  -- Return success
  RETURN QUERY SELECT 
    true as success,
    'Cupom validado com sucesso!' as message,
    row_to_json(v_token_record)::jsonb as token_data;
  
  RETURN;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION validate_cashback_coupon(TEXT, UUID) TO authenticated; 