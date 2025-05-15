-- Create credit_packages table
CREATE TABLE IF NOT EXISTS public.credit_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    base INTEGER NOT NULL CHECK (base >= 500 AND base <= 10000),
    bonus INTEGER NOT NULL DEFAULT 0,
    price DECIMAL(10, 2) NOT NULL,
    validity_months INTEGER NOT NULL DEFAULT 12,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add comment to the table
COMMENT ON TABLE public.credit_packages IS 'Stores available credit packages for purchase';

-- Create credit_purchases table
CREATE TABLE IF NOT EXISTS public.credit_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    package_id UUID REFERENCES public.credit_packages(id),
    base INTEGER NOT NULL,
    bonus INTEGER NOT NULL DEFAULT 0,
    total_credits INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'failed')),
    payment_method TEXT NOT NULL,
    payment_provider TEXT NOT NULL,
    payment_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add comment to the table
COMMENT ON TABLE public.credit_purchases IS 'Stores credit purchase history and status';

-- Add credits column to profiles table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'credits'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN credits INTEGER NOT NULL DEFAULT 0;
    END IF;
END$$;

-- Create function to increment user credits
CREATE OR REPLACE FUNCTION public.increment_user_credits(
    user_id UUID,
    credits_to_add INTEGER
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.profiles
    SET 
        credits = COALESCE(credits, 0) + credits_to_add,
        updated_at = now()
    WHERE id = user_id;
END;
$$;

-- Create RLS policies for credit_packages
ALTER TABLE public.credit_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to active credit packages" 
    ON public.credit_packages FOR SELECT 
    USING (active = true);

CREATE POLICY "Allow admins to manage credit packages" 
    ON public.credit_packages FOR ALL 
    USING (auth.uid() IN (
        SELECT id FROM auth.users WHERE auth.users.raw_app_meta_data->>'role' = 'admin'
    ));

-- Create RLS policies for credit_purchases
ALTER TABLE public.credit_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own purchases" 
    ON public.credit_purchases FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own purchases" 
    ON public.credit_purchases FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all purchases" 
    ON public.credit_purchases FOR SELECT 
    USING (auth.uid() IN (
        SELECT id FROM auth.users WHERE auth.users.raw_app_meta_data->>'role' = 'admin'
    ));

-- Insert default credit packages
INSERT INTO public.credit_packages (base, bonus, price, validity_months, active)
VALUES 
    (500, 0, 50.00, 12, true),
    (1000, 100, 100.00, 12, true),
    (2500, 350, 250.00, 12, true),
    (5000, 1000, 500.00, 12, true),
    (10000, 2500, 1000.00, 12, true); 