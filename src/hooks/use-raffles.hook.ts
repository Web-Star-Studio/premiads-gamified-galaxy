import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../integrations/supabase/client'
import type { Database } from '../integrations/supabase/types'

const RAFFLES_KEY = ['raffles']

type Raffle = Database['public']['Tables']['raffles']['Row']

export function useRaffles() {
  const queryClient = useQueryClient()

  const rafflesQuery = useQuery({
    queryKey: RAFFLES_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('raffles')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Raffle[]
    }
  })

  const buyTickets = useMutation({
    mutationFn: async ({ raffleId, qty }: { raffleId: string; qty: number }) => {
      // @ts-ignore - tabela gerada em próxima atualização de tipos
      const { error } = await supabase.from('raffle_tickets' as any).insert({
        raffle_id: raffleId,
        qty
      } as any)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RAFFLES_KEY })
    }
  })

  return {
    raffles: rafflesQuery.data ?? [],
    isLoading: rafflesQuery.isLoading,
    buyTickets: buyTickets.mutateAsync
  }
} 