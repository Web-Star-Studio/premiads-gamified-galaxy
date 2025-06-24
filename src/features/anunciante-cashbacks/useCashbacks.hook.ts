import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { CashbackCampaign } from './types'

const TABLE = 'cashback_campaigns'

interface CreateCashbackInput {
  title: string
  description: string
  cashback_percentage: number
  end_date: string
  category: string
  advertiser_id: string
  advertiser_logo: string
  is_active: boolean
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
        .from(TABLE as any)
        .select('*')
        .eq('advertiser_id', advertiserId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as unknown as CashbackCampaign[]
    },
    enabled: Boolean(advertiserId)
  })

  // Criar campanha
  const createMutation = useMutation({
    mutationFn: async (input: CreateCashbackInput) => {
      const { data, error } = await supabase
        .from(TABLE as any)
        .insert([
          {
            ...input,
            expires_at: input.end_date
          }
        ])
        .select()
        .single()
      if (error) throw error
      return data as unknown as CashbackCampaign
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cashbacks', advertiserId] })
  })

  // Editar campanha
  const updateMutation = useMutation({
    mutationFn: async (input: Partial<CashbackCampaign> & { id: string }) => {
      const { id, ...rest } = input as any
      const updateData: any = { ...rest }
      if (rest.end_date) updateData.expires_at = rest.end_date
      const { data, error } = await supabase
        .from(TABLE as any)
        .update(updateData)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as unknown as CashbackCampaign
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cashbacks', advertiserId] })
  })

  // Remover campanha
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from(TABLE as any)
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
