import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getOpenRaffles, buyRaffleTickets } from '@/lib/services/raffles'

// Raffle types inferred from service
const RAFFLES_KEY = ['raffles']

export function useRaffles() {
  const queryClient = useQueryClient()

  const rafflesQuery = useQuery({
    queryKey: RAFFLES_KEY,
    queryFn: getOpenRaffles
  })

  const buyTickets = useMutation({
    mutationFn: buyRaffleTickets,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: RAFFLES_KEY })
  })

  return {
    raffles: rafflesQuery.data ?? [],
    isLoading: rafflesQuery.isLoading,
    buyTickets: buyTickets.mutateAsync
  }
} 