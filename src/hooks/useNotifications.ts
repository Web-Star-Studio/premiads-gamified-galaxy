import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useSounds } from '@/hooks/use-sounds'
import type { RealtimeChannel } from '@supabase/supabase-js'
import type { Tables } from '@/integrations/supabase/types'

export type Notification = Tables<'notifications'>

export interface NotificationStats {
  total: number
  unread: number
  byType: Record<string, number>
  byCategory: Record<string, number>
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    byType: {},
    byCategory: {}
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const { user } = useAuth()
  const { playSound } = useSounds()

  // Calcular estatísticas
  const calculateStats = useCallback((notificationList: Notification[]): NotificationStats => {
    const stats: NotificationStats = {
      total: notificationList.length,
      unread: notificationList.filter(n => !n.read).length,
      byType: {},
      byCategory: {}
    }

    notificationList.forEach(notification => {
      // Contar por tipo
      stats.byType[notification.type] = (stats.byType[notification.type] || 0) + 1
      
      // Contar por categoria
      stats.byCategory[notification.category] = (stats.byCategory[notification.category] || 0) + 1
    })

    return stats
  }, [])

  // Buscar notificações
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (fetchError) throw fetchError

      const notificationList = data || []
      setNotifications(notificationList)
      setStats(calculateStats(notificationList))
    } catch (err) {
      console.error('Error fetching notifications:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar notificações')
    } finally {
      setLoading(false)
    }
  }, [user?.id, calculateStats])

  // Marcar como lida
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!user?.id) return

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true, updated_at: new Date().toISOString() })
        .eq('id', notificationId)
        .eq('user_id', user.id)

      if (error) throw error

      // Atualizar estado local
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      )

      // Recalcular estatísticas
      setNotifications(prev => {
        setStats(calculateStats(prev))
        return prev
      })

      playSound?.('pop')
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }, [user?.id, calculateStats, playSound])

  // Marcar todas como lidas
  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('read', false)

      if (error) throw error

      // Atualizar estado local
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      )

      // Recalcular estatísticas
      setNotifications(prev => {
        setStats(calculateStats(prev))
        return prev
      })

      playSound?.('chime')
    } catch (err) {
      console.error('Error marking all notifications as read:', err)
    }
  }, [user?.id, calculateStats, playSound])

  // Deletar notificação
  const deleteNotification = useCallback(async (notificationId: string) => {
    if (!user?.id) return

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', user.id)

      if (error) throw error

      // Remover do estado local
      setNotifications(prev => {
        const filtered = prev.filter(notification => notification.id !== notificationId)
        setStats(calculateStats(filtered))
        return filtered
      })

      playSound?.('error')
    } catch (err) {
      console.error('Error deleting notification:', err)
    }
  }, [user?.id, calculateStats, playSound])

  // Criar notificação personalizada (para admins)
  const createCustomNotification = useCallback(async (
    targetUserId: string,
    title: string,
    message: string,
    type: Notification['type'] = 'info',
    category: Notification['category'] = 'system',
    data: any = {}
  ) => {
    try {
      const { error } = await supabase.functions.invoke('smart-notifications', {
        body: {
          action: 'create_custom_notification',
          data: {
            user_id: targetUserId,
            title,
            message,
            type,
            category,
            data
          }
        }
      })

      if (error) throw error
      playSound?.('success')
    } catch (err) {
      console.error('Error creating custom notification:', err)
    }
  }, [playSound])

  // Filtrar notificações
  const getNotificationsByType = useCallback((type: string) => {
    return notifications.filter(n => n.type === type)
  }, [notifications])

  const getNotificationsByCategory = useCallback((category: string) => {
    return notifications.filter(n => n.category === category)
  }, [notifications])

  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(n => !n.read)
  }, [notifications])

  // Configurar Realtime
  useEffect(() => {
    if (!user?.id) return

    let channel: RealtimeChannel

    const setupRealtime = async () => {
      channel = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Notification change:', payload)

            if (payload.eventType === 'INSERT') {
              const newNotification = payload.new as Notification
              setNotifications(prev => {
                const updated = [newNotification, ...prev]
                setStats(calculateStats(updated))
                return updated
              })

              // Som baseado no tipo
              const soundMap: Record<string, 'pop' | 'success' | 'error' | 'notification' | 'reward' | 'chime' | 'click'> = {
                success: 'success',
                error: 'error',
                warning: 'pop',
                info: 'chime',
                activity: 'chime'
              }
              playSound?.(soundMap[newNotification.type] || 'chime')
            }

            if (payload.eventType === 'UPDATE') {
              const updatedNotification = payload.new as Notification
              setNotifications(prev => {
                const updated = prev.map(n => 
                  n.id === updatedNotification.id ? updatedNotification : n
                )
                setStats(calculateStats(updated))
                return updated
              })
            }

            if (payload.eventType === 'DELETE') {
              const deletedId = payload.old.id as string
              setNotifications(prev => {
                const updated = prev.filter(n => n.id !== deletedId)
                setStats(calculateStats(updated))
                return updated
              })
            }
          }
        )
        .subscribe()
    }

    setupRealtime()
    fetchNotifications()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [user?.id, fetchNotifications, calculateStats, playSound])

  return {
    notifications,
    stats,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createCustomNotification,
    getNotificationsByType,
    getNotificationsByCategory,
    getUnreadNotifications
  }
} 