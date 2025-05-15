/**
 * Configuração centralizada para funções Edge do Supabase
 * Este arquivo gerencia o acesso seguro às variáveis de ambiente
 */
import { corsHeaders } from './cors.ts';

/**
 * Obtém uma variável de ambiente de forma segura
 * @param key Nome da variável de ambiente
 * @param defaultValue Valor padrão caso a variável não exista
 * @returns O valor da variável de ambiente ou o valor padrão
 */
export function getEnv(key: string, defaultValue: string = ''): string {
  return Deno.env.get(key) || defaultValue
}

/**
 * Configuração do Supabase
 */
export const supabaseConfig = {
  url: getEnv('SUPABASE_URL'),
  serviceRoleKey: getEnv('SUPABASE_SERVICE_ROLE_KEY'),
  anonKey: getEnv('SUPABASE_ANON_KEY'),
}

/**
 * Configuração do Stripe
 */
export const stripeConfig = {
  secretKey: getEnv('STRIPE_SECRET_KEY'),
  webhookSecret: getEnv('STRIPE_WEBHOOK_SECRET', ''),
  apiVersion: '2023-10-16' as const,
}

// Exporta o corsHeaders do arquivo cors.ts
export { corsHeaders }; 