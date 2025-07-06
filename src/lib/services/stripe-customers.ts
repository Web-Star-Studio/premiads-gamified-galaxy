import { getSupabaseClient } from '@/lib/supabaseClient'
import { withPerformanceMonitoring as withPerf } from '@/utils/performance-monitor'

export interface StripeCustomer {
  id: string
  user_id: string
  stripe_id: string
  created_at?: string
}

export const getOrCreateStripeCustomer = withPerf(
  async ({ userId, stripeId }: { userId: string; stripeId?: string }): Promise<StripeCustomer> => {
    const supabase = await getSupabaseClient()
    if (stripeId) {
      const { data, error } = await supabase
        .from('stripe_customers')
        .upsert({ user_id: userId, stripe_id: stripeId })
        .select()
        .single()
      if (error) throw error
      return data as StripeCustomer
    }
    const { data, error } = await supabase
      .from('stripe_customers')
      .select('*')
      .eq('user_id', userId)
      .single()
    if (error && (error as any).code !== 'PGRST116') throw error
    return data as StripeCustomer
  },
  'getOrCreateStripeCustomer'
) 