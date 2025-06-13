-- Migration: Corrige usuários banidos incorretamente no Supabase Auth
-- Esta migração resolve o erro 400 Bad Request em /auth/v1/token?grant_type=password

-- 1. Resetar o campo banned_until para NULL em todos os usuários na tabela auth.users
UPDATE auth.users
SET banned_until = NULL
WHERE banned_until IS NOT NULL;

-- 2. Garantir que todos os perfis ativos tenham seus usuários correspondentes não banidos
UPDATE auth.users u
SET banned_until = NULL
FROM public.profiles p
WHERE u.id = p.id AND p.active = true;

-- 3. Resetar especificamente o usuário jwitortech@gmail.com
UPDATE auth.users
SET banned_until = NULL
WHERE email = 'jwitortech@gmail.com';

-- 4. Garantir que o usuário jwitortech@gmail.com tenha o perfil ativo
UPDATE public.profiles p
SET active = true
FROM auth.users u
WHERE p.id = u.id AND u.email = 'jwitortech@gmail.com';

-- 5. Log para confirmar a execução
DO $$
BEGIN
  RAISE NOTICE 'Banimentos de usuários resetados com sucesso.';
END $$; 