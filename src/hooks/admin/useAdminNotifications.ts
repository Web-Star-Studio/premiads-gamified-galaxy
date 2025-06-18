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
  }
}

export interface SendNotificationData {
  title: string
  message: string
  target_type: 'all' | 'advertisers' | 'participants'
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
      const { data: result, error } = await supabase.functions.invoke('admin-notifications', {
        body: {
          action: 'send_notification',
          ...data
        }
      })

      if (error) throw error

      toast({
        title: 'Sucesso',
        description: result.message || 'Notificação enviada com sucesso',
        variant: 'default'
      })

      return { success: true, data: result }
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
    setIsLoading(true)
    try {
      const { data: result, error } = await supabase.functions.invoke('admin-notifications', {
        body: { action: 'get_settings' }
      })

      if (error) throw error

      const formattedSettings: NotificationSettings = {
        global_notifications_enabled: result.settings.global_notifications_enabled?.value || false,
        user_notifications_enabled: result.settings.user_notifications_enabled?.value || false,
        system_notifications_enabled: result.settings.system_notifications_enabled?.value || false
      }

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
      const { data: result, error } = await supabase.functions.invoke('admin-notifications', {
        body: {
          action: 'update_settings',
          settings: newSettings
        }
      })

      if (error) throw error

      // Update local state
      setSettings(prev => prev ? { ...prev, ...newSettings } : null)

      toast({
        title: 'Sucesso',
        description: 'Configurações atualizadas com sucesso',
        variant: 'default'
      })

      return { success: true, data: result }
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

  const getNotificationsHistory = useCallback(async (page: number = 1, limit: number = 20) => {
    setIsLoading(true)
    try {
      const { data: result, error } = await supabase.functions.invoke('admin-notifications', {
        body: {
          action: 'get_notifications_history',
          page,
          limit
        }
      })

      if (error) {
        console.error('Edge Function error:', error)
        throw error
      }

      if (!result) {
        console.warn('No data returned from Edge Function')
        setNotifications([])
        setPagination(null)
        return { success: true, data: { notifications: [], pagination: null } }
      }

      setNotifications(result.notifications || [])
      setPagination(result.pagination || null)

      return { success: true, data: result }
    } catch (error: any) {
      console.error('Error fetching notifications history:', error)
      
      // More detailed error logging
      if (error.context) {
        console.error('Error context:', error.context)
      }
      if (error.details) {
        console.error('Error details:', error.details)
      }
      
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