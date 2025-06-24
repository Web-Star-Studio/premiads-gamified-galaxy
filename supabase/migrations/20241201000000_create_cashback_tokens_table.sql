-- Create cashback_tokens table
CREATE TABLE IF NOT EXISTS public.cashback_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  advertiser_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  sha_code TEXT NOT NULL UNIQUE,
  cashback_percentage INTEGER NOT NULL CHECK (cashback_percentage >= 0 AND cashback_percentage <= 100),
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'usado', 'expirado')),
  validade TIMESTAMPTZ NOT NULL,
  campaign_id UUID REFERENCES public.cashback_campaigns(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cashback_tokens_user_id ON public.cashback_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_cashback_tokens_sha_code ON public.cashback_tokens(sha_code);
CREATE INDEX IF NOT EXISTS idx_cashback_tokens_status ON public.cashback_tokens(status);
CREATE INDEX IF NOT EXISTS idx_cashback_tokens_validade ON public.cashback_tokens(validade);
CREATE INDEX IF NOT EXISTS idx_cashback_tokens_campaign_id ON public.cashback_tokens(campaign_id);

-- Enable RLS
ALTER TABLE public.cashback_tokens ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own tokens" ON public.cashback_tokens
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert tokens" ON public.cashback_tokens
  FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update tokens" ON public.cashback_tokens
  FOR UPDATE USING (true);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.cashback_tokens TO authenticated;
GRANT SELECT ON public.cashback_tokens TO anon;

-- Add trigger to update updated_at
CREATE OR REPLACE FUNCTION update_cashback_tokens_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cashback_tokens_updated_at
  BEFORE UPDATE ON public.cashback_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_cashback_tokens_updated_at(); 