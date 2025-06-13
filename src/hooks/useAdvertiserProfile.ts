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
  const [error, setError] = useState<string | null>(null)

  const fetchProfileData = async () => {
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

  useEffect(() => {
    fetchProfileData()
  }, [currentUser?.id])

  return {
    profileData,
    isLoading,
    error,
    refetch: fetchProfileData
  }
}

export default useAdvertiserProfile 