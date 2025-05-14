// Serviço para obter as configurações do Supabase da Edge Function

// Cache das configurações para não ficar fazendo chamadas repetitivas
let configCache: { supabaseUrl: string; supabaseAnonKey: string } | null = null;

// Valores diretos para evitar problemas de CORS
const SUPABASE_URL = "https://zfryjwaeojccskfiibtq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpmcnlqd2Flb2pjY3NrZmlpYnRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNzA1MDAsImV4cCI6MjA2MDg0NjUwMH0.tgN7P0_QIgNu1ezptyJIKtYGRyOJSxV_skDn0WrVlN8";

// Valores padrão a serem usados em caso de falha na Edge Function
const DEFAULT_URL = import.meta.env.VITE_SUPABASE_URL || SUPABASE_URL;
const DEFAULT_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY;

// Função para obter as configurações
export const getSupabaseConfig = async () => {
  // Se já tivermos as configurações em cache, retornamos elas
  if (configCache) {
    return configCache;
  }

  try {
    // MUDANÇA: Usar os valores diretamente ao invés de chamar a Edge Function
    // Isso resolve problemas de CORS durante o desenvolvimento
    configCache = {
      supabaseUrl: DEFAULT_URL,
      supabaseAnonKey: DEFAULT_KEY
    };
    return configCache;

    /* Código original comentado para referência futura
    // URL da Edge Function do Supabase
    // Em desenvolvimento, você pode definir estas variáveis no .env.local como fallback
    const functionUrl = import.meta.env.VITE_FUNCTION_URL || 'https://zfryjwaeojccskfiibtq.supabase.co/functions/v1/get-config';
    
    // Chama a Edge Function
    const response = await fetch(functionUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.warn('Falha ao obter configurações da Edge Function, usando valores default:', await response.text());
      // Se houve erro, usamos as variáveis de ambiente locais como fallback
      configCache = {
        supabaseUrl: DEFAULT_URL,
        supabaseAnonKey: DEFAULT_KEY
      };
      return configCache;
    }
    
    // Parse da resposta como JSON
    const config = await response.json();
    
    // Verifica se a resposta contém os campos necessários
    if (!config.supabaseUrl || !config.supabaseAnonKey) {
      console.warn('Configurações da Edge Function incompletas, usando valores default:', config);
      configCache = {
        supabaseUrl: DEFAULT_URL,
        supabaseAnonKey: DEFAULT_KEY
      };
      return configCache;
    }
    
    // Armazena em cache
    configCache = config;
    
    return config;
    */
  } catch (error) {
    console.error('Erro ao obter configurações do Supabase:', error);
    
    // Em caso de erro, usamos as variáveis de ambiente locais como fallback
    configCache = {
      supabaseUrl: DEFAULT_URL,
      supabaseAnonKey: DEFAULT_KEY
    };
    return configCache;
  }
}; 