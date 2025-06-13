-- Migration: Solução definitiva para deletar usuário e dados em cascata.
-- Esta função remove sobrecargas, varre dinamicamente TODAS as dependências
-- em `profiles` e `auth.users`, e as remove antes de deletar o usuário.

DROP FUNCTION IF EXISTS public.delete_user_account(TEXT);
DROP FUNCTION IF EXISTS public.delete_user_account(UUID);

CREATE OR REPLACE FUNCTION public.delete_user_account(
  target_user_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  rec RECORD;
BEGIN
  -- 1. Deletar referências em tabelas que apontam para 'public.profiles'
  FOR rec IN
    SELECT kcu.table_schema, kcu.table_name, kcu.column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name AND ccu.table_schema = tc.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY' AND ccu.table_name = 'profiles' AND ccu.column_name = 'id'
  LOOP
    EXECUTE format('DELETE FROM %I.%I WHERE %I = $1', rec.table_schema, rec.table_name, rec.column_name) USING target_user_id;
  END LOOP;

  -- 2. Deletar referências em tabelas que apontam para 'auth.users' (exceto 'profiles')
  FOR rec IN
    SELECT kcu.table_schema, kcu.table_name, kcu.column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name AND ccu.table_schema = tc.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND ccu.table_schema = 'auth' AND ccu.table_name = 'users' AND ccu.column_name = 'id'
      AND kcu.table_name <> 'profiles'
  LOOP
    EXECUTE format('DELETE FROM %I.%I WHERE %I = $1', rec.table_schema, rec.table_name, rec.column_name) USING target_user_id;
  END LOOP;

  -- 3. Agora que as referências foram removidas, deletar o perfil.
  DELETE FROM public.profiles WHERE id = target_user_id;

  -- 4. Finalmente, deletar o usuário do 'auth.users'.
  DELETE FROM auth.users WHERE id = target_user_id;

  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    -- Loga o erro para debug e levanta uma exceção clara.
    RAISE WARNING 'Falha ao deletar usuário %: %', target_user_id, SQLERRM;
    RAISE EXCEPTION 'An error occurred while deleting the user account and its related data. Check server logs for details. SQLSTATE: %', SQLSTATE;
END;
$$; 