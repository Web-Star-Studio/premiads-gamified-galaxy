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
  missionId?: string
  dataUnlocked?: boolean
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

      // Buscar submissões aprovadas das missões do anunciante
      let submissionsQuery = client
        .from('mission_submissions')
        .select(`
          id,
          mission_id,
          user_id,
          status,
          submitted_at,
          missions!inner(
            id,
            title,
            advertiser_id
          )
        `)
        .eq('missions.advertiser_id', advertiserId)
        .eq('status', 'approved')
        .order('submitted_at', { ascending: false })

      // Aplicar filtros
      if (campaignId) {
        submissionsQuery = submissionsQuery.eq('mission_id', campaignId)
      }
      if (startDate && endDate) {
        submissionsQuery = submissionsQuery.gte('submitted_at', startDate).lte('submitted_at', endDate)
      }

      const { data: submissions, error: submissionsError } = await submissionsQuery
      if (submissionsError) throw submissionsError

      // Buscar perfis dos usuários
      const userIds = [...new Set(submissions?.map(s => s.user_id) || [])]
      let profilesData: any[] = []
      
      if (userIds.length > 0) {
        const { data: profiles, error: profilesError } = await client
          .from('profiles')
          .select('id, full_name, email, age, gender, region, income_range')
          .in('id', userIds)
        
        if (!profilesError) {
          profilesData = profiles || []
        }
      }

      // Buscar dados de desbloqueio - simular que nenhum está desbloqueado por enquanto
      // Quando a tabela advertiser_crm_unlocks estiver funcionando, substituir por query real
      let unlockedMissions = new Set<string>()
      
      // TODO: Quando migration for aplicada, substituir por:
      // const { data: unlocks } = await client
      //   .from('advertiser_crm_unlocks')
      //   .select('mission_id')
      //   .eq('advertiser_id', advertiserId)
      // unlockedMissions = new Set(unlocks?.map(u => u.mission_id) || [])

      // Criar mapa de perfis para acesso rápido
      const profilesMap = new Map(profilesData.map(p => [p.id, p]))

      // Buscar total de submissões para calcular engagement
      const { data: allSubmissions } = await client
        .from('mission_submissions')
        .select('id, missions!inner(advertiser_id)')
        .eq('missions.advertiser_id', advertiserId)

      // Processar dados
      const approvedSubmissions = submissions || []
      const totalParticipants = new Set(approvedSubmissions.map(s => s.user_id)).size
      const totalCompleted = approvedSubmissions.length
      const totalAllSubmissions = allSubmissions?.length || 0

      // Calcular métricas
      const completionRate = totalAllSubmissions > 0 ? (totalCompleted / totalAllSubmissions) * 100 : 0
      const engagementRate = totalAllSubmissions > 0 ? (totalCompleted / totalAllSubmissions) * 100 : 0

      // Processar dados demográficos baseado nos perfis
      const ages = profilesData.map(p => p.age).filter(Boolean)
      const averageAge = ages.length > 0 ? ages.reduce((a, b) => a + b, 0) / ages.length : 0

      // Distribuições
      const ageDistribution: Record<string, number> = {}
      const genderDistribution: Record<string, number> = {}
      const regionDistribution: Record<string, number> = {}
      const incomeDistribution: Record<string, number> = {}

      profilesData.forEach(profile => {
        // Distribuição de idade
        const ageGroup = profile.age 
          ? profile.age <= 25 ? '18-25'
          : profile.age <= 35 ? '26-35'
          : profile.age <= 45 ? '36-45'
          : profile.age <= 55 ? '46-55'
          : '55+'
          : 'Não informado'
        ageDistribution[ageGroup] = (ageDistribution[ageGroup] || 0) + 1

        // Distribuição de gênero
        const gender = profile.gender || 'Não informado'
        genderDistribution[gender] = (genderDistribution[gender] || 0) + 1

        // Distribuição de região
        const region = profile.region || 'Não informado'
        regionDistribution[region] = (regionDistribution[region] || 0) + 1

        // Distribuição de renda
        const income = profile.income_range || 'Não informado'
        incomeDistribution[income] = (incomeDistribution[income] || 0) + 1
      })

      // Processar participantes
      const participants: Participant[] = approvedSubmissions.map(submission => {
        const profile = profilesMap.get(submission.user_id)
        const isUnlocked = unlockedMissions.has(submission.mission_id)

        return {
          name: isUnlocked ? (profile?.full_name || 'Nome não disponível') : '**** (dados bloqueados)',
          email: isUnlocked ? (profile?.email || 'Email não disponível') : '**** (dados bloqueados)', 
          status: 'completed' as const,
          startedAt: submission.submitted_at,
          completedAt: submission.submitted_at,
          missionId: submission.mission_id,
          dataUnlocked: isUnlocked
        }
      })

      return {
        stats: {
          completionRate: Math.round(completionRate * 100) / 100,
          engagementRate: Math.round(engagementRate * 100) / 100,
          totalParticipants,
          totalCompleted
        },
        demographics: {
          averageAge: Math.round(averageAge * 100) / 100,
          ageDistribution,
          genderDistribution,
          regionDistribution,
          interestsDistribution: {},
          incomeRangeDistribution: incomeDistribution
        },
        participants
      }
    },
    enabled: !!advertiserId
  })
} 