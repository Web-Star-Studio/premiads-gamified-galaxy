-- Migration: Reset banned_until para NULL em todos os usuários
-- Esta migração é necessária para corrigir problemas de login de usuários banidos incorretamente

-- Primeiro, atualiza todos os usuários na tabela auth.users para remover o banimento
UPDATE auth.users
SET banned_until = NULL
WHERE banned_until IS NOT NULL;

-- Em seguida, garante que todos os perfis ativos tenham seus usuários correspondentes não banidos
UPDATE auth.users u
SET banned_until = NULL
FROM public.profiles p
WHERE u.id = p.id AND p.active = true;

-- Log para confirmar a execução
DO $$
BEGIN
  RAISE NOTICE 'Banimentos de usuários resetados com sucesso.';
END $$; 