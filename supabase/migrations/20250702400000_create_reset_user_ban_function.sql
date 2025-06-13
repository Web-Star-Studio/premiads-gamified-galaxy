-- Migration: Criar função para resetar o banimento de um usuário específico
-- Esta função permite resetar o banimento de um usuário pelo email ou ID

-- Função para resetar banimento por email
DROP FUNCTION IF EXISTS public.reset_user_ban_by_email(text);
CREATE OR REPLACE FUNCTION public.reset_user_ban_by_email(
  user_email TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Encontrar o ID do usuário pelo email
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = user_email;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário com email % não encontrado', user_email;
  END IF;
  
  -- Remover banimento na tabela auth.users
  UPDATE auth.users
  SET banned_until = NULL
  WHERE id = v_user_id;
  
  -- Garantir que o perfil está ativo
  UPDATE public.profiles
  SET active = true
  WHERE id = v_user_id;
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Erro ao resetar banimento: %', SQLERRM;
END;
$$;

-- Função para resetar banimento por ID
DROP FUNCTION IF EXISTS public.reset_user_ban_by_id(uuid);
CREATE OR REPLACE FUNCTION public.reset_user_ban_by_id(
  user_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se o usuário existe
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = user_id) THEN
    RAISE EXCEPTION 'Usuário com ID % não encontrado', user_id;
  END IF;
  
  -- Remover banimento na tabela auth.users
  UPDATE auth.users
  SET banned_until = NULL
  WHERE id = user_id;
  
  -- Garantir que o perfil está ativo
  UPDATE public.profiles
  SET active = true
  WHERE id = user_id;
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Erro ao resetar banimento: %', SQLERRM;
END;
$$; 