import { getSupabaseClient } from '@/lib/supabaseClient'
import { withPerformanceMonitoring as withPerf } from '@/utils/performance-monitor'
import type { Database } from '@/types/supabase.generated'

/**
 * Fetch mission rewards for a given user
 */
export const getUserRewards = withPerf(
  async ({ userId }: { userId: string }) => {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('mission_rewards')
      .select(`*, missions(title, type)`)  
      .eq('user_id', userId)
      .order('rewarded_at', { ascending: false })
    if (error) throw error
    return data
  },
  'getUserRewards'
) 