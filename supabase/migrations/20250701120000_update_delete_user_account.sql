-- Migration: Atualiza a função delete_user_account para deletar perfil e usuário em cascata

DROP FUNCTION IF EXISTS public.delete_user_account(text);

CREATE FUNCTION public.delete_user_account(
  target_user_id TEXT
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_uid UUID := target_user_id::uuid;
BEGIN
  -- Deleta o perfil (cascata nas tabelas que referenciam profiles.id com ON DELETE CASCADE)
  DELETE FROM public.profiles WHERE id = v_uid;

  -- Deleta o usuário na schema auth
  DELETE FROM auth.users WHERE id = v_uid;

  RETURN true;
EXCEPTION
  WHEN foreign_key_violation THEN
    RAISE EXCEPTION 'Cannot delete user because they have related data in the system. Consider deactivating the user instead.';
END;
$$; 