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
  id: string
  name: string
  email: string
  status: 'completed' | 'pending' | 'abandoned'
  startedAt: string
  completedAt?: string
  demographics?: {
    age?: number
    gender?: string
    location?: string
    income?: string
  }
}

interface CrmDashboardResponse {
  stats: CrmStats
  demographics: Demographics
  participants: Participant[]
  isDataLocked: boolean
}

export function useAdvertiserCrm(advertiserId: string, filters?: { campaignId?: string, startDate?: string, endDate?: string }) {
  const { campaignId, startDate, endDate } = filters || {};

  return useQuery<CrmDashboardResponse>({
    queryKey: ['advertiser-crm', advertiserId, filters],
    queryFn: async () => {
      const client = await getSupabaseClient()
      
      try {
        // Query base para missões do anunciante
        let missionsQuery = client
          .from('missions')
          .select(`
            id,
            title,
            created_at,
            start_date,
            end_date,
            target_filter
          `)
          .eq('advertiser_id', advertiserId)
          .eq('is_active', true);

        // Aplicar filtro de campanha específica se fornecido
        if (campaignId) {
          missionsQuery = missionsQuery.eq('id', campaignId);
        }

        // Aplicar filtro de data se fornecido
        if (startDate) {
          missionsQuery = missionsQuery.gte('created_at', startDate);
        }
        if (endDate) {
          missionsQuery = missionsQuery.lte('created_at', endDate + 'T23:59:59.999Z');
        }

        const { data: missions, error: missionsError } = await missionsQuery;
        
        if (missionsError) throw missionsError;
        if (!missions || missions.length === 0) {
          return {
            stats: { completionRate: 0, engagementRate: 0, totalParticipants: 0, totalCompleted: 0 },
            demographics: { averageAge: 0, ageDistribution: {}, genderDistribution: {}, regionDistribution: {}, interestsDistribution: {}, incomeRangeDistribution: {} },
            participants: [],
            isDataLocked: false
          };
        }

        const missionIds = missions.map(m => m.id);

        // Buscar submissões das missões
        const { data: submissions, error: submissionsError } = await client
          .from('mission_submissions')
          .select(`
            id,
            mission_id,
            user_id,
            status,
            submitted_at,
            updated_at
          `)
          .in('mission_id', missionIds);

        if (submissionsError) throw submissionsError;

        // Calcular estatísticas básicas
        const totalSubmissions = submissions?.length || 0;
        const approvedSubmissions = submissions?.filter(s => s.status === 'approved') || [];
        const totalCompleted = approvedSubmissions.length;
        const uniqueParticipants = new Set(submissions?.map(s => s.user_id)).size;
        
        const completionRate = totalSubmissions > 0 ? (totalCompleted / totalSubmissions) * 100 : 0;
        const engagementRate = uniqueParticipants > 0 ? (totalCompleted / uniqueParticipants) * 100 : 0;

        const stats: CrmStats = {
          completionRate: Math.round(completionRate * 100) / 100,
          engagementRate: Math.round(engagementRate * 100) / 100,
          totalParticipants: uniqueParticipants,
          totalCompleted
        };

        // No novo sistema, dados gerais sempre disponíveis
        const isDataLocked = false;

        // Se dados estão bloqueados, retornar apenas stats básicas
        if (isDataLocked) {
          return {
            stats,
            demographics: {
              averageAge: 0,
              ageDistribution: {},
              genderDistribution: {},
              regionDistribution: {},
              interestsDistribution: {},
              incomeRangeDistribution: {}
            },
            participants: [],
            isDataLocked: true
          };
        }

        // Buscar dados dos usuários que fizeram submissões aprovadas
        const approvedUserIds = approvedSubmissions.map(s => s.user_id);
        
        let demographics: Demographics = {
          averageAge: 0,
          ageDistribution: {},
          genderDistribution: {},
          regionDistribution: {},
          interestsDistribution: {},
          incomeRangeDistribution: {}
        };

        let participants: Participant[] = [];

        if (approvedUserIds.length > 0) {
          // Buscar perfis dos usuários
          const { data: profiles, error: profilesError } = await client
            .from('profiles')
            .select('id, full_name, email, profile_data, income_range, created_at')
            .in('id', approvedUserIds);

          if (profilesError) {
            console.warn('Error fetching profiles:', profilesError);
          } else if (profiles) {
            // Calcular dados demográficos
            const ages: number[] = [];
            const genderCounts: Record<string, number> = {};
            const regionCounts: Record<string, number> = {};
            const interestCounts: Record<string, number> = {};
            const incomeCounts: Record<string, number> = {};

            profiles.forEach(profile => {
              const profileData = profile.profile_data as any;
              
              // Processar idade
              if (profileData?.ageRange && typeof profileData.ageRange === 'string') {
                const ageRangeMap: Record<string, number> = {
                  '18-24': 21, '25-34': 29, '35-44': 39, '45-54': 49, '55-64': 59, '65+': 70
                };
                const ageValue = ageRangeMap[profileData.ageRange];
                if (ageValue) ages.push(ageValue);
              }

              // Contar gêneros
              if (profileData?.gender && typeof profileData.gender === 'string') {
                const genderLabel = profileData.gender === 'male' ? 'Masculino' : 'Feminino';
                genderCounts[genderLabel] = (genderCounts[genderLabel] || 0) + 1;
              }

              // Contar localizações
              if (profileData?.location && typeof profileData.location === 'string') {
                regionCounts[profileData.location] = (regionCounts[profileData.location] || 0) + 1;
              }

              // Contar interesses
              if (profileData?.interests && Array.isArray(profileData.interests)) {
                profileData.interests.forEach((interest: string) => {
                  if (typeof interest === 'string') {
                    interestCounts[interest] = (interestCounts[interest] || 0) + 1;
                  }
                });
              }

              // Contar faixas de renda
              if (profile.income_range && typeof profile.income_range === 'string') {
                incomeCounts[profile.income_range] = (incomeCounts[profile.income_range] || 0) + 1;
              }
            });

            demographics = {
              averageAge: ages.length > 0 ? Math.round((ages.reduce((a, b) => a + b, 0) / ages.length) * 100) / 100 : 0,
              ageDistribution: {},
              genderDistribution: genderCounts,
              regionDistribution: regionCounts,
              interestsDistribution: interestCounts,
              incomeRangeDistribution: incomeCounts
            };

            // Montar lista de participantes
            participants = profiles.map(profile => {
              const submission = approvedSubmissions.find(s => s.user_id === profile.id);
              return {
                id: profile.id,
                name: profile.full_name || 'Nome não informado',
                email: profile.email || 'Email não informado',
                status: 'completed' as const,
                startedAt: submission?.submitted_at || profile.created_at,
                completedAt: submission?.updated_at,
                demographics: undefined
              };
            });
          }
        }

        return {
          stats,
          demographics,
          participants,
          isDataLocked: false
        };

      } catch (error) {
        console.error('Error fetching CRM data:', error);
        throw error;
      }
    },
    enabled: !!advertiserId
  })
} 