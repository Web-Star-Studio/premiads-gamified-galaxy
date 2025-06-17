-- Script para verificar a estrutura da tabela campaigns
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se a tabela campaigns existe
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'campaigns'
) AS table_exists;

-- 2. Verificar a estrutura da tabela campaigns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'campaigns' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Verificar se o campo advertiser_id existe e seu tipo
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'campaigns' 
AND table_schema = 'public'
AND column_name = 'advertiser_id';

-- 4. Verificar se há registros na tabela
SELECT COUNT(*) AS total_campaigns FROM campaigns;

-- 5. Verificar quantas campanhas têm advertiser_id NULL
SELECT COUNT(*) AS campaigns_without_advertiser
FROM campaigns
WHERE advertiser_id IS NULL;

-- 6. Verificar se há chave estrangeira entre campaigns.advertiser_id e auth.users.id
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM
    information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_name = 'campaigns'
AND kcu.column_name = 'advertiser_id'; 