import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { getSupabaseConfig } from '@/services/config'

let supabaseClient: SupabaseClient

export async function getSupabaseClient(): Promise<SupabaseClient> {
  if (supabaseClient) return supabaseClient
  const { supabaseUrl, supabaseAnonKey } = await getSupabaseConfig()
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    realtime: { params: { eventsPerSecond: 10 } },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    },
    global: { headers: { 'X-Client-Info': 'premiads-gamified-galaxy' } }
  })
  return supabaseClient
} 