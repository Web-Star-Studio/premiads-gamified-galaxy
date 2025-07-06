import { getSupabaseClient } from '@/lib/supabaseClient'
import { withPerformanceMonitoring as withPerf } from '@/utils/performance-monitor'
import type { Database } from '@/types/supabase.generated'

// Domain type
type RaffleRow = Database['public']['Tables']['raffles']['Row']

/**
 * Fetch open raffles
 */
export const getOpenRaffles = withPerf(async (): Promise<RaffleRow[]> => {
  const supabase = await getSupabaseClient()
  const { data, error } = await supabase
    .from('raffles')
    .select('*')
    .eq('status', 'open')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as RaffleRow[]
}, 'getOpenRaffles')

/**
 * Buy raffle tickets
 */
export const buyRaffleTickets = withPerf(
  async ({ raffleId, qty }: { raffleId: string; qty: number }) => {
    const supabase = await getSupabaseClient()
    const { error } = await supabase
      .from('raffle_tickets')
      .insert({ raffle_id: raffleId, qty })
    if (error) throw error
  },
  'buyRaffleTickets'
) 