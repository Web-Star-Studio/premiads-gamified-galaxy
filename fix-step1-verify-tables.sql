-- Passo 1: Verificar quais tabelas existem
-- Execute este script primeiro para ver quais tabelas você tem

-- Lista todas as tabelas no schema public
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Verificar se a função create_campaign_and_debit_credits existe
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'create_campaign_and_debit_credits'; 