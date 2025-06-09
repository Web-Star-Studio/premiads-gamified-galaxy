-- Check if the profiles table exists
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'profiles'
    ) THEN
        -- Check if the role column doesn't exist yet
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'role'
        ) THEN
            -- Add the role column to the profiles table
            ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user';
            
            -- Make the first user an admin (you can adjust this if needed)
            UPDATE public.profiles 
            SET role = 'admin' 
            WHERE id = (SELECT id FROM public.profiles ORDER BY created_at LIMIT 1);
        END IF;
    ELSE
        -- Create a basic profiles table if it doesn't exist
        CREATE TABLE IF NOT EXISTS public.profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id),
            email TEXT,
            full_name TEXT,
            avatar_url TEXT,
            role TEXT DEFAULT 'user',
            rifas INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Add RLS policies
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
        
        -- Users can read their own profile
        CREATE POLICY "Users can read own profile" ON public.profiles
            FOR SELECT USING (auth.uid() = id);
            
        -- Users can update their own profile
        CREATE POLICY "Users can update own profile" ON public.profiles
            FOR UPDATE USING (auth.uid() = id);
            
        -- Admins can read all profiles
        CREATE POLICY "Admins can read all profiles" ON public.profiles
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM public.profiles
                    WHERE id = auth.uid() AND role = 'admin'
                )
            );
    END IF;
END
$$;
