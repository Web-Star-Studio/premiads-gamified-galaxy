import { getSupabaseClient } from '@/lib/supabaseClient'
import { withPerformanceMonitoring as withPerf } from '@/utils/performance-monitor'
import type { Database } from '@/types/supabase.generated'

/**
 * Get raffle numbers for a user
 */
export const getUserRaffleNumbers = withPerf(
  async ({ userId }: { userId: string }) => {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('raffle_numbers')
      .select(`*, raffles(title, description, draw_date)`)  
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },
  'getUserRaffleNumbers'
)

/**
 * Create a raffle number entry
 */
export const createRaffleNumber = withPerf(
  async (raffleNumber: Database['public']['Tables']['raffle_numbers']['Insert']) => {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('raffle_numbers')
      .insert(raffleNumber)
      .select()
      .single()
    if (error) throw error
    return data
  },
  'createRaffleNumber'
) 