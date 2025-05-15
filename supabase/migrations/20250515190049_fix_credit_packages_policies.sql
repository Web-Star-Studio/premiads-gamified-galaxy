-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access to active credit packages" ON public.credit_packages;
DROP POLICY IF EXISTS "Allow admins to manage credit packages" ON public.credit_packages;
DROP POLICY IF EXISTS "Users can view their own purchases" ON public.credit_purchases;
DROP POLICY IF EXISTS "Users can create their own purchases" ON public.credit_purchases;
DROP POLICY IF EXISTS "Admins can view all purchases" ON public.credit_purchases;

-- Recreate policies using profiles.user_type
CREATE POLICY "Allow public read access to active credit packages" 
    ON public.credit_packages FOR SELECT 
    USING (active = true);

CREATE POLICY "Allow admins to manage credit packages" 
    ON public.credit_packages FOR ALL 
    USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND user_type = 'admin'
    ));

CREATE POLICY "Users can view their own purchases" 
    ON public.credit_purchases FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own purchases" 
    ON public.credit_purchases FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all purchases" 
    ON public.credit_purchases FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND user_type = 'admin'
    ));
