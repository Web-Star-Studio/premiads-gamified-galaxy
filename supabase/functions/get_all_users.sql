
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
        'full_name', p.full_name,
        'user_type', p.user_type,
        'active', COALESCE(p.active, true),
        'avatar_url', p.avatar_url,
        'last_sign_in_at', au.last_sign_in_at,
        'created_at', au.created_at
      )
    FROM auth.users au
    LEFT JOIN public.profiles p ON au.id = p.id;
  ELSE
    -- Return empty set for non-admin users
    RETURN;
  END IF;
END;
$$;
