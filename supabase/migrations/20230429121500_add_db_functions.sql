
-- Function to update user credits
CREATE OR REPLACE FUNCTION update_user_credits(user_id UUID, new_credits INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles 
  SET 
    credits = new_credits,
    updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get mission submissions
CREATE OR REPLACE FUNCTION get_mission_submissions(mission_ids UUID[], status_filter TEXT)
RETURNS SETOF jsonb AS $$
DECLARE
  result jsonb;
BEGIN
  FOR result IN
    SELECT jsonb_build_object(
      'id', s.id,
      'user_id', s.user_id,
      'user_name', p.full_name,
      'mission_id', s.mission_id,
      'mission_title', m.title,
      'submission_data', s.content,
      'status', s.status,
      'submitted_at', s.created_at,
      'feedback', s.points_awarded
    )
    FROM submissions s
    JOIN profiles p ON s.user_id = p.id
    JOIN missions m ON s.mission_id = m.id
    WHERE s.mission_id = ANY(mission_ids)
    AND s.status = status_filter
    ORDER BY s.created_at DESC
  LOOP
    RETURN NEXT result;
  END LOOP;
  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update submission status
CREATE OR REPLACE FUNCTION update_submission_status(submission_id UUID, new_status TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE submissions 
  SET 
    status = new_status,
    updated_at = NOW()
  WHERE id = submission_id;
  
  -- If approved, award points from the mission
  IF new_status = 'approved' THEN
    WITH sub_mission AS (
      SELECT s.user_id, m.points
      FROM submissions s
      JOIN missions m ON s.mission_id = m.id
      WHERE s.id = submission_id
    )
    UPDATE profiles p
    SET points = COALESCE(p.points, 0) + sm.points
    FROM sub_mission sm
    WHERE p.id = sm.user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to drop a table if it exists (used for cleanup)
CREATE OR REPLACE FUNCTION drop_table_if_exists(table_name TEXT)
RETURNS VOID AS $$
BEGIN
  EXECUTE format('DROP TABLE IF EXISTS %I CASCADE', table_name);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
