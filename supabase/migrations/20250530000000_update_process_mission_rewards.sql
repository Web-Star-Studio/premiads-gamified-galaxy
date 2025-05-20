CREATE OR REPLACE FUNCTION process_mission_rewards(p_submission_id uuid, p_user_id uuid, p_mission_id uuid)
RETURNS jsonb AS $$
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

  -- Get mission info
  SELECT 
    points, 
    has_badge, 
    has_lootbox, 
    sequence_bonus,
    COALESCE(streak_multiplier, 1.2) as streak_multiplier,
    title,
    type
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

  RAISE NOTICE 'Mission found: title=%, has_badge=%, has_lootbox=%, sequence_bonus=%', 
               v_mission.title, v_mission.has_badge, v_mission.has_lootbox, v_mission.sequence_bonus;

  v_points := v_mission.points;
  v_has_badge := v_mission.has_badge;
  v_has_lootbox := v_mission.has_lootbox;
  v_sequence_bonus := v_mission.sequence_bonus;
  v_streak_multiplier := v_mission.streak_multiplier;

  -- Process streak if applicable
  IF v_sequence_bonus THEN
    RAISE NOTICE 'Processing sequence bonus for mission %', p_mission_id;
    
    SELECT * INTO v_streak_record
    FROM daily_streaks
    WHERE user_id = p_user_id AND mission_id = p_mission_id;
    
    IF FOUND THEN
      RAISE NOTICE 'Found streak record: current_streak=%, last_completion_date=%', 
                   v_streak_record.current_streak, v_streak_record.last_completion_date;
      
      IF (now()::date - v_streak_record.last_completion_date::date) = 1 THEN
        -- Consecutive day - increment streak
        v_current_streak := v_streak_record.current_streak + 1;
        RAISE NOTICE 'Consecutive day detected, incrementing streak to %', v_current_streak;
        
        IF v_current_streak > v_streak_record.max_streak THEN
          UPDATE daily_streaks
          SET 
            current_streak = v_current_streak,
            max_streak = v_current_streak,
            last_completion_date = now()
          WHERE id = v_streak_record.id;
          RAISE NOTICE 'Updated streak with new max of %', v_current_streak;
        ELSE
          UPDATE daily_streaks
          SET 
            current_streak = v_current_streak,
            last_completion_date = now()
          WHERE id = v_streak_record.id;
          RAISE NOTICE 'Updated streak to %', v_current_streak;
        END IF;
      ELSIF (now()::date - v_streak_record.last_completion_date::date) = 0 THEN
        -- Same day - maintain streak
        v_current_streak := v_streak_record.current_streak;
        RAISE NOTICE 'Same day completion, maintaining streak at %', v_current_streak;
      ELSE
        -- Streak broken - reset to 1
        v_current_streak := 1;
        RAISE NOTICE 'Streak broken, resetting to 1';
        
        UPDATE daily_streaks
        SET 
          current_streak = 1,
          last_completion_date = now()
        WHERE id = v_streak_record.id;
      END IF;
    ELSE
      -- First time - create new streak record
      v_current_streak := 1;
      RAISE NOTICE 'Creating new streak record with initial value 1';
      
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
    
    -- Calculate streak bonus if applicable
    IF v_current_streak > 1 THEN 
      v_streak_bonus := v_mission.points * (v_streak_multiplier - 1) * (v_current_streak - 1); 
      v_points := v_points + v_streak_bonus;
      RAISE NOTICE 'Applied streak bonus: % points for streak of %', v_streak_bonus, v_current_streak;
    END IF;
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

      -- Determine badge image URL based on mission type
      v_badge_image_url := 
        CASE 
          WHEN v_mission.type ILIKE '%photo%' THEN 'https://assets10.lottiefiles.com/packages/lf20_qm8eqtyw.json'
          WHEN v_mission.type ILIKE '%form%' THEN 'https://assets1.lottiefiles.com/packages/lf20_fnjha2ed.json'
          WHEN v_mission.type ILIKE '%video%' THEN 'https://assets3.lottiefiles.com/packages/lf20_2cwdcjsd.json'
          WHEN v_mission.type ILIKE '%survey%' THEN 'https://assets7.lottiefiles.com/packages/lf20_kw2yp2rh.json'
          WHEN v_mission.type ILIKE '%review%' THEN 'https://assets3.lottiefiles.com/packages/lf20_bnfvh5kf.json'
          WHEN v_mission.type ILIKE '%coupon%' THEN 'https://assets10.lottiefiles.com/packages/lf20_uomoou11.json'
          WHEN v_mission.type ILIKE '%social%' THEN 'https://assets9.lottiefiles.com/packages/lf20_wloxwm9w.json'
          WHEN v_mission.type ILIKE '%checkin%' OR v_mission.type ILIKE '%check-in%' THEN 'https://assets3.lottiefiles.com/packages/lf20_9yi1lpr7.json'
          ELSE 'https://assets7.lottiefiles.com/private_files/lf30_bfzkfm07.json'
        END;

      -- Create badge name
      v_badge_name := v_mission.title || ' Badge';
      
      -- Create badge description with some variety
      v_badge_description := (
        CASE floor(random() * 5)::int
          WHEN 0 THEN 'Parabéns! Você completou a missão "' || v_mission.title || '" com sucesso.'
          WHEN 1 THEN 'Conquista desbloqueada por completar a missão "' || v_mission.title || '".'
          WHEN 2 THEN 'Badge especial concedido por sua excelência na missão "' || v_mission.title || '".'
          WHEN 3 THEN 'Sua dedicação na missão "' || v_mission.title || '" foi reconhecida com esta badge.'
          ELSE 'Esta badge celebra sua conquista na missão "' || v_mission.title || '".'
        END
      );
      
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
      RAISE NOTICE 'Created new badge (ID: %) for user % and mission %', v_badge_id, p_user_id, p_mission_id;
    ELSE
      -- Check if badge already exists but doesn't have an image URL
      SELECT id, badge_image_url INTO v_badge_id, v_badge_image_url 
      FROM user_badges
      WHERE user_id = p_user_id AND mission_id = p_mission_id;
      
      IF v_badge_image_url IS NULL THEN
        RAISE NOTICE 'Badge exists but has no image URL, updating badge record: %', v_badge_id;
        
        -- Determine badge image URL based on mission type
        v_badge_image_url := 
          CASE 
            WHEN v_mission.type ILIKE '%photo%' THEN 'https://assets10.lottiefiles.com/packages/lf20_qm8eqtyw.json'
            WHEN v_mission.type ILIKE '%form%' THEN 'https://assets1.lottiefiles.com/packages/lf20_fnjha2ed.json'
            WHEN v_mission.type ILIKE '%video%' THEN 'https://assets3.lottiefiles.com/packages/lf20_2cwdcjsd.json'
            WHEN v_mission.type ILIKE '%survey%' THEN 'https://assets7.lottiefiles.com/packages/lf20_kw2yp2rh.json'
            WHEN v_mission.type ILIKE '%review%' THEN 'https://assets3.lottiefiles.com/packages/lf20_bnfvh5kf.json'
            WHEN v_mission.type ILIKE '%coupon%' THEN 'https://assets10.lottiefiles.com/packages/lf20_uomoou11.json'
            WHEN v_mission.type ILIKE '%social%' THEN 'https://assets9.lottiefiles.com/packages/lf20_wloxwm9w.json'
            WHEN v_mission.type ILIKE '%checkin%' OR v_mission.type ILIKE '%check-in%' THEN 'https://assets3.lottiefiles.com/packages/lf20_9yi1lpr7.json'
            ELSE 'https://assets7.lottiefiles.com/private_files/lf30_bfzkfm07.json'
          END;
          
        -- Create badge name
        v_badge_name := v_mission.title || ' Badge';
        
        -- Create badge description with some variety
        v_badge_description := (
          CASE floor(random() * 5)::int
            WHEN 0 THEN 'Parabéns! Você completou a missão "' || v_mission.title || '" com sucesso.'
            WHEN 1 THEN 'Conquista desbloqueada por completar a missão "' || v_mission.title || '".'
            WHEN 2 THEN 'Badge especial concedido por sua excelência na missão "' || v_mission.title || '".'
            WHEN 3 THEN 'Sua dedicação na missão "' || v_mission.title || '" foi reconhecida com esta badge.'
            ELSE 'Esta badge celebra sua conquista na missão "' || v_mission.title || '".'
          END
        );

        UPDATE user_badges
        SET 
          badge_name = v_badge_name,
          badge_description = v_badge_description,
          badge_image_url = v_badge_image_url
        WHERE id = v_badge_id;
        
        v_badge_earned := TRUE;
        RAISE NOTICE 'Updated badge (ID: %) for user % and mission % with image URL', v_badge_id, p_user_id, p_mission_id;
      ELSE
        RAISE NOTICE 'Badge already exists for user % and mission % with image URL', p_user_id, p_mission_id;
      END IF;
    END IF;
  END IF;
  
  -- Process loot box if applicable
  IF v_has_lootbox THEN
    RAISE NOTICE 'Processing loot box for mission %', p_mission_id;
    
    CASE floor(random() * 3) + 1
      WHEN 1 THEN
        v_loot_box_reward := 'xp_bonus';
        v_loot_box_amount := floor(random() * 50) + 10; 
        RAISE NOTICE 'Selected loot box type: xp_bonus with amount %', v_loot_box_amount;
        
        UPDATE profiles
        SET points = points + v_loot_box_amount
        WHERE id = p_user_id;
        RAISE NOTICE 'Added % XP points to user %', v_loot_box_amount, p_user_id;
        
      WHEN 2 THEN
        v_loot_box_reward := 'token_multiplier';
        v_loot_box_amount := 1.5; 
        RAISE NOTICE 'Selected loot box type: token_multiplier with amount %', v_loot_box_amount;
        
        v_points := v_points * v_loot_box_amount;
        RAISE NOTICE 'Applied token multiplier: points now %', v_points;
        
      WHEN 3 THEN
        v_loot_box_reward := 'instant_level_up';
        v_loot_box_amount := 1; 
        RAISE NOTICE 'Selected loot box type: instant_level_up';
        
        UPDATE profiles
        SET points = points + 100
        WHERE id = p_user_id;
        
        v_loot_box_amount := 100; 
        RAISE NOTICE 'Added 100 level-up points to user %', p_user_id;
    END CASE;
    
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
    ) RETURNING id INTO v_lootbox_id;
    
    RAISE NOTICE 'Created loot box reward (ID: %): % with amount % for user %', 
                 v_lootbox_id, v_loot_box_reward, v_loot_box_amount, p_user_id;
  END IF;
  
  -- Update user points
  UPDATE profiles
  SET points = points + v_points
  WHERE id = p_user_id;
  RAISE NOTICE 'Updated user % profile with % points', p_user_id, v_points;
  
  -- Record the reward
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
  RAISE NOTICE 'Recorded mission reward of % points for user %', v_points, p_user_id;

  -- Build result object
  v_result := jsonb_build_object(
    'badge_earned', v_badge_earned,
    'badge_id', v_badge_id,
    'loot_box_reward', v_loot_box_reward, 
    'loot_box_amount', v_loot_box_amount, 
    'streak_bonus', v_streak_bonus,       
    'current_streak', v_current_streak   
  );
  
  RAISE NOTICE 'process_mission_rewards completed with result: %', v_result;
  RETURN v_result;
END;
$$ LANGUAGE plpgsql;
