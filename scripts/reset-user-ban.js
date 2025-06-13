#!/usr/bin/env node

/**
 * Script para resetar o banimento de um usuário no Supabase
 * Uso: npm run supabase:reset-ban -- <email>
 */

const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const SUPABASE_URL = "https://zfryjwaeojccskfiibtq.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('\x1b[31m%s\x1b[0m', 'Erro: SUPABASE_SERVICE_KEY não definida!');
  console.log('Por favor, defina a variável de ambiente SUPABASE_SERVICE_KEY com a chave de serviço do Supabase.');
  console.log('Exemplo: SUPABASE_SERVICE_KEY=eyJh... npm run supabase:reset-ban -- usuario@email.com');
  process.exit(1);
}

// Obter email do usuário dos argumentos da linha de comando
const userEmail = process.argv[2];

if (!userEmail) {
  console.error('\x1b[31m%s\x1b[0m', 'Erro: Email do usuário não fornecido!');
  console.log('Uso: npm run supabase:reset-ban -- usuario@email.com');
  process.exit(1);
}

// Criar cliente Supabase com a chave de serviço (acesso admin)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function resetUserBan() {
  try {
    console.log(`\x1b[33m%s\x1b[0m`, `Resetando banimento para o usuário: ${userEmail}`);
    
    // Chamar a função RPC para resetar o banimento
    const { data, error } = await supabase
      .rpc('reset_user_ban_by_email', { user_email: userEmail });
    
    if (error) throw error;
    
    console.log('\x1b[32m%s\x1b[0m', `✓ Banimento resetado com sucesso para ${userEmail}`);
    console.log('O usuário agora pode fazer login normalmente.');
    
    // Verificar status atual do usuário
    const { data: userData, error: userError } = await supabase.auth.admin.getUserByEmail(userEmail);
    
    if (userError) {
      console.warn('\x1b[33m%s\x1b[0m', `Aviso: Não foi possível verificar o status atual do usuário: ${userError.message}`);
    } else if (userData) {
      console.log('\x1b[36m%s\x1b[0m', 'Informações do usuário:');
      console.log(`- ID: ${userData.user.id}`);
      console.log(`- Email: ${userData.user.email}`);
      console.log(`- Banido até: ${userData.user.banned_until || 'Não banido'}`);
      console.log(`- Confirmado: ${userData.user.email_confirmed_at ? 'Sim' : 'Não'}`);
    }
    
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `Erro ao resetar banimento: ${error.message}`);
    
    if (error.message.includes('não encontrado')) {
      console.log(`O usuário com email ${userEmail} não foi encontrado no sistema.`);
    } else if (error.message.includes('permission denied')) {
      console.log('Erro de permissão. Verifique se a SUPABASE_SERVICE_KEY é válida e tem permissões de admin.');
    }
    
    process.exit(1);
  }
}

resetUserBan(); 