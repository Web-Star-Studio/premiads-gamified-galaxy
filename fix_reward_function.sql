
CREATE OR REPLACE FUNCTION process_mission_rewards(p_submission_id uuid, p_user_id uuid, p_mission_id uuid)
RETURNS jsonb AS $$
DECLARE
  v_mission RECORD;
  v_points INTEGER;
  v_streak_bonus NUMERIC := 0;
  v_current_streak INTEGER := 1;
  v_streak_record RECORD;
  v_loot_box_reward TEXT := NULL;
  v_loot_box_amount NUMERIC := 0;
  v_result JSONB;
  v_has_badge BOOLEAN;
  v_has_lootbox BOOLEAN;
  v_sequence_bonus BOOLEAN;
  v_streak_multiplier NUMERIC;
  v_badge_exists BOOLEAN;
BEGIN
  -- Get mission details
  SELECT 
    points, 
    has_badge, 
    has_lootbox, 
    sequence_bonus,
    COALESCE(streak_multiplier, 1.2) as streak_multiplier,
    title
  INTO v_mission
  FROM missions
  WHERE id = p_mission_id;
  
  RAISE NOTICE 'Mission details: %', v_mission;
  
  -- Set mission values to variables for easier reference
  v_points := v_mission.points;
  v_has_badge := v_mission.has_badge;
  v_has_lootbox := v_mission.has_lootbox;
  v_sequence_bonus := v_mission.sequence_bonus;
  v_streak_multiplier := v_mission.streak_multiplier;
  
  -- Process streak bonus if enabled
  IF v_sequence_bonus THEN
    -- Check if streak record exists
    SELECT * INTO v_streak_record
    FROM daily_streaks
    WHERE user_id = p_user_id AND mission_id = p_mission_id;
    
    IF FOUND THEN
      -- Check if this is a consecutive day completion
      IF (now()::date - v_streak_record.last_completion_date::date) = 1 THEN
        -- Increment streak
        v_current_streak := v_streak_record.current_streak + 1;
        
        -- Update max streak if needed
        IF v_current_streak > v_streak_record.max_streak THEN
          UPDATE daily_streaks
          SET 
            current_streak = v_current_streak,
            max_streak = v_current_streak,
            last_completion_date = now()
          WHERE id = v_streak_record.id;
        ELSE
          UPDATE daily_streaks
          SET 
            current_streak = v_current_streak,
            last_completion_date = now()
          WHERE id = v_streak_record.id;
        END IF;
      ELSE
        -- If not consecutive, reset streak to 1
        v_current_streak := 1;
        
        UPDATE daily_streaks
        SET 
          current_streak = 1,
          last_completion_date = now()
        WHERE id = v_streak_record.id;
      END IF;
    ELSE
      -- Create new streak record
      INSERT INTO daily_streaks (
        user_id,
        mission_id,
        current_streak,
        max_streak,
        last_completion_date
      ) VALUES (
        p_user_id,
        p_mission_id,
        1,
        1,
        now()
      );
    END IF;
    
    -- Apply streak bonus if streak > 1
    IF v_current_streak > 1 THEN
      v_streak_bonus := v_points * (v_streak_multiplier - 1) * v_current_streak;
      v_points := v_points + v_streak_bonus;
    END IF;
  END IF;
  
  -- Process badge if enabled
  IF v_has_badge THEN
    -- Check if badge already exists for this user and mission
    SELECT EXISTS (
      SELECT 1 FROM user_badges
      WHERE user_id = p_user_id AND mission_id = p_mission_id
    ) INTO v_badge_exists;
    
    RAISE NOTICE 'Badge exists: %', v_badge_exists;
    
    -- Create badge if it doesn't exist
    IF NOT v_badge_exists THEN
      -- Create badge
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
        v_mission.title || ' Badge',
        'Earned for completing the ' || v_mission.title || ' mission',
        NULL, -- Image URL can be updated later
        NOW()
      );
      
      RAISE NOTICE 'Created new badge for user % and mission %', p_user_id, p_mission_id;
    END IF;
  END IF;
  
  -- Process loot box if enabled
  IF v_has_lootbox THEN
    -- Determine random reward (XP bonus, token multiplier, instant level-up)
    CASE floor(random() * 3) + 1
      WHEN 1 THEN
        v_loot_box_reward := 'xp_bonus';
        v_loot_box_amount := floor(random() * 50) + 10; -- 10-60 XP bonus
        
        -- Add XP bonus to user's points
        UPDATE profiles
        SET points = points + v_loot_box_amount
        WHERE id = p_user_id;
        
      WHEN 2 THEN
        v_loot_box_reward := 'token_multiplier';
        v_loot_box_amount := 1.5; -- 1.5x token multiplier
        
        -- Apply token multiplier to the mission points
        v_points := v_points * v_loot_box_amount;
        
      WHEN 3 THEN
        v_loot_box_reward := 'instant_level_up';
        v_loot_box_amount := 1; -- 1 level up
        
        -- This would need additional logic to handle level up
        -- For now, just add a fixed bonus
        UPDATE profiles
        SET points = points + 100
        WHERE id = p_user_id;
        
        v_loot_box_amount := 100; -- Representing 100 points for level up
    END CASE;
    
    -- Record loot box reward
    INSERT INTO loot_box_rewards (
      user_id,
      mission_id,
      reward_type,
      reward_amount,
      awarded_at
    ) VALUES (
      p_user_id,
      p_mission_id,
      v_loot_box_reward,
      v_loot_box_amount,
      NOW()
    );
    
    RAISE NOTICE 'Created loot box reward: % with amount % for user %', v_loot_box_reward, v_loot_box_amount, p_user_id;
  END IF;
  
  -- Update user's points
  UPDATE profiles
  SET points = points + v_points
  WHERE id = p_user_id;
  
  -- Record mission reward
  INSERT INTO mission_rewards (
    user_id,
    mission_id,
    submission_id,
    points_earned,
    rewarded_at
  ) VALUES (
    p_user_id,
    p_mission_id,
    p_submission_id,
    v_points,
    NOW()
  );
  
  -- Build result
  v_result := jsonb_build_object(
    'points', v_points,
    'streak_bonus', v_streak_bonus,
    'current_streak', v_current_streak,
    'badge_earned', v_has_badge,
    'loot_box_reward', v_loot_box_reward,
    'loot_box_amount', v_loot_box_amount
  );
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql;
