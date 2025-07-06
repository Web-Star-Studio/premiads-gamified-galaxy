import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface AdminProfileData {
  id: string
  email: string
  full_name: string
  user_type: string
  avatar_url: string | null
  active: boolean
  rifas: number
  created_at: string
  updated_at: string
  email_confirmed_at: string | null
  last_sign_in_at: string | null
}

interface SystemMetrics {
  total_users: number
  total_clients: number
  total_advertisers: number
  active_missions: number
  total_raffles: number
  total_submissions: number
  total_notifications: number
}

export const useAdminProfile = () => {
  const [profileData, setProfileData] = useState<AdminProfileData | null>(null)
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchAdminProfile = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('No authenticated user found')
      }

      // Fetch admin profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          full_name,
          user_type,
          avatar_url,
          active,
          rifas,
          created_at,
          updated_at
        `)
        .eq('id', user.id)
        .single()

      if (profileError) {
        throw profileError
      }

      // Get auth data from the current user session
      const authData = {
        email_confirmed_at: user.email_confirmed_at || null,
        last_sign_in_at: user.last_sign_in_at || null
      }

      // Combine profile and auth data
      const combinedData: AdminProfileData = {
        ...profileData,
        email_confirmed_at: authData.email_confirmed_at,
        last_sign_in_at: authData.last_sign_in_at
      }

      setProfileData(combinedData)

      // Fetch system metrics
      const { data: metricsData, error: metricsError } = await supabase.rpc('get_system_metrics')
      
      if (metricsError) {
        console.warn('Could not fetch system metrics:', metricsError)
        // Fallback to manual queries
        const [
          { count: totalUsers },
          { count: totalClients },
          { count: totalAdvertisers },
          { count: activeMissions },
          { count: totalRaffles },
          { count: totalSubmissions },
          { count: totalNotifications }
        ] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('user_type', 'participante'),
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('user_type', 'anunciante'),
          supabase.from('missions').select('*', { count: 'exact', head: true }).eq('is_active', true),
          supabase.from('raffles').select('*', { count: 'exact', head: true }),
          supabase.from('mission_submissions').select('*', { count: 'exact', head: true }),
          supabase.from('notifications').select('*', { count: 'exact', head: true })
        ])

        setSystemMetrics({
          total_users: totalUsers || 0,
          total_clients: totalClients || 0,
          total_advertisers: totalAdvertisers || 0,
          active_missions: activeMissions || 0,
          total_raffles: totalRaffles || 0,
          total_submissions: totalSubmissions || 0,
          total_notifications: totalNotifications || 0
        })
      } else {
        // metricsData is a JSON object, we need to extract the values
        const metrics = typeof metricsData === 'object' ? metricsData : JSON.parse(metricsData)
        setSystemMetrics(metrics)
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch admin profile'
      setError(errorMessage)
      console.error('Error fetching admin profile:', err)
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<Pick<AdminProfileData, 'full_name' | 'avatar_url'>>) => {
    try {
      if (!profileData) return false

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profileData.id)

      if (error) throw error

      setProfileData(prev => prev ? { ...prev, ...updates } : null)
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully'
      })
      
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile'
      console.error('Error updating profile:', err)
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
      return false
    }
  }

  useEffect(() => {
    fetchAdminProfile()
  }, [])

  return {
    profileData,
    systemMetrics,
    loading,
    error,
    refetch: fetchAdminProfile,
    updateProfile
  }
} 