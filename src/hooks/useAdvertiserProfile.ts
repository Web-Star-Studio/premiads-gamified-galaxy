import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/services/supabase'
import { useAuth } from '@/hooks/useAuth'

interface AdvertiserProfileData {
  full_name: string
  email: string
  phone: string
  website: string
  description: string
  avatar_url: string
  user_type: 'participante' | 'anunciante' | 'admin'
  created_at: string
  email_notifications: boolean
  push_notifications: boolean
}

interface UseAdvertiserProfileReturn {
  profileData: AdvertiserProfileData
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  updateProfile: (updates: Partial<AdvertiserProfileData>) => Promise<boolean>
  isUpdating: boolean
}

/**
 * Hook para buscar dados dinâmicos do perfil do anunciante
 * Busca informações reais do usuário logado na tabela profiles
 */
function useAdvertiserProfile(): UseAdvertiserProfileReturn {
  const { currentUser } = useAuth()
  const queryClient = useQueryClient()

  // Query para buscar dados do perfil
  const {
    data: profileData,
    isLoading,
    error,
    refetch: refetchQuery
  } = useQuery({
    queryKey: ['advertiser-profile', currentUser?.id],
    queryFn: async (): Promise<AdvertiserProfileData> => {
      if (!currentUser?.id) {
        throw new Error('Usuário não autenticado')
      }

      // Buscar dados do perfil do usuário
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          avatar_url,
          phone,
          website,
          description,
          user_type,
          email_notifications,
          push_notifications,
          created_at
        `)
        .eq('id', currentUser.id)
        .single()

      if (profileError) {
        throw new Error(`Erro ao buscar perfil: ${profileError.message}`)
      }

      // Função para validar user_type
      const validateUserType = (type: any): 'participante' | 'anunciante' | 'admin' => {
        if (type === 'participante' || type === 'anunciante' || type === 'admin') {
          return type
        }
        return 'anunciante' // Default para anunciante
      }

      // Mapear dados com fallbacks seguros
      const mappedProfile: AdvertiserProfileData = {
        full_name: profile?.full_name || currentUser.email?.split('@')[0] || 'Usuário',
        email: currentUser.email || '',
        phone: profile?.phone || '',
        website: profile?.website || '',
        description: profile?.description || '',
        avatar_url: profile?.avatar_url || '',
        user_type: validateUserType(profile?.user_type),
        created_at: profile?.created_at || '',
        email_notifications: profile?.email_notifications !== false,
        push_notifications: profile?.push_notifications !== false
      }

      return mappedProfile
    },
    enabled: !!currentUser?.id,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
    retry: 3
  })

  // Mutation para atualizar perfil
  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<AdvertiserProfileData>) => {
      if (!currentUser?.id) throw new Error('Usuário não autenticado')

      // Separar atualizações para auth.users e profiles
      const profileUpdates: any = {}
      
      // Campos que vão para a tabela profiles
      if (updates.full_name !== undefined) profileUpdates.full_name = updates.full_name
      if (updates.phone !== undefined) profileUpdates.phone = updates.phone
      if (updates.website !== undefined) profileUpdates.website = updates.website
      if (updates.description !== undefined) profileUpdates.description = updates.description
      if (updates.avatar_url !== undefined) profileUpdates.avatar_url = updates.avatar_url
      if (updates.email_notifications !== undefined) profileUpdates.email_notifications = updates.email_notifications
      if (updates.push_notifications !== undefined) profileUpdates.push_notifications = updates.push_notifications

      // Atualizar tabela profiles se houver campos para atualizar
      if (Object.keys(profileUpdates).length > 0) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update(profileUpdates)
          .eq('id', currentUser.id)

        if (profileError) {
          throw new Error(`Erro ao atualizar perfil: ${profileError.message}`)
        }
      }

      return updates
    },
    onSuccess: (updates) => {
      // Atualizar cache otimisticamente
      queryClient.setQueryData(['advertiser-profile', currentUser?.id], (old: AdvertiserProfileData | undefined) => {
        if (!old) return old
        return {
          ...old,
          ...updates
        }
      })
    },
    onError: (error) => {
      console.error('Erro ao atualizar perfil:', error)
    }
  })

  // Handle query errors
  let errorMessage: string | null = null
  if (error) {
    console.error('Erro ao buscar dados do perfil:', error)
    errorMessage = error.message
  }

  // Fallback data quando há erro
  const fallbackData: AdvertiserProfileData = {
    full_name: currentUser?.email?.split('@')[0] || 'Usuário',
    email: currentUser?.email || '',
    phone: '',
    website: '',
    description: '',
    avatar_url: '',
    user_type: 'anunciante',
    created_at: '',
    email_notifications: true,
    push_notifications: true
  }

  const refetch = async (): Promise<void> => {
    await refetchQuery()
  }

  const updateProfile = async (updates: Partial<AdvertiserProfileData>): Promise<boolean> => {
    try {
      await updateProfileMutation.mutateAsync(updates)
      return true
    } catch (error) {
      return false
    }
  }

  return {
    profileData: profileData || fallbackData,
    isLoading,
    error: errorMessage,
    refetch,
    updateProfile,
    isUpdating: updateProfileMutation.isPending
  }
}

export default useAdvertiserProfile 