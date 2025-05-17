CREATE OR REPLACE FUNCTION reward_participant_for_submission(submission_id uuid)
RETURNS void AS $$
DECLARE
  already_rewarded boolean;
  v_mission_id     uuid;
  v_user_id        uuid;
  v_points         integer;
  v_user_type      text;
BEGIN
  -- 1. Check if already rewarded
  SELECT exists(
    SELECT 1 FROM mission_rewards
    WHERE submission_id = $1
  )
  INTO already_rewarded;

  IF already_rewarded THEN
    RAISE NOTICE 'Submissão % já recompensada.', submission_id;
    RETURN;
  END IF;

  -- 2. Get mission_id and user_id
  SELECT mission_id, user_id
    INTO v_mission_id, v_user_id
  FROM mission_submissions
  WHERE id = submission_id;

  -- Log debugging info
  RAISE NOTICE 'Processing submission: %, mission: %, user: %', submission_id, v_mission_id, v_user_id;

  IF v_mission_id IS NULL OR v_user_id IS NULL THEN
    RAISE EXCEPTION 'Submissão % com dados incompletos (mission_id ou user_id nulos)', submission_id;
  END IF;

  -- 3. Get user type
  SELECT user_type
    INTO v_user_type
  FROM profiles
  WHERE id = v_user_id;

  RAISE NOTICE 'User type: %', v_user_type;

  -- 4. Get mission points
  SELECT points
    INTO v_points
  FROM missions
  WHERE id = v_mission_id;

  RAISE NOTICE 'Mission points: %', v_points;

  -- 5. Update points and mission status regardless of user_type
  -- Remove user_type constraint to make sure points are awarded
  
  -- Update user points
  UPDATE profiles
  SET points = COALESCE(points,0) + v_points,
      updated_at = NOW()
  WHERE id = v_user_id;

  -- Insert reward record
  INSERT INTO mission_rewards (
    user_id, 
    mission_id,
    submission_id, 
    points_earned,
    rewarded_at
  ) VALUES (
    v_user_id,
    v_mission_id,
    submission_id,
    v_points,
    NOW()
  );

  -- Update mission status to active
  UPDATE missions
  SET status = 'ativa',
      updated_at = NOW()
  WHERE id = v_mission_id;

  RAISE NOTICE 'Usuário % recompensado com % pontos pela missão %', v_user_id, v_points, v_mission_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 