import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Lottery, LotteryParticipation } from '@/types/lottery'

export interface UserParticipationWithRaffle {
  participation: LotteryParticipation
  raffle: Lottery
}

export function useFixedRaffleParticipations(userId: string | null) {
  const [participations, setParticipations] = useState<UserParticipationWithRaffle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchParticipations = async () => {
    if (!userId) {
      setParticipations([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Consulta direta para participações
      const { data: directParticipations, error: directError } = await supabase
        .from('lottery_participants' as any)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (directError) {
        throw directError
      }

      if (!directParticipations || directParticipations.length === 0) {
        setParticipations([])
        setLoading(false)
        return
      }

      // Extrair IDs únicos dos sorteios
      const lotteryIds = [...new Set(directParticipations.map((p: any) => p.lottery_id))]

      // Buscar detalhes dos sorteios separadamente
      const { data: lotteries, error: lotteriesError } = await supabase
        .from('lotteries' as any)
        .select('*')
        .in('id', lotteryIds)

      if (lotteriesError) {
        throw lotteriesError
      }

      // Combinar os dados
      const combinedData: UserParticipationWithRaffle[] = directParticipations
        .map((participation: any) => {
          const raffle = lotteries?.find((l: any) => l.id === participation.lottery_id)
          
          if (!raffle) return null

          return {
            participation: {
              id: participation.id,
              user_id: participation.user_id,
              lottery_id: participation.lottery_id,
              numbers: participation.numbers || [],
              created_at: participation.created_at,
              updated_at: participation.updated_at
            },
            raffle: raffle as unknown as Lottery
          }
        })
        .filter(Boolean) as UserParticipationWithRaffle[]

      setParticipations(combinedData)
    } catch (err) {
      console.error('Error fetching participations:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar participações')
      setParticipations([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchParticipations()
  }, [userId])

  return { participations, loading, error, refetch: fetchParticipations }
} 