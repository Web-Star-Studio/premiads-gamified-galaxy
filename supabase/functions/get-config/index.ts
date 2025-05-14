// Retorna as configurações necessárias para o frontend
// Apenas a chave anon é retornada por questões de segurança
// @deno-types="https://deno.land/std@0.168.0/http/server.ts"
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

import { corsHeaders } from '../_shared/cors.ts';

// Deno namespace declaration
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

// Função principal que serve as requisições
serve(async (req) => {
  // Lidar com requisições CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Remova qualquer verificação de autorização
  // A função abaixo não verifica cabeçalhos de autorização

  try {
    // Obtém as variáveis de ambiente
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return new Response(
        JSON.stringify({ error: 'Variáveis de ambiente não configuradas corretamente' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Retorna as configurações
    return new Response(
      JSON.stringify({ supabaseUrl, supabaseAnonKey }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}); 