-- Add tokens_earned column to mission_rewards table
ALTER TABLE public.mission_rewards
ADD COLUMN tokens_earned INT NOT NULL DEFAULT 0;

-- Optional: Add a comment to the column
COMMENT ON COLUMN public.mission_rewards.tokens_earned IS 'Number of tokens awarded for completing the mission submission.'; 