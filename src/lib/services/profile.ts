import { getSupabaseClient } from '@/lib/supabaseClient'
import { withPerformanceMonitoring as withPerf } from '@/utils/performance-monitor'

export interface ProfileData {
  id: string
  full_name: string
  rifas: number
  cashback_balance: number
  profile_completed: boolean
}

export const getUserProfile = withPerf(
  async ({ userId }: { userId: string }): Promise<ProfileData> => {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, rifas, cashback_balance, profile_completed')
      .eq('id', userId)
      .single()
    if (error) throw error
    if (!data) throw new Error('Profile not found')
    return data
  },
  'getUserProfile'
)

export const updateUserProfile = withPerf(
  async ({ userId, updates }: { userId: string; updates: Partial<ProfileData> }): Promise<ProfileData> => {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .single()
    if (error) throw error
    if (!data) throw new Error('Profile update failed')
    return data
  },
  'updateUserProfile'
) 