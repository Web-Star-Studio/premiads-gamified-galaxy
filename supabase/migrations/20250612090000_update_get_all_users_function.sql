-- Migration para atualizar a função get_all_users
CREATE OR REPLACE FUNCTION public.get_all_users()
RETURNS SETOF json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF EXISTS (
    SELECT 1
      FROM public.profiles
     WHERE id = auth.uid()
       AND (user_type = 'admin' OR role = 'admin')
  ) THEN
    RETURN QUERY
    SELECT json_build_object(
      'id', au.id::text,
      'email', au.email::text,
      'full_name', COALESCE(p.full_name, '')::text,
      'user_type', COALESCE(p.user_type, 'participante')::text,
      'active', COALESCE(p.active, true),
      'avatar_url', COALESCE(p.avatar_url, '')::text,
      'last_sign_in_at', COALESCE(au.last_sign_in_at::text, '')::text,
      'created_at', au.created_at::text
    )
      FROM auth.users au
 LEFT JOIN public.profiles p ON au.id = p.id;
  END IF;
END;
$$; 