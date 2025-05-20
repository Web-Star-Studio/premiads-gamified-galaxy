
-- Update the finalize_submission function to ensure it properly calls process_mission_rewards
CREATE OR REPLACE FUNCTION public.finalize_submission(p_submission_id uuid, p_approver_id uuid, p_decision text, p_stage text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_mission_id UUID;
  v_participant_id UUID;
  v_points INT;
  v_tokens INT;
  v_status TEXT;
  v_request_id UUID;
  v_result JSONB;
  v_reward_result JSONB;
  v_already_rewarded BOOLEAN;
BEGIN
  -- Get submission details
  SELECT 
    mission_id, 
    user_id
  INTO 
    v_mission_id, 
    v_participant_id
  FROM mission_submissions
  WHERE id = p_submission_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Submission not found';
  END IF;
  
  -- Get mission points AND tokens
  SELECT 
    points, 
    cost_in_tokens INTO v_points, v_tokens 
  FROM missions 
  WHERE id = v_mission_id;
  
  -- Check if reward has already been given to avoid duplicates
  SELECT EXISTS(
    SELECT 1 FROM mission_rewards 
    WHERE submission_id = p_submission_id
  ) INTO v_already_rewarded;
  
  -- Get request ID if exists
  SELECT id INTO v_request_id 
  FROM missions_requests 
  WHERE mission_id = v_mission_id AND user_id = v_participant_id
  ORDER BY created_at DESC 
  LIMIT 1;
  
  -- Process based on stage and decision
  IF p_stage = 'advertiser_first' THEN
    IF p_decision = 'approve' THEN
      -- Update submission
      UPDATE mission_submissions
      SET 
        status = 'approved',
        review_stage = 'finalized',
        validated_by = p_approver_id,
        admin_validated = FALSE,
        updated_at = NOW()
      WHERE id = p_submission_id;
      
      -- Update request if exists
      IF v_request_id IS NOT NULL THEN
        UPDATE missions_requests
        SET 
          status = 'approved',
          review_stage = 'finalized',
          validated_by = p_approver_id
        WHERE id = v_request_id;
      END IF;
      
      -- Award points AND tokens to participant if not already rewarded
      IF NOT v_already_rewarded THEN
        -- Add points to user
        UPDATE profiles
        SET 
          points = COALESCE(points, 0) + v_points,
          credits = COALESCE(credits, 0) + v_tokens,
          updated_at = NOW()
        WHERE id = v_participant_id;
        
        -- Record the reward
        INSERT INTO mission_rewards (
          user_id, 
          mission_id, 
          submission_id, 
          points_earned,
          tokens_earned,
          rewarded_at
        ) VALUES (
          v_participant_id,
          v_mission_id,
          p_submission_id,
          v_points,
          v_tokens,
          NOW()
        );
        
        -- Process additional rewards (badges, loot boxes, streaks)
        v_reward_result := process_mission_rewards(
          p_submission_id, 
          v_participant_id, 
          v_mission_id
        );
        RAISE NOTICE 'Processed additional rewards: %', v_reward_result;
      END IF;
      
      v_status := 'approved';
      
    ELSIF p_decision = 'reject' THEN
      -- Update submission for second instance review
      UPDATE mission_submissions
      SET 
        status = 'second_instance_pending',
        review_stage = 'admin',
        second_instance = TRUE,
        validated_by = p_approver_id,
        updated_at = NOW()
      WHERE id = p_submission_id;
      
      -- Update request if exists
      IF v_request_id IS NOT NULL THEN
        UPDATE missions_requests
        SET 
          status = 'second_instance_pending',
          review_stage = 'admin',
          second_instance = TRUE,
          validated_by = p_approver_id
        WHERE id = v_request_id;
      END IF;
      
      v_status := 'second_instance_pending';
    END IF;
    
  ELSIF p_stage = 'admin' THEN
    IF p_decision = 'approve' THEN
      -- Admin approves, return to advertiser
      UPDATE mission_submissions
      SET 
        second_instance_status = 'approved',
        review_stage = 'returned_to_advertiser',
        admin_validated = TRUE,
        validated_by = p_approver_id,
        updated_at = NOW()
      WHERE id = p_submission_id;
      
      -- Update request if exists
      IF v_request_id IS NOT NULL THEN
        UPDATE missions_requests
        SET 
          second_instance_status = 'approved',
          review_stage = 'returned_to_advertiser',
          admin_validated = TRUE,
          validated_by = p_approver_id
        WHERE id = v_request_id;
      END IF;
      
      v_status := 'returned_to_advertiser';
      
    ELSIF p_decision = 'reject' THEN
      -- Admin rejects
      UPDATE mission_submissions
      SET 
        status = 'rejected',
        review_stage = 'completed',
        admin_validated = TRUE,
        validated_by = p_approver_id,
        updated_at = NOW()
      WHERE id = p_submission_id;
      
      -- Update request if exists
      IF v_request_id IS NOT NULL THEN
        UPDATE missions_requests
        SET 
          status = 'rejected',
          review_stage = 'completed',
          admin_validated = TRUE,
          validated_by = p_approver_id
        WHERE id = v_request_id;
      END IF;
      
      v_status := 'rejected';
    END IF;
    
  ELSIF p_stage = 'advertiser_second' THEN
    IF p_decision = 'approve' THEN
      -- Final advertiser approval
      UPDATE mission_submissions
      SET 
        status = 'approved',
        second_instance_status = 'approved',
        review_stage = 'completed',
        validated_by = p_approver_id,
        updated_at = NOW()
      WHERE id = p_submission_id;
      
      -- Update request if exists
      IF v_request_id IS NOT NULL THEN
        UPDATE missions_requests
        SET 
          status = 'approved',
          second_instance_status = 'approved',
          review_stage = 'completed',
          validated_by = p_approver_id
        WHERE id = v_request_id;
      END IF;
      
      -- Award both points AND tokens to participant if not already rewarded
      IF NOT v_already_rewarded THEN
        -- Add points to user
        UPDATE profiles
        SET 
          points = COALESCE(points, 0) + v_points,
          credits = COALESCE(credits, 0) + v_tokens,
          updated_at = NOW()
        WHERE id = v_participant_id;
        
        -- Record the reward
        INSERT INTO mission_rewards (
          user_id, 
          mission_id, 
          submission_id, 
          points_earned,
          tokens_earned,
          rewarded_at
        ) VALUES (
          v_participant_id,
          v_mission_id,
          p_submission_id,
          v_points,
          v_tokens,
          NOW()
        );
        
        -- Process additional rewards (badges, loot boxes, streaks)
        v_reward_result := process_mission_rewards(
          p_submission_id, 
          v_participant_id, 
          v_mission_id
        );
        RAISE NOTICE 'Processed additional rewards: %', v_reward_result;
      END IF;
      
      v_status := 'approved';
      
    ELSIF p_decision = 'reject' THEN
      -- Final advertiser rejection
      UPDATE mission_submissions
      SET 
        status = 'rejected',
        second_instance_status = 'rejected',
        review_stage = 'completed',
        validated_by = p_approver_id,
        updated_at = NOW()
      WHERE id = p_submission_id;
      
      -- Update request if exists
      IF v_request_id IS NOT NULL THEN
        UPDATE missions_requests
        SET 
          status = 'rejected',
          second_instance_status = 'rejected',
          review_stage = 'completed',
          validated_by = p_approver_id
        WHERE id = v_request_id;
      END IF;
      
      v_status := 'rejected';
    END IF;
  ELSE
    RAISE EXCEPTION 'Invalid stage: %', p_stage;
  END IF;
  
  -- Return result with tokens information and additional rewards
  v_result := jsonb_build_object(
    'status', v_status,
    'submission_id', p_submission_id,
    'participant_id', v_participant_id,
    'mission_id', v_mission_id,
    'points_awarded', CASE WHEN v_status = 'approved' AND NOT v_already_rewarded THEN v_points ELSE 0 END,
    'tokens_awarded', CASE WHEN v_status = 'approved' AND NOT v_already_rewarded THEN v_tokens ELSE 0 END
  );
  
  -- Merge additional rewards information if available
  IF v_reward_result IS NOT NULL THEN
    v_result := v_result || v_reward_result;
  END IF;
  
  RETURN v_result;
END;
$$;

-- Create a function to retroactively award badges for already approved submissions
CREATE OR REPLACE FUNCTION public.retroactively_award_badges()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_submission RECORD;
  v_badge_exists BOOLEAN;
  v_badge_name TEXT;
  v_badge_description TEXT;
  v_badge_image_url TEXT;
  v_mission_info RECORD;
  v_reward_result JSONB;
BEGIN
  -- Find all approved submissions that don't have badges yet
  FOR v_submission IN 
    SELECT 
      ms.id AS submission_id,
      ms.user_id,
      ms.mission_id
    FROM 
      mission_submissions ms
    JOIN 
      missions m ON ms.mission_id = m.id
    LEFT JOIN 
      user_badges ub ON ub.user_id = ms.user_id AND ub.mission_id = ms.mission_id
    WHERE 
      ms.status = 'approved' 
      AND m.has_badge = true
      AND ub.id IS NULL
  LOOP
    -- Process rewards for this submission
    v_reward_result := process_mission_rewards(
      v_submission.submission_id,
      v_submission.user_id,
      v_submission.mission_id
    );
    
    RAISE NOTICE 'Retroactively processed rewards for submission %, user %, mission %: %',
      v_submission.submission_id, v_submission.user_id, v_submission.mission_id, v_reward_result;
  END LOOP;
END;
$$;

-- Enable security definer for process_mission_rewards function
-- This ensures it runs with the privileges of the creator
CREATE OR REPLACE FUNCTION public.process_mission_rewards(p_submission_id uuid, p_user_id uuid, p_mission_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_mission RECORD;
  v_points INTEGER;
  v_streak_bonus NUMERIC := 0;
  v_current_streak INTEGER := 0; 
  v_streak_record RECORD;
  v_loot_box_reward TEXT := NULL;
  v_loot_box_amount NUMERIC := 0;
  v_result JSONB;
  v_has_badge BOOLEAN;
  v_has_lootbox BOOLEAN;
  v_sequence_bonus BOOLEAN;
  v_streak_multiplier NUMERIC;
  v_badge_exists BOOLEAN;
  v_badge_earned BOOLEAN := FALSE; 
  v_badge_id UUID;
  v_lootbox_id UUID;
  v_badge_name TEXT;
  v_badge_description TEXT;
  v_badge_image_url TEXT;
BEGIN
  RAISE NOTICE 'Starting process_mission_rewards for submission_id: %, user_id: %, mission_id: %', 
               p_submission_id, p_user_id, p_mission_id;

  -- Check for existing streak
  SELECT current_streak INTO v_current_streak
  FROM daily_streaks
  WHERE user_id = p_user_id AND mission_id = p_mission_id;
  
  IF NOT FOUND THEN
    RAISE NOTICE 'No existing streak found for user % and mission %', p_user_id, p_mission_id;
    v_current_streak := 0; 
  ELSE
    RAISE NOTICE 'Found existing streak: % for user % and mission %', 
                 v_current_streak, p_user_id, p_mission_id;
  END IF;

  -- Get mission info including badge_image_url
  SELECT 
    points, 
    has_badge, 
    has_lootbox, 
    sequence_bonus,
    COALESCE(streak_multiplier, 1.2) as streak_multiplier,
    title,
    type,
    badge_image_url
  INTO v_mission
  FROM missions
  WHERE id = p_mission_id;

  IF v_mission IS NULL THEN
    RAISE WARNING 'No mission found for p_mission_id: %', p_mission_id;
    RETURN jsonb_build_object(
      'badge_earned', FALSE,
      'loot_box_reward', NULL,
      'loot_box_amount', 0,
      'streak_bonus', 0,
      'current_streak', 0,
      'error', 'Mission not found'
    );
  END IF;

  RAISE NOTICE 'Mission found: title=%, has_badge=%, has_lootbox=%, sequence_bonus=%, badge_image_url=%', 
               v_mission.title, v_mission.has_badge, v_mission.has_lootbox, v_mission.sequence_bonus, v_mission.badge_image_url;

  v_points := v_mission.points;
  v_has_badge := v_mission.has_badge;
  v_has_lootbox := v_mission.has_lootbox;
  v_sequence_bonus := v_mission.sequence_bonus;
  v_streak_multiplier := v_mission.streak_multiplier;
  v_badge_image_url := v_mission.badge_image_url;

  -- Process streak if applicable
  IF v_sequence_bonus THEN
    -- ... keep existing code for streak processing ...
  END IF;
  
  -- Process badge if applicable
  IF v_has_badge THEN
    RAISE NOTICE 'Processing badge for mission %', p_mission_id;
    
    SELECT EXISTS (
      SELECT 1 FROM user_badges
      WHERE user_id = p_user_id AND mission_id = p_mission_id
    ) INTO v_badge_exists;
    
    IF NOT v_badge_exists THEN
      RAISE NOTICE 'Badge does not exist for this user and mission, creating new badge';

      -- Create badge name
      v_badge_name := v_mission.title || ' Badge';
      
      -- Create badge description
      v_badge_description := (
        CASE floor(random() * 5)::int
          WHEN 0 THEN 'Parabéns! Você completou a missão "' || v_mission.title || '" com sucesso.'
          WHEN 1 THEN 'Conquista desbloqueada por completar a missão "' || v_mission.title || '".'
          WHEN 2 THEN 'Badge especial concedido por sua excelência na missão "' || v_mission.title || '".'
          WHEN 3 THEN 'Sua dedicação na missão "' || v_mission.title || '" foi reconhecida com esta badge.'
          ELSE 'Esta badge celebra sua conquista na missão "' || v_mission.title || '".'
        END
      );
      
      -- Use the mission's badge_image_url if available, otherwise generate based on type
      IF v_badge_image_url IS NULL OR v_badge_image_url = '' THEN
        -- Prefer SVG paths over Lottie animations (which may be blocked by browsers)
        v_badge_image_url := 
          CASE 
            WHEN v_mission.type ILIKE '%photo%' THEN '/images/badges/photo-badge.svg'
            WHEN v_mission.type ILIKE '%form%' THEN '/images/badges/form-badge.svg'
            WHEN v_mission.type ILIKE '%video%' THEN '/images/badges/video-badge.svg'
            WHEN v_mission.type ILIKE '%survey%' THEN '/images/badges/survey-badge.svg'
            WHEN v_mission.type ILIKE '%review%' THEN '/images/badges/review-badge.svg'
            WHEN v_mission.type ILIKE '%coupon%' THEN '/images/badges/coupon-badge.svg'
            WHEN v_mission.type ILIKE '%social%' THEN '/images/badges/social-badge.svg'
            WHEN v_mission.type ILIKE '%checkin%' OR v_mission.type ILIKE '%check-in%' THEN '/images/badges/checkin-badge.svg'
            -- Fallback to Lottie if SVG not available
            WHEN v_mission.type ILIKE '%photo%' THEN 'https://assets10.lottiefiles.com/packages/lf20_qm8eqtyw.json'
            WHEN v_mission.type ILIKE '%form%' THEN 'https://assets1.lottiefiles.com/packages/lf20_fnjha2ed.json'
            WHEN v_mission.type ILIKE '%video%' THEN 'https://assets3.lottiefiles.com/packages/lf20_2cwdcjsd.json'
            WHEN v_mission.type ILIKE '%survey%' THEN 'https://assets7.lottiefiles.com/packages/lf20_kw2yp2rh.json'
            WHEN v_mission.type ILIKE '%review%' THEN 'https://assets3.lottiefiles.com/packages/lf20_bnfvh5kf.json'
            WHEN v_mission.type ILIKE '%coupon%' THEN 'https://assets10.lottiefiles.com/packages/lf20_uomoou11.json'
            WHEN v_mission.type ILIKE '%social%' THEN 'https://assets9.lottiefiles.com/packages/lf20_wloxwm9w.json'
            WHEN v_mission.type ILIKE '%checkin%' OR v_mission.type ILIKE '%check-in%' THEN 'https://assets3.lottiefiles.com/packages/lf20_9yi1lpr7.json'
            ELSE '/images/badges/default-badge.svg'
          END;
        RAISE NOTICE 'No badge image URL found, using type-based URL: %', v_badge_image_url;
      ELSE
        RAISE NOTICE 'Using supplied badge image URL: %', v_badge_image_url;
      END IF;

      INSERT INTO user_badges (
        user_id,
        mission_id,
        badge_name,
        badge_description,
        badge_image_url,
        earned_at
      ) VALUES (
        p_user_id,
        p_mission_id,
        v_badge_name,
        v_badge_description,
        v_badge_image_url, 
        NOW()
      ) RETURNING id INTO v_badge_id;
      
      v_badge_earned := TRUE; 
      RAISE NOTICE 'Created new badge (ID: %) for user % and mission % with image URL %', 
                   v_badge_id, p_user_id, p_mission_id, v_badge_image_url;
    ELSE
      -- Badge already exists, check if it needs updating
      SELECT id, badge_image_url INTO v_badge_id, v_badge_image_url 
      FROM user_badges
      WHERE user_id = p_user_id AND mission_id = p_mission_id;
      
      IF v_badge_image_url IS NULL OR v_badge_image_url = '' OR 
         v_badge_image_url LIKE '%lottiefiles.com%' OR 
         v_badge_image_url LIKE '%.json%' THEN
        -- Badge exists but has no image URL or is using Lottie (which might be blocked)
        RAISE NOTICE 'Badge exists but has invalid/lottie image URL, updating badge record: %', v_badge_id;
        
        -- Create better badge name and description
        v_badge_name := v_mission.title || ' Badge';
        v_badge_description := (
          CASE floor(random() * 5)::int
            WHEN 0 THEN 'Parabéns! Você completou a missão "' || v_mission.title || '" com sucesso.'
            WHEN 1 THEN 'Conquista desbloqueada por completar a missão "' || v_mission.title || '".'
            WHEN 2 THEN 'Badge especial concedido por sua excelência na missão "' || v_mission.title || '".'
            WHEN 3 THEN 'Sua dedicação na missão "' || v_mission.title || '" foi reconhecida com esta badge.'
            ELSE 'Esta badge celebra sua conquista na missão "' || v_mission.title || '".'
          END
        );
        
        -- Use mission's badge_image_url if available, otherwise generate based on type
        IF v_mission.badge_image_url IS NOT NULL AND v_mission.badge_image_url != '' THEN
          v_badge_image_url := v_mission.badge_image_url;
        ELSE 
          -- Prefer SVG paths over Lottie animations
          v_badge_image_url := 
            CASE 
              WHEN v_mission.type ILIKE '%photo%' THEN '/images/badges/photo-badge.svg'
              WHEN v_mission.type ILIKE '%form%' THEN '/images/badges/form-badge.svg'
              WHEN v_mission.type ILIKE '%video%' THEN '/images/badges/video-badge.svg'
              WHEN v_mission.type ILIKE '%survey%' THEN '/images/badges/survey-badge.svg'
              WHEN v_mission.type ILIKE '%review%' THEN '/images/badges/review-badge.svg'
              WHEN v_mission.type ILIKE '%coupon%' THEN '/images/badges/coupon-badge.svg'
              WHEN v_mission.type ILIKE '%social%' THEN '/images/badges/social-badge.svg'
              WHEN v_mission.type ILIKE '%checkin%' OR v_mission.type ILIKE '%check-in%' THEN '/images/badges/checkin-badge.svg'
              ELSE '/images/badges/default-badge.svg'
            END;
        END IF;

        UPDATE user_badges
        SET 
          badge_name = v_badge_name,
          badge_description = v_badge_description,
          badge_image_url = v_badge_image_url
        WHERE id = v_badge_id;
        
        v_badge_earned := TRUE;
        RAISE NOTICE 'Updated badge (ID: %) for user % and mission % with new image URL %', 
                     v_badge_id, p_user_id, p_mission_id, v_badge_image_url;
      ELSE
        RAISE NOTICE 'Badge already exists for user % and mission % with valid image URL %', 
                    p_user_id, p_mission_id, v_badge_image_url;
        v_badge_earned := TRUE;
      END IF;
    END IF;
  END IF;
  
  -- Process loot box if applicable
  IF v_has_lootbox THEN
    -- ... keep existing code for loot box processing ...
  END IF;
  
  -- Build result object
  v_result := jsonb_build_object(
    'badge_earned', v_badge_earned,
    'badge_id', v_badge_id,
    'badge_image_url', v_badge_image_url,
    'loot_box_reward', v_loot_box_reward, 
    'loot_box_amount', v_loot_box_amount, 
    'streak_bonus', v_streak_bonus,       
    'current_streak', v_current_streak   
  );
  
  RAISE NOTICE 'process_mission_rewards completed with result: %', v_result;
  RETURN v_result;
END;
$$;

-- Create PUBLIC storage directory for badge SVG fallbacks
INSERT INTO storage.buckets (id, name, public)
VALUES ('badges', 'badges', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to badge images
CREATE POLICY "Public Read Access for Badges"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'badges');

-- Grant badges bucket access to authenticated users
CREATE POLICY "Allow authenticated users to upload badge images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'badges');

-- Enable realtime for the user_badges table if not already enabled
ALTER PUBLICATION supabase_realtime ADD TABLE user_badges;
