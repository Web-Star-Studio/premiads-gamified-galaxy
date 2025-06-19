import { useQuery } from '@tanstack/react-query'
import { getSupabaseClient } from '@/services/supabase'

interface CrmStats {
  completionRate: number
  engagementRate: number
  totalParticipants: number
  totalCompleted: number
}

interface Demographics {
  averageAge: number
  ageDistribution: Record<string, number>
  genderDistribution: Record<string, number>
  regionDistribution: Record<string, number>
  interestsDistribution: Record<string, number>
  incomeRangeDistribution: Record<string, number>
}

interface Participant {
  name: string
  email: string
  status: 'completed' | 'started' | 'abandoned'
  startedAt: string
  completedAt?: string
}

interface CrmDashboardResponse {
  stats: CrmStats
  demographics: Demographics
  participants: Participant[]
}

export function useAdvertiserCrm(advertiserId: string, filters?: { campaignId?: string, startDate?: string, endDate?: string }) {
  return useQuery<CrmDashboardResponse>({
    queryKey: ['advertiser-crm', advertiserId, filters],
    queryFn: async () => {
      const client = await getSupabaseClient()
      const { campaignId, startDate, endDate } = filters || {}
      const campaignFilter = campaignId ? `AND m.id = '${campaignId}'` : ''
      const dateFilter = startDate && endDate ? `AND p.started_at BETWEEN '${startDate}' AND '${endDate}'` : ''
      const { data, error } = await client.rpc<any, any>('crm_dashboard', {
        p_advertiser_id: advertiserId,
        campaign_filter: campaignFilter,
        date_filter: dateFilter
      })
      if (error) throw error
      return data as unknown as CrmDashboardResponse
    },
    enabled: !!advertiserId
  })
} 