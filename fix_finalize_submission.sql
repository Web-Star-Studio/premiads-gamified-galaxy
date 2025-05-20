
-- Update the finalize_submission function to call process_mission_rewards internally
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
        BEGIN
          SELECT process_mission_rewards(
            p_submission_id, 
            v_participant_id, 
            v_mission_id
          ) INTO v_reward_result;
          
          RAISE NOTICE 'Processed additional rewards: %', v_reward_result;
        EXCEPTION WHEN OTHERS THEN
          RAISE WARNING 'Error processing additional rewards: %', SQLERRM;
        END;
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
        BEGIN
          SELECT process_mission_rewards(
            p_submission_id, 
            v_participant_id, 
            v_mission_id
          ) INTO v_reward_result;
          
          RAISE NOTICE 'Processed additional rewards: %', v_reward_result;
        EXCEPTION WHEN OTHERS THEN
          RAISE WARNING 'Error processing additional rewards: %', SQLERRM;
        END;
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
