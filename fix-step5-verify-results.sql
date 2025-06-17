-- Passo 5: Verificar resultados das correções de segurança
-- Execute este script para confirmar que tudo foi aplicado corretamente

-- Verificar tabelas com RLS habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Verificar políticas RLS
SELECT tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Verificar funções com security definer e search_path
SELECT proname, prosecdef, proconfig
FROM pg_proc
WHERE prosecdef = true  -- security definer
AND proname IN ('get_user_profile', 'create_campaign_and_debit_credits');

-- Resultado final
SELECT '✅ Security fixes verification complete!' AS result; 