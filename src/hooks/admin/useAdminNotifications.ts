import { useState, useCallback } from 'react'
import { supabase } from '../../integrations/supabase/client'
import { useToast } from '../use-toast'

export interface NotificationSettings {
  global_notifications_enabled: boolean
  user_notifications_enabled: boolean
  system_notifications_enabled: boolean
}

export interface AdminNotification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  category: string
  data?: any
  created_at: string
  profiles?: {
    full_name: string
    user_type: string
  } | null
}

export interface SendNotificationData {
  title: string
  message: string
  target_type: 'all' | 'advertisers' | 'participants' | 'participant'
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  pages: number
}

export function useAdminNotifications() {
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState<NotificationSettings | null>(null)
  const [notifications, setNotifications] = useState<AdminNotification[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const { toast } = useToast()

  const sendNotification = useCallback(async (data: SendNotificationData) => {
    setIsLoading(true)
    try {
      // Normalize target_type for RPC function
      const normalizedTargetType = data.target_type === 'participants' ? 'participante' : 
                                   data.target_type === 'advertisers' ? 'anunciante' : 
                                   'all'

      // Use RPC directly instead of Edge Function
      const { data: result, error } = await supabase.rpc('send_notification_to_users', {
        p_title: data.title,
        p_message: data.message,
        p_target_type: normalizedTargetType
      })

      if (error) throw error

      const recipientsCount = result?.[0]?.recipients_count || 0

      toast({
        title: 'Sucesso',
        description: `Notificação enviada para ${recipientsCount} usuário(s)`,
        variant: 'default'
      })

      return { success: true, data: { recipients_count: recipientsCount } }
    } catch (error: any) {
      console.error('Error sending notification:', error)
      toast({
        title: 'Erro',
        description: error.message || 'Falha ao enviar notificação',
        variant: 'destructive'
      })
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const getSettings = useCallback(async () => {
    console.log('useAdminNotifications - getSettings called')
    setIsLoading(true)
    try {
      // Try direct database query first as fallback for edge function issues
      console.log('useAdminNotifications - Using direct database query')
      const { data: settingsData, error: dbError } = await supabase
        .from('admin_notification_settings')
        .select('setting_key, setting_value')

      if (dbError) throw dbError

      console.log('useAdminNotifications - Database settings:', settingsData)

      const formattedSettings: NotificationSettings = {
        global_notifications_enabled: settingsData?.find(s => s.setting_key === 'global_notifications_enabled')?.setting_value ?? false,
        user_notifications_enabled: settingsData?.find(s => s.setting_key === 'user_notifications_enabled')?.setting_value ?? false,
        system_notifications_enabled: settingsData?.find(s => s.setting_key === 'system_notifications_enabled')?.setting_value ?? false
      }

      console.log('useAdminNotifications - Formatted settings:', formattedSettings)
      setSettings(formattedSettings)
      return { success: true, data: formattedSettings }
    } catch (error: any) {
      console.error('Error fetching settings:', error)
      toast({
        title: 'Erro',
        description: 'Falha ao carregar configurações',
        variant: 'destructive'
      })
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const updateSettings = useCallback(async (newSettings: Partial<NotificationSettings>) => {
    setIsLoading(true)
    try {
      // Update each setting directly in the database
      for (const [key, value] of Object.entries(newSettings)) {
        const { error } = await supabase
          .from('admin_notification_settings')
          .update({ 
            setting_value: value,
            updated_at: new Date().toISOString()
          })
          .eq('setting_key', key)
        
        if (error) throw error
      }

      // Update local state
      setSettings(prev => prev ? { ...prev, ...newSettings } : null)

      toast({
        title: 'Sucesso',
        description: 'Configurações atualizadas com sucesso',
        variant: 'default'
      })

      return { success: true, data: newSettings }
    } catch (error: any) {
      console.error('Error updating settings:', error)
      toast({
        title: 'Erro',
        description: 'Falha ao atualizar configurações',
        variant: 'destructive'
      })
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const getNotificationsHistory = useCallback(async (page: number = 1, limit: number = 20, targetTypeFilter?: string) => {
    setIsLoading(true)
    try {
      const offset = (page - 1) * limit

      // Build query with optional filter (without join for now)
      let query = supabase
        .from('admin_notifications_log')
        .select(`
          id,
          title,
          message,
          target_type,
          recipients_count,
          sent_at,
          data,
          sent_by
        `)
        
      // Apply filter if specified and not 'all'
      if (targetTypeFilter && targetTypeFilter !== 'all') {
        query = query.eq('target_type', targetTypeFilter)
      }
        
      const { data: adminLogs, error: logsError } = await query
        .order('sent_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (logsError) throw logsError

      // Count total notifications for pagination with same filter
      let countQuery = supabase
        .from('admin_notifications_log')
        .select('*', { count: 'exact', head: true })
        
      if (targetTypeFilter && targetTypeFilter !== 'all') {
        countQuery = countQuery.eq('target_type', targetTypeFilter)
      }
        
      const { count, error: countError } = await countQuery

      if (countError) throw countError

      const totalPages = Math.ceil((count || 0) / limit)
      
      const paginationInfo = {
        page,
        limit,
        total: count || 0,
        pages: totalPages
      }

      // Transform to match AdminNotification interface
      const transformedNotifications: AdminNotification[] = (adminLogs || []).map(log => ({
        id: log.id,
        title: log.title,
        message: log.message,
        type: 'info' as const,
        category: 'admin_broadcast',
        data: {
          ...log.data,
          target_type: log.target_type,
          recipients_count: log.recipients_count
        },
        created_at: log.sent_at,
        profiles: {
          full_name: 'Admin',
          user_type: 'admin'
        }
      }))
      
      setNotifications(transformedNotifications)
      setPagination(paginationInfo)

      return { 
        success: true, 
        data: { 
          notifications: transformedNotifications, 
          pagination: paginationInfo 
        } 
      }
    } catch (error: any) {
      console.error('Error fetching admin notifications history:', error)
      
      toast({
        title: 'Erro',
        description: `Falha ao carregar histórico: ${error.message || 'Erro desconhecido'}`,
        variant: 'destructive'
      })
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const toggleSetting = useCallback(async (settingKey: keyof NotificationSettings) => {
    if (!settings) return { success: false, error: 'Settings not loaded' }

    const currentValue = settings[settingKey]
    return await updateSettings({ [settingKey]: !currentValue })
  }, [settings, updateSettings])

  return {
    // State
    isLoading,
    settings,
    notifications,
    pagination,

    // Actions
    sendNotification,
    getSettings,
    updateSettings,
    getNotificationsHistory,
    toggleSetting
  }
} 