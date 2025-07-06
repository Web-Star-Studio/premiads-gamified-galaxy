import { getSupabaseClient } from '@/lib/supabaseClient'
import { withPerformanceMonitoring as withPerf } from '@/utils/performance-monitor'

export interface Transaction {
  id: string
  user_id: string
  type: string
  amount: number
  metadata?: any
  created_at: string
}

export const getUserTransactions = withPerf(
  async ({ userId, type, limit }: { userId: string; type?: string; limit?: number }): Promise<Transaction[]> => {
    const supabase = await getSupabaseClient()
    let query = supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (type) query = query.eq('type', type)
    if (limit) query = query.limit(limit)
    const { data, error } = await query
    if (error) throw error
    return data as Transaction[]
  },
  'getUserTransactions'
)

export const createTransaction = withPerf(
  async ({ userId, type, amount, metadata }: { userId: string; type: string; amount: number; metadata?: any }): Promise<Transaction> => {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('transactions')
      .insert({ user_id: userId, type, amount, metadata })
      .single()
    if (error) throw error
    return data as Transaction
  },
  'createTransaction'
) 