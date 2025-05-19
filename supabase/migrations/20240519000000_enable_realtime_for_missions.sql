
-- Enable full replica identity for the mission_submissions table to ensure all fields are available in change payloads
ALTER TABLE IF EXISTS public.mission_submissions REPLICA IDENTITY FULL;

-- Enable full replica identity for mission_rewards table as well
ALTER TABLE IF EXISTS public.mission_rewards REPLICA IDENTITY FULL;

-- Add these tables to the supabase_realtime publication if they're not already there
DO $$
BEGIN
  -- For mission_submissions
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE tablename = 'mission_submissions'
      AND schemaname = 'public'
      AND pubname = 'supabase_realtime'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.mission_submissions;
  END IF;
  
  -- For mission_rewards
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE tablename = 'mission_rewards'
      AND schemaname = 'public'
      AND pubname = 'supabase_realtime'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.mission_rewards;
  END IF;
  
  -- For profiles (to capture point/token updates)
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
