import { useQuery } from '@tanstack/react-query'
import { supabase } from '../integrations/supabase/client'

interface CashbackPreviewData {
  availableBalance: number
  pendingCashback: number
  totalSaved: number
  lastPurchaseDate: string | null
}

export function useCashbackPreview() {
  return useQuery({
    queryKey: ['cashback-preview'],
    queryFn: async (): Promise<CashbackPreviewData> => {
      const { data: userData } = await supabase.auth.getUser()
      const userId = userData?.user?.id
      
      if (!userId) {
        return {
          availableBalance: 0,
          pendingCashback: 0,
          totalSaved: 0,
          lastPurchaseDate: null
        }
      }

      // Get available balance from profiles
      const { data: profileData } = await supabase
        .from('profiles')
        .select('cashback_balance')
        .eq('id', userId)
        .single()

      // Get total cashback data from user_cashbacks
      const { data: cashbackData } = await supabase
        .from('user_cashbacks')
        .select('total_cashback, redeemed_cashback')
        .eq('user_id', userId)
        .single()

      // Get pending cashback (from redemptions with status 'pending')
      const { data: pendingData } = await supabase
        .from('cashback_redemptions')
        .select('amount')
        .eq('user_id', userId)
        .eq('status', 'pending')

      // Get last purchase date (most recent redemption)
      const { data: lastPurchase } = await supabase
        .from('cashback_redemptions')
        .select('created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)

      const availableBalance = profileData?.cashback_balance ?? 0
      const totalCashback = cashbackData?.total_cashback ?? 0
      const redeemedCashback = cashbackData?.redeemed_cashback ?? 0
      const pendingCashback = pendingData?.reduce((sum, item) => sum + (item.amount ?? 0), 0) ?? 0
      const totalSaved = totalCashback
      const lastPurchaseDate = lastPurchase?.[0]?.created_at ?? null

      return {
        availableBalance,
        pendingCashback,
        totalSaved,
        lastPurchaseDate
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
} 