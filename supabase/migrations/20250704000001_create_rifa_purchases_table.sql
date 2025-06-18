-- Create rifa_purchases table and rifa_packages table if they don't exist
-- This migration ensures the tables have the correct structure for the rifa purchase system

begin;

-- Create rifa_packages table
CREATE TABLE IF NOT EXISTS public.rifa_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rifas_amount INTEGER NOT NULL CHECK (rifas_amount >= 500 AND rifas_amount <= 15000),
    rifas_bonus INTEGER NOT NULL DEFAULT 0,
    price DECIMAL(10, 2) NOT NULL,
    validity_months INTEGER NOT NULL DEFAULT 12,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create rifa_purchases table
CREATE TABLE IF NOT EXISTS public.rifa_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rifa_package_id UUID REFERENCES public.rifa_packages(id),
    base INTEGER NOT NULL,
    bonus INTEGER NOT NULL DEFAULT 0,
    total_rifas INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'failed')),
    payment_method TEXT NOT NULL,
    payment_provider TEXT NOT NULL,
    payment_id TEXT,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add rifas column to profiles table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'rifas'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN rifas INTEGER NOT NULL DEFAULT 0;
    END IF;
END$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rifa_purchases_user_id ON public.rifa_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_rifa_purchases_status ON public.rifa_purchases(status);
CREATE INDEX IF NOT EXISTS idx_rifa_purchases_payment_id ON public.rifa_purchases(payment_id);

-- Enable RLS
ALTER TABLE public.rifa_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rifa_purchases ENABLE ROW LEVEL SECURITY;

-- RLS policies for rifa_packages (everyone can read active packages)
CREATE POLICY IF NOT EXISTS "Anyone can view active rifa packages"
ON public.rifa_packages FOR SELECT
USING (active = true);

-- RLS policies for rifa_purchases
CREATE POLICY IF NOT EXISTS "Users can view their own rifa purchases"
ON public.rifa_purchases FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can create their own rifa purchases"
ON public.rifa_purchases FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Service role can update rifa purchases"
ON public.rifa_purchases FOR UPDATE
USING (true);

-- Insert default rifa packages if they don't exist
INSERT INTO public.rifa_packages (rifas_amount, rifas_bonus, price, validity_months, active)
SELECT * FROM (VALUES 
    (500, 0, 25.00, 12, true),
    (1000, 100, 50.00, 12, true),
    (2500, 350, 125.00, 12, true),
    (5000, 1000, 250.00, 12, true),
    (10000, 2500, 500.00, 12, true),
    (12500, 2500, 500.00, 12, true)
) AS t(rifas_amount, rifas_bonus, price, validity_months, active)
WHERE NOT EXISTS (
    SELECT 1 FROM public.rifa_packages WHERE rifas_amount = t.rifas_amount
);

commit; 