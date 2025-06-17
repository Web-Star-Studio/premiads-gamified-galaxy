-- Passo 2: Habilitar RLS nas tabelas existentes
-- Execute este script após verificar quais tabelas existem

-- Habilitar RLS em tabelas comuns (ajuste conforme resultado do passo 1)
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.mission_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.mission_validation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.mission_rewards ENABLE ROW LEVEL SECURITY;

-- Tabelas de cashback
ALTER TABLE IF EXISTS public.user_cashbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cashback_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cashback_redemptions ENABLE ROW LEVEL SECURITY;

-- Verificar resultado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename; 