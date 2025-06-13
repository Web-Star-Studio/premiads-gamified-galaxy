-- Migration: Implementa função update_user_status para ativar/desativar usuários
-- Esta função atualiza o status do usuário tanto na tabela profiles quanto em auth.users

DROP FUNCTION IF EXISTS public.update_user_status(text, boolean);
DROP FUNCTION IF EXISTS public.update_user_status(uuid, boolean);

CREATE OR REPLACE FUNCTION public.update_user_status(
  user_id UUID,
  is_active BOOLEAN
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Atualiza o campo 'active' na tabela profiles
  UPDATE public.profiles
  SET active = is_active
  WHERE id = user_id;

  -- Se o usuário deve ser banido, define ban_duration para 100 anos
  -- Se o usuário deve ser ativado, remove o banimento
  IF NOT is_active THEN
    UPDATE auth.users
    SET banned_until = NOW() + INTERVAL '100 years'
    WHERE id = user_id;
  ELSE
    UPDATE auth.users
    SET banned_until = NULL
    WHERE id = user_id;
  END IF;

  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Falha ao atualizar status do usuário %: %', user_id, SQLERRM;
    RAISE EXCEPTION 'Ocorreu um erro ao atualizar o status do usuário. SQLSTATE: %', SQLSTATE;
END;
$$; 