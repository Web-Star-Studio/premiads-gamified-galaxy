import { getSupabaseClient } from '@/lib/supabaseClient'
import { withPerformanceMonitoring as withPerf } from '@/utils/performance-monitor'

export interface BadgeRecord {
  id: string
  user_id: string
  mission_id: string
  badge_name: string
  badge_description?: string
  badge_image_url?: string
  earned_at: string
}

export const getUserBadges = withPerf(
  async ({ userId, limit = 50 }: { userId: string; limit?: number }): Promise<BadgeRecord[]> => {
    const supabase = await getSupabaseClient()
    let query = supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false })
    if (limit) query = query.limit(limit)
    const { data, error } = await query
    if (error) throw error
    return data as BadgeRecord[]
  },
  'getUserBadges'
) 