
-- Add tokens_earned column to mission_rewards table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'mission_rewards' 
      AND column_name = 'tokens_earned'
  ) THEN
    ALTER TABLE public.mission_rewards
    ADD COLUMN tokens_earned INT NOT NULL DEFAULT 0;

    -- Optional: Add a comment to the column
    COMMENT ON COLUMN public.mission_rewards.tokens_earned IS 'Number of tokens awarded for completing the mission submission.';
  END IF;
END $$;
