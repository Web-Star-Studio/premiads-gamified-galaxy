import { createClient } from '@supabase/supabase-js';

// Usar valores diretos para evitar problemas com a edge function
const SUPABASE_URL = "https://zfryjwaeojccskfiibtq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpmcnlqd2Flb2pjY3NrZmlpYnRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNzA1MDAsImV4cCI6MjA2MDg0NjUwMH0.tgN7P0_QIgNu1ezptyJIKtYGRyOJSxV_skDn0WrVlN8"

// Criar apenas uma instância do cliente Supabase para todo o aplicativo
export const supabase = createClient(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    },
    global: {
      fetch: (url: RequestInfo | URL, options?: RequestInit) => {
        // Log sem alterar cabeçalhos originais para não remover 'apikey' e 'Authorization'
        console.log('Supabase fetch to:', url)
        console.log('Request method:', options?.method)
        
        return fetch(url, options).catch(err => {
          console.error('Supabase fetch error:', err)
          console.error('URL was:', url)
          throw err
        })
      },
      headers: {
        'X-Client-Info': 'premiads-gamified-galaxy'
      }
    }
  }
);
