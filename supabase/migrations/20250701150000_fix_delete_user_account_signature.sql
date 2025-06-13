-- Migration: Remove overload ambiguity e define delete_user_account com UUID

-- Drop overloads text e uuid se existirem
DROP FUNCTION IF EXISTS public.delete_user_account(TEXT);
DROP FUNCTION IF EXISTS public.delete_user_account(UUID);

-- Cria função delete_user_account apenas com parametro UUID
CREATE FUNCTION public.delete_user_account(
  target_user_id UUID
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Deleta o perfil (cascata via FKs configurados)
  DELETE FROM public.profiles WHERE id = target_user_id;

  -- Deleta usuário no schema auth
  DELETE FROM auth.users WHERE id = target_user_id;

  RETURN true;
EXCEPTION
  WHEN foreign_key_violation THEN
    RAISE EXCEPTION 'Cannot delete user because they have related data in the system. Consider deactivating the user instead.';
END;
$$; 