import { useState, useEffect } from 'react'
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
  const [profileData, setProfileData] = useState<AdvertiserProfileData>({
    full_name: '',
    email: '',
    phone: '',
    website: '',
    description: '',
    avatar_url: '',
    user_type: 'anunciante',
    created_at: '',
    email_notifications: true,
    push_notifications: true
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfileData = async (): Promise<void> => {
    if (!currentUser?.id) {
      setError('Usuário não autenticado')
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

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

      setProfileData(mappedProfile)

    } catch (err) {
      console.error('Erro ao buscar dados do perfil:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      
      // Fallback com dados básicos do currentUser
      setProfileData({
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
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<AdvertiserProfileData>): Promise<boolean> => {
    if (!currentUser?.id) return false

    try {
      setIsUpdating(true)
      setError(null)

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

      // Atualizar estado local
      setProfileData(prev => ({
        ...prev,
        ...updates
      }))

      return true

    } catch (err) {
      console.error('Erro ao atualizar perfil:', err)
      setError(err instanceof Error ? err.message : 'Erro ao atualizar perfil')
      return false
    } finally {
      setIsUpdating(false)
    }
  }

  useEffect(() => {
    fetchProfileData()
  }, [currentUser?.id])

  return {
    profileData,
    isLoading,
    error,
    refetch: fetchProfileData,
    updateProfile,
    isUpdating
  }
}

export default useAdvertiserProfile 