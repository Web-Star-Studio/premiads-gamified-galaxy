-- Create cashback_campaigns table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.cashback_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  start_date TIMESTAMP NOT NULL DEFAULT now(),
  end_date TIMESTAMP NOT NULL DEFAULT (now() + interval '30 days'),
  cashback_percentage DECIMAL NOT NULL DEFAULT 0,
  max_amount DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create cashback_redemptions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.cashback_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  campaign_id UUID NOT NULL REFERENCES public.cashback_campaigns(id),
  amount DECIMAL NOT NULL,
  code TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Ensure profiles has cashback_balance column
ALTER TABLE IF EXISTS profiles
  ADD COLUMN IF NOT EXISTS cashback_balance DECIMAL NOT NULL DEFAULT 0;

-- Function to get active cashback campaigns
CREATE OR REPLACE FUNCTION get_active_cashback_campaigns()
RETURNS SETOF cashback_campaigns
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * 
  FROM cashback_campaigns
  WHERE is_active = true
    AND start_date <= now()
    AND end_date >= now();
$$;

-- Function to get user's cashback balance
CREATE OR REPLACE FUNCTION get_user_cashback_balance(user_id UUID)
RETURNS TABLE (cashback_balance DECIMAL)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT cashback_balance
  FROM profiles
  WHERE id = user_id;
$$;

-- Function to redeem cashback
CREATE OR REPLACE FUNCTION redeem_cashback(
  p_user_id UUID,
  p_campaign_id UUID,
  p_amount DECIMAL
)
RETURNS SETOF cashback_redemptions
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_redemption_id UUID;
  v_code TEXT;
BEGIN
  -- Generate unique redemption code
  v_code := CONCAT(
    SUBSTRING(MD5(p_user_id::text || p_campaign_id::text || now()::text) FROM 1 FOR 8),
    '-',
    SUBSTRING(MD5(random()::text) FROM 1 FOR 4)
  );
  
  -- Insert redemption record
  INSERT INTO cashback_redemptions (
    user_id,
    campaign_id,
    amount,
    code,
    status
  ) VALUES (
    p_user_id,
    p_campaign_id,
    p_amount,
    v_code,
    'pending'
  )
  RETURNING id INTO v_redemption_id;
  
  -- Deduct amount from user balance
  UPDATE profiles
  SET cashback_balance = cashback_balance - p_amount
  WHERE id = p_user_id;
  
  -- Return the created redemption
  RETURN QUERY
  SELECT *
  FROM cashback_redemptions
  WHERE id = v_redemption_id;
END;
$$;
