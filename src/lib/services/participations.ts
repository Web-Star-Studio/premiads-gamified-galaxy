import { getSupabaseClient } from '@/lib/supabaseClient'
import { withPerformanceMonitoring as withPerf } from '@/utils/performance-monitor'
import type { Database } from '@/types/supabase.generated'

/**
 * Create a participation entry
 */
export const createParticipation = withPerf(
  async (participation: Database['public']['Tables']['participations']['Insert']) => {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('participations')
      .insert(participation)
      .select()
      .single()
    if (error) throw error
    return data
  },
  'createParticipation'
)

/**
 * Fetch participations for a user
 */
export const getUserParticipations = withPerf(
  async ({ userId }: { userId: string }) => {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('participations')
      .select(`*, missions(title, description, type)`)  
      .eq('user_id', userId)
      .order('started_at', { ascending: false })
    if (error) throw error
    return data
  },
  'getUserParticipations'
) 