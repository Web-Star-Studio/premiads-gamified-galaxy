
CREATE OR REPLACE FUNCTION public.award_submission_rewards(
  p_submission_id UUID,
  p_participant_id UUID,
  p_mission_id UUID,
  p_points_to_award INT,
  p_tokens_to_award INT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  already_rewarded BOOLEAN;
BEGIN
  -- 1. Check if this submission has already been rewarded in mission_rewards
  SELECT EXISTS (
    SELECT 1
    FROM public.mission_rewards mr
    WHERE mr.submission_id = p_submission_id
  ) INTO already_rewarded;

  IF already_rewarded THEN
    RAISE NOTICE 'Submission % has already been rewarded. Skipping.', p_submission_id;
    RETURN;
  END IF;

  -- 2. Update participant's points and credits (tokens) in the profiles table
  UPDATE public.profiles
  SET 
    points = COALESCE(points, 0) + p_points_to_award,
    credits = COALESCE(credits, 0) + p_tokens_to_award,
    updated_at = NOW()
  WHERE id = p_participant_id;

  -- 3. Insert a record into mission_rewards to log this reward
  INSERT INTO public.mission_rewards (
    user_id,
    mission_id,
    submission_id,
    points_earned,
    tokens_earned,
    rewarded_at
  ) VALUES (
    p_participant_id,
    p_mission_id,
    p_submission_id,
    p_points_to_award,
    p_tokens_to_award,
    NOW()
  );

  -- 4. Create a notification for the user (if needed)
  -- You could insert into a notifications table here
  
  RAISE NOTICE 'User % awarded % points and % tokens for submission %', p_participant_id, p_points_to_award, p_tokens_to_award, p_submission_id;

END;
$$;

COMMENT ON FUNCTION public.award_submission_rewards(UUID, UUID, UUID, INT, INT) 
IS 'Awards points and tokens to a participant for a given mission submission, updates their profile, and logs the reward. Ensures idempotency by checking mission_rewards.';
