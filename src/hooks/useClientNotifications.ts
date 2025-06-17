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

export function useClientNotifications(filters?: ClientNotificationFilters) {
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

  const { user } = useAuth()
  const { playSound } = useSounds()

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

  // Buscar notificações com filtros específicos de participante
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      // Aplicar filtros
      if (filters?.category) {
        query = query.eq('category', filters.category)
      }
      if (filters?.type) {
        query = query.eq('type', filters.type)
      }
      if (filters?.unreadOnly) {
        query = query.eq('read', false)
      }
      
      query = query.limit(filters?.limit || 50)

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      const notificationList = data || []
      setNotifications(notificationList)
      setStats(calculateStats(notificationList))
    } catch (err) {
      console.error('Error fetching client notifications:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar notificações')
    } finally {
      setLoading(false)
    }
  }, [user?.id, filters, calculateStats])

  // Marcar notificação como lida
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!user?.id) return

    try {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ read: true, updated_at: new Date().toISOString() })
        .eq('id', notificationId)
        .eq('user_id', user.id)

      if (updateError) throw updateError

      // Atualizar estado local
      setNotifications(prev => prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      ))

      // Recalcular estatísticas
      setStats(prev => ({
        ...prev,
        unread: Math.max(0, prev.unread - 1)
      }))

      playSound?.('pop')
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }, [user?.id, playSound])

  // Marcar todas como lidas
  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return

    try {
      const unreadIds = notifications.filter(n => !n.read).map(n => n.id)
      
      if (unreadIds.length === 0) return

      const { error: updateError } = await supabase
        .from('notifications')
        .update({ read: true, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('read', false)

      if (updateError) throw updateError

      // Atualizar estado local
      setNotifications(prev => prev.map(notification => ({ ...notification, read: true })))
      setStats(prev => ({ ...prev, unread: 0 }))

      playSound?.('success')
    } catch (err) {
      console.error('Error marking all notifications as read:', err)
    }
  }, [user?.id, notifications, playSound])

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
    if (!user?.id) return

    let channel: RealtimeChannel

    const setupRealtime = async () => {
      channel = supabase
        .channel('client-notifications')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              const newNotification = payload.new as ClientNotification
              
              // Adicionar nova notificação
              setNotifications(prev => {
                const updatedNotifications = [newNotification, ...prev]
                setStats(calculateStats(updatedNotifications))
                return updatedNotifications
              })
              
              // Som baseado no tipo específico para participantes
              const soundMap: Record<string, 'pop' | 'success' | 'error' | 'notification' | 'reward' | 'chime' | 'click'> = {
                success: 'reward', // Para missões aprovadas, bônus, etc.
                error: 'error',
                warning: 'notification',
                info: 'chime',
                activity: 'pop'
              }
              playSound?.(soundMap[newNotification.type] || 'notification')
              
            } else if (payload.eventType === 'UPDATE') {
              const updatedNotification = payload.new as ClientNotification
              setNotifications(prev => prev.map(n => 
                n.id === updatedNotification.id ? updatedNotification : n
              ))
            } else if (payload.eventType === 'DELETE') {
              const deletedId = payload.old.id
              setNotifications(prev => prev.filter(n => n.id !== deletedId))
            }
          }
        )
        .subscribe()
    }

    setupRealtime()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [user?.id, calculateStats, playSound])

  // Buscar notificações ao montar o componente
  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

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
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    // Funções específicas para participantes
    getRecentRewards,
    getMissionNotifications,
    getAchievementNotifications,
    // Estados derivados úteis
    hasUnread: stats.unread > 0,
    hasRecentActivity: stats.recentActivity > 0
  }
} 