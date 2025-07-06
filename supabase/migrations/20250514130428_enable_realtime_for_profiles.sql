
-- Enable full replica identity for the profiles table
ALTER TABLE IF EXISTS public.profiles REPLICA IDENTITY FULL;

-- Add profiles table to the supabase_realtime publication if it's not already there
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE tablename = 'profiles'
      AND schemaname = 'public'
      AND pubname = 'supabase_realtime'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
  END IF;
END $$;
