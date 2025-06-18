import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useSounds } from '@/hooks/use-sounds'
import type { RealtimeChannel } from '@supabase/supabase-js'
import type { Tables } from '@/integrations/supabase/types'

export type ClientNotification = Tables<'notifications'>

export interface ClientNotificationStats {
  total: number
  unread: number
  byType: Record<string, number>
  byCategory: Record<string, number>
  recentActivity: number // Notificações das últimas 24h
}

export interface ClientNotificationFilters {
  category?: 'campaign' | 'submission' | 'payment' | 'system' | 'user' | 'achievement' | 'security'
  type?: 'info' | 'success' | 'warning' | 'error'
  unreadOnly?: boolean
  limit?: number
}

export function useClientNotifications() {
  const [notifications, setNotifications] = useState<ClientNotification[]>([])
  const [stats, setStats] = useState<ClientNotificationStats>({
    total: 0,
    unread: 0,
    byType: {},
    byCategory: {},
    recentActivity: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [adminSettings, setAdminSettings] = useState<any>(null)

  const { user } = useAuth()
  const { playSound } = useSounds()

  // Load admin notification settings
  const loadAdminSettings = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('admin_notification_settings')
        .select('setting_key, setting_value')

      const settingsMap = data?.reduce((acc: any, setting: any) => {
        acc[setting.setting_key] = setting.setting_value
        return acc
      }, {}) || {}

      setAdminSettings({
        global_notifications_enabled: settingsMap.global_notifications_enabled ?? true,
        user_notifications_enabled: settingsMap.user_notifications_enabled ?? true,
        system_notifications_enabled: settingsMap.system_notifications_enabled ?? true
      })
    } catch (error) {
      console.error('Error loading admin settings:', error)
      // Default to enabled if we can't load settings
      setAdminSettings({
        global_notifications_enabled: true,
        user_notifications_enabled: true,
        system_notifications_enabled: true
      })
    }
  }, [])

  // Load notifications with admin settings filter
  const loadNotifications = useCallback(async () => {
    if (!user || !adminSettings) return

    // Check if notifications are globally disabled
    if (!adminSettings.global_notifications_enabled) {
      setNotifications([])
      setUnreadCount(0)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      // Filter by admin settings
      const allowedCategories = []
      if (adminSettings.user_notifications_enabled) {
        allowedCategories.push('campaign', 'submission', 'payment', 'user', 'achievement', 'activity')
      }
      if (adminSettings.system_notifications_enabled) {
        allowedCategories.push('system', 'security')
      }

      if (allowedCategories.length > 0) {
        query = query.in('category', allowedCategories)
      } else {
        // If no categories are allowed, return empty
        setNotifications([])
        setUnreadCount(0)
        setLoading(false)
        return
      }

      const { data, error } = await query

      if (error) throw error

      const notificationsList = data || []
      setNotifications(notificationsList)
      setStats(calculateStats(notificationsList))
      setUnreadCount(notificationsList.filter(n => !n.read).length)
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }, [user, adminSettings])

  // Calcular estatísticas específicas para participantes
  const calculateStats = useCallback((notificationList: ClientNotification[]): ClientNotificationStats => {
    const now = new Date()
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    
    return {
      total: notificationList.length,
      unread: notificationList.filter(n => !n.read).length,
      byType: notificationList.reduce((acc, n) => {
        acc[n.type] = (acc[n.type] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      byCategory: notificationList.reduce((acc, n) => {
        acc[n.category] = (acc[n.category] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      recentActivity: notificationList.filter(n => 
        new Date(n.created_at) > last24h
      ).length
    }
  }, [])

  // Marcar notificação como lida
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!adminSettings?.global_notifications_enabled) return

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', user?.id)

      if (error) throw error

      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      )
      setStats(prev => ({
        ...prev,
        unread: Math.max(0, prev.unread - 1)
      }))
      setUnreadCount(prev => Math.max(0, prev - 1))
      playSound?.('pop')
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }, [user?.id, adminSettings, playSound])

  // Marcar todas como lidas
  const markAllAsRead = useCallback(async () => {
    if (!user || !adminSettings?.global_notifications_enabled) return

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false)

      if (error) throw error

      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setStats(prev => ({ ...prev, unread: 0 }))
      setUnreadCount(0)
      playSound?.('success')
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }, [user, adminSettings, playSound])

  // Excluir notificação
  const deleteNotification = useCallback(async (notificationId: string) => {
    if (!user?.id) return

    try {
      const { error: deleteError } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', user.id)

      if (deleteError) throw deleteError

      // Atualizar estado local
      const notification = notifications.find(n => n.id === notificationId)
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      
      setStats(prev => ({
        total: prev.total - 1,
        unread: notification && !notification.read ? prev.unread - 1 : prev.unread,
        byType: {
          ...prev.byType,
          [notification?.type || '']: Math.max(0, (prev.byType[notification?.type || ''] || 1) - 1)
        },
        byCategory: {
          ...prev.byCategory,
          [notification?.category || '']: Math.max(0, (prev.byCategory[notification?.category || ''] || 1) - 1)
        },
        recentActivity: prev.recentActivity
      }))

      playSound?.('pop')
    } catch (err) {
      console.error('Error deleting notification:', err)
    }
  }, [user?.id, notifications, playSound])

  // Configurar Realtime para participantes
  useEffect(() => {
    if (!user || !adminSettings?.global_notifications_enabled) return

    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newNotification = payload.new as ClientNotification
          
          // Check if this notification category is allowed
          const isUserCategory = ['campaign', 'submission', 'payment', 'user', 'achievement'].includes(newNotification.category)
          const isSystemCategory = ['system', 'security'].includes(newNotification.category)
          
          const shouldShow = (
            (isUserCategory && adminSettings.user_notifications_enabled) ||
            (isSystemCategory && adminSettings.system_notifications_enabled)
          )

          if (shouldShow) {
            setNotifications(prev => [newNotification, ...prev.slice(0, 49)])
            if (!newNotification.read) {
              setUnreadCount(prev => prev + 1)
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const updatedNotification = payload.new as ClientNotification
          setNotifications(prev => 
            prev.map(n => 
              n.id === updatedNotification.id ? updatedNotification : n
            )
          )
          
          // Recalculate unread count
          setNotifications(current => {
            setUnreadCount(current.filter(n => !n.read).length)
            return current
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, adminSettings])

  // Load admin settings on mount
  useEffect(() => {
    loadAdminSettings()
  }, [loadAdminSettings])

  // Load notifications when admin settings change
  useEffect(() => {
    if (adminSettings) {
      loadNotifications()
    }
  }, [adminSettings, loadNotifications])

  // Listen for admin settings changes
  useEffect(() => {
    const channel = supabase
      .channel('admin_notification_settings')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'admin_notification_settings'
        },
        () => {
          // Reload settings when they change
          loadAdminSettings()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [loadAdminSettings])

  // Funções específicas para participantes
  const getRecentRewards = useCallback(() => {
    return notifications.filter(n => 
      (n.category === 'payment' || n.category === 'achievement') && 
      new Date(n.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Última semana
    )
  }, [notifications])

  const getMissionNotifications = useCallback(() => {
    return notifications.filter(n => n.category === 'campaign' || n.category === 'submission')
  }, [notifications])

  const getAchievementNotifications = useCallback(() => {
    return notifications.filter(n => n.category === 'achievement')
  }, [notifications])

  return {
    notifications,
    stats,
    loading,
    error,
    unreadCount,
    adminSettings,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    // Funções específicas para participantes
    getRecentRewards,
    getMissionNotifications,
    getAchievementNotifications,
    // Estados derivados úteis
    hasUnread: stats.unread > 0,
    hasRecentActivity: stats.recentActivity > 0,
    refresh: loadNotifications
  }
} 