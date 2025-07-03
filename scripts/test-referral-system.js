/**
 * Script para testar o sistema de referência dinâmico
 * Execute: node scripts/test-referral-system.js
 */

const testCodes = [
  'ALEE2025',
  'NOVO2025', 
  'FELIPEGSANTUNES2025',
  'RET2025',
  'CHESTER2025',
  'JÃO2025',
  'LUCAS2025',
  'INVALID_CODE',
  ''
];

async function testReferralValidation() {
  console.log('🧪 Testando sistema de referência dinâmico...\n');
  
  const supabaseUrl = 'https://zfryjwaeojccskfiibtq.supabase.co';
  const edgeFunctionUrl = `${supabaseUrl}/functions/v1/referral-system`;
  
  for (const code of testCodes) {
    try {
      console.log(`📋 Testando código: "${code}"`);
      
      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpmcnlqd2Flb2pjY3NrZmlpYnRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NjM0MzUsImV4cCI6MjA1MDUzOTQzNX0.7ZJYGfJHWbJmNxCzGlPLn4Ck3b8P8PYM8Ue3SG_lZ2o'
        },
        body: JSON.stringify({
          action: 'validate_code',
          referralCode: code
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ Válido - Proprietário: ${result.data.ownerName} (${result.data.ownerId})`);
      } else {
        console.log(`❌ Inválido - Erro: ${result.error}`);
      }
      
    } catch (error) {
      console.log(`💥 Erro de rede: ${error.message}`);
    }
    
    console.log(''); // Linha em branco
  }
}

async function testStatsRetrieval() {
  console.log('📊 Testando busca de estatísticas...\n');
  
  const supabaseUrl = 'https://zfryjwaeojccskfiibtq.supabase.co';
  const edgeFunctionUrl = `${supabaseUrl}/functions/v1/referral-system`;
  
  // Testar com ID do Lucas (que tem indicações)
  const lucasId = '6f132581-ca55-4770-a32d-f3e5b70e65bd';
  
  try {
    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpmcnlqd2Flb2pjY3NrZmlpYnRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NjM0MzUsImV4cCI6MjA1MDUzOTQzNX0.7ZJYGfJHWbJmNxCzGlPLn4Ck3b8P8PYM8Ue3SG_lZ2o'
      },
      body: JSON.stringify({
        action: 'get_stats',
        userId: lucasId
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Estatísticas do Lucas:');
      console.log(`   📈 Total de convites: ${result.data.totalConvites}`);
      console.log(`   ⏳ Pendentes: ${result.data.pendentes}`);
      console.log(`   ✅ Registrados: ${result.data.registrados}`);
      console.log(`   🎯 Pontos ganhos: ${result.data.pontosGanhos}`);
    } else {
      console.log(`❌ Erro ao buscar estatísticas: ${result.error}`);
    }
    
  } catch (error) {
    console.log(`💥 Erro de rede: ${error.message}`);
  }
}

// Executar testes
async function runTests() {
  console.log('🚀 Iniciando testes do sistema de referência...\n');
  
  await testReferralValidation();
  await testStatsRetrieval();
  
  console.log('✨ Testes concluídos!');
}

// Executar apenas se for chamado diretamente
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testReferralValidation, testStatsRetrieval }; 