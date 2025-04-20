
CREATE OR REPLACE FUNCTION public.get_all_users()
RETURNS SETOF json 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the current user has admin role
  IF EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND user_type = 'admin'
  ) THEN
    RETURN QUERY 
    SELECT 
      json_build_object(
        'id', au.id,
        'email', au.email,
        'created_at', au.created_at,
        'last_sign_in_at', au.last_sign_in_at
      )
    FROM auth.users au;
  ELSE
    -- Return empty set for non-admin users
    RETURN;
  END IF;
END;
$$;
