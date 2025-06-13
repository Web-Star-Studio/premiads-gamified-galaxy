-- Migration: Apaga dados relacionados e deleta usuário e perfil em cascata dinamicamente

DROP FUNCTION IF EXISTS public.delete_user_account(UUID);

CREATE FUNCTION public.delete_user_account(
  target_user_id UUID
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  rec RECORD;
BEGIN
  -- Deleta todas as referências em tabelas que possuem FK para profiles.id
  FOR rec IN
    SELECT
      kcu.table_schema,
      kcu.table_name,
      kcu.column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
     AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage ccu
      ON ccu.constraint_name = tc.constraint_name
     AND ccu.table_schema = tc.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND ccu.table_name = 'profiles'
      AND ccu.column_name = 'id'
  LOOP
    EXECUTE format('DELETE FROM %I.%I WHERE %I = $1', rec.table_schema, rec.table_name, rec.column_name)
    USING target_user_id;
  END LOOP;

  -- Deleta perfil
  DELETE FROM public.profiles WHERE id = target_user_id;

  -- Deleta usuário no schema auth
  DELETE FROM auth.users WHERE id = target_user_id;

  RETURN true;
END;
$$; 