import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

interface UserProfile {
  id: string
  full_name: string
  email: string
  user_type: string
  rifas: number
  advertiser_rifas?: number
  company_name?: string
}

interface UseUsersForRifaDistributionParams {
  searchTerm?: string
  userTypeFilter?: string
}

export function useUsersForRifaDistribution({ 
  searchTerm = '', 
  userTypeFilter = 'all' 
}: UseUsersForRifaDistributionParams = {}) {
  
  return useQuery({
    queryKey: ['users-for-rifa-distribution', searchTerm, userTypeFilter],
    queryFn: async (): Promise<UserProfile[]> => {
      // Construir query base
      let query = supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          user_type,
          rifas
        `)
        .eq('active', true)
        .neq('user_type', 'admin') // Excluir administradores

      // Aplicar filtro de busca por nome ou email
      if (searchTerm.trim()) {
        query = query.or(`full_name.ilike.%${searchTerm.trim()}%,email.ilike.%${searchTerm.trim()}%`)
      }

      // Aplicar filtro por tipo de usuário
      if (userTypeFilter && userTypeFilter !== 'all') {
        query = query.eq('user_type', userTypeFilter)
      }

      // Ordenar por tipo de usuário e nome
      query = query.order('user_type').order('full_name')

      const { data, error } = await query

      if (error) {
        throw new Error(`Erro ao buscar usuários: ${error.message}`)
      }

      // Mapear e estruturar os dados
      const users = (data || []).map(user => ({
        id: user.id,
        full_name: user.full_name || 'Nome não informado',
        email: user.email || 'Email não informado',
        user_type: user.user_type,
        rifas: user.rifas || 0,
        advertiser_rifas: 0, // Placeholder
        company_name: null // Placeholder
      }))
      
      const advertiserUserIds = users
        .filter(u => u.user_type === 'anunciante')
        .map(u => u.id)
      
      if (advertiserUserIds.length > 0) {
        const { data: advertiserProfiles, error: advertiserError } = await supabase
          .from('advertiser_profiles')
          .select('user_id, rifas, company_name')
          .in('user_id', advertiserUserIds)

        if (advertiserError) {
          console.warn(`Erro ao buscar perfis de anunciante: ${advertiserError.message}`)
        } else {
          const advertiserMap = new Map(advertiserProfiles.map(p => [p.user_id, p]))
          
          users.forEach(user => {
            if (advertiserMap.has(user.id)) {
              const advertiserProfile = advertiserMap.get(user.id)
              user.advertiser_rifas = advertiserProfile?.rifas || 0
              user.company_name = advertiserProfile?.company_name || null
            }
          })
        }
      }

      return users
    },
    staleTime: 1000 * 60 * 2, // Cache por 2 minutos
    gcTime: 1000 * 60 * 5, // Manter cache por 5 minutos
  })
}

export default useUsersForRifaDistribution 