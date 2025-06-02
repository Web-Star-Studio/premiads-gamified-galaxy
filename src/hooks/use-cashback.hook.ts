import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../integrations/supabase/client'

const CASHBACK_BALANCE_KEY = ['cashback', 'balance']
const CASHBACK_HISTORY_KEY = ['cashback', 'history']

export function useCashback() {
  const queryClient = useQueryClient()

  const balanceQuery = useQuery({
    queryKey: CASHBACK_BALANCE_KEY,
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser()
      const userId = userData?.user?.id
      if (!userId) return 0

      const { data, error } = await supabase
        .rpc('get_user_cashback_balance', { user_id: userId })
      if (error) throw error
      return data?.[0]?.cashback_balance ?? 0
    }
  })

  const historyQuery = useQuery({
    queryKey: CASHBACK_HISTORY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cashback_redemptions')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data ?? []
    }
  })

  const withdraw = useMutation({
    mutationFn: async (amount: number) => {
      const { data: userData } = await supabase.auth.getUser()
      const userId = userData?.user?.id
      if (!userId) throw new Error('Usuário não autenticado')

      // @ts-ignore até função RPC existir
      const { error } = await supabase.rpc('redeem_cashback', {
        p_amount: amount,
        p_user_id: userId,
        p_campaign_id: null
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CASHBACK_BALANCE_KEY })
      queryClient.invalidateQueries({ queryKey: CASHBACK_HISTORY_KEY })
    }
  })

  return {
    balance: balanceQuery.data ?? 0,
    history: historyQuery.data ?? [],
    isLoading: balanceQuery.isLoading || historyQuery.isLoading,
    withdraw: withdraw.mutateAsync
  }
} 