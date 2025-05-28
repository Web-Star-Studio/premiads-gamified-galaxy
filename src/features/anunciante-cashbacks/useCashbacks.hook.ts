import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { CashbackCampaign } from './types'

const TABLE = 'cashback_campaigns'

interface CreateCashbackInput {
  title: string
  description: string
  discount_percentage: number
  minimum_purchase: number | null
  end_date: string
  category: string
  advertiser_logo: string
}

function useCashbacks(advertiserId: string) {
  const queryClient = useQueryClient()

  // Listar campanhas do anunciante
  const {
    data: campaigns,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['cashbacks', advertiserId],
    queryFn: async () => {
      if (!advertiserId) return []
      const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .eq('advertiser_id', advertiserId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as CashbackCampaign[]
    },
    enabled: Boolean(advertiserId)
  })

  // Criar campanha
  const createMutation = useMutation({
    mutationFn: async (input: CreateCashbackInput) => {
      const { minimum_purchase, ...rest } = input
      const { data, error } = await supabase
        .from(TABLE)
        .insert([
          {
            ...rest,
            min_purchase: minimum_purchase,
            advertiser_id: advertiserId,
            is_active: true
          }
        ])
        .select()
        .single()
      if (error) throw error
      return data as CashbackCampaign
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cashbacks', advertiserId] })
  })

  // Editar campanha
  const updateMutation = useMutation({
    mutationFn: async (input: Partial<CashbackCampaign> & { id: string }) => {
      const { id, minimum_purchase, ...rest } = input as any
      const updateData = minimum_purchase !== undefined
        ? { ...rest, min_purchase: minimum_purchase }
        : rest
      const { data, error } = await supabase
        .from(TABLE)
        .update(updateData)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as CashbackCampaign
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cashbacks', advertiserId] })
  })

  // Remover campanha
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from(TABLE)
        .delete()
        .eq('id', id)
      if (error) throw error
      return id
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cashbacks', advertiserId] })
  })

  return {
    campaigns,
    isLoading,
    isError,
    refetch,
    createCashback: createMutation.mutateAsync,
    updateCashback: updateMutation.mutateAsync,
    deleteCashback: deleteMutation.mutateAsync,
    isCreating: createMutation.status === 'pending',
    isUpdating: updateMutation.status === 'pending',
    isDeleting: deleteMutation.status === 'pending'
  }
}

export { useCashbacks } 