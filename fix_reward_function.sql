CREATE OR REPLACE FUNCTION process_mission_rewards(p_submission_id uuid, p_user_id uuid, p_mission_id uuid)
RETURNS jsonb AS $$
DECLARE
  v_mission RECORD;
  v_tickets INTEGER := 0;
  v_cashback NUMERIC(10,2) := 0;
  v_loot_box_reward TEXT := NULL;
  v_loot_box_amount NUMERIC := 0;
  v_result JSONB;
  v_has_badge BOOLEAN;
  v_has_lootbox BOOLEAN;
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

  -- Buscar dados da missão (tickets e cashback)
  SELECT 
    tickets_reward,
    cashback_reward,
    has_badge,
    has_lootbox,
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
      'tickets_earned', 0,
      'cashback_earned', 0,
      'error', 'Mission not found'
    );
  END IF;

  v_tickets := v_mission.tickets_reward;
  v_cashback := v_mission.cashback_reward;
  v_has_badge := v_mission.has_badge;
  v_has_lootbox := v_mission.has_lootbox;

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
        
        v_tickets := v_tickets * v_loot_box_amount;
        RAISE NOTICE 'Applied token multiplier: tickets now %', v_tickets;
        
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
  SET points = points + v_tickets
  WHERE id = p_user_id;
  RAISE NOTICE 'Updated user % profile with % tickets', p_user_id, v_tickets;
  
  -- Record the reward
  INSERT INTO mission_rewards (
    user_id,
    mission_id,
    submission_id,
    tickets_earned,
    cashback_earned,
    rewarded_at
  ) VALUES (
    p_user_id,
    p_mission_id,
    p_submission_id,
    v_tickets,
    v_cashback,
    NOW()
  );
  RAISE NOTICE 'Recorded mission reward of % tickets and % cashback for user %', v_tickets, v_cashback, p_user_id;

  -- Build result object
  v_result := jsonb_build_object(
    'badge_earned', v_badge_earned,
    'badge_id', v_badge_id,
    'loot_box_reward', v_loot_box_reward, 
    'loot_box_amount', v_loot_box_amount, 
    'tickets_earned', v_tickets,
    'cashback_earned', v_cashback
  );
  
  RAISE NOTICE 'process_mission_rewards completed with result: %', v_result;
  RETURN v_result;
END;
$$ LANGUAGE plpgsql;
