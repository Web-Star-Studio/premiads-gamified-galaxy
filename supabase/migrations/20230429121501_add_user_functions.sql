
-- Function to update user type
CREATE OR REPLACE FUNCTION update_user_type(user_id UUID, new_type TEXT, mark_completed BOOLEAN)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles 
  SET 
    user_type = new_type,
    profile_completed = CASE WHEN mark_completed THEN true ELSE profile_completed END,
    updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create a user profile
CREATE OR REPLACE FUNCTION create_user_profile(user_id UUID, full_name TEXT, user_type TEXT, mark_completed BOOLEAN)
RETURNS VOID AS $$
BEGIN
  INSERT INTO profiles(
    id, 
    full_name, 
    user_type, 
    profile_completed
  ) 
  VALUES (
    user_id,
    full_name,
    user_type,
    mark_completed
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
