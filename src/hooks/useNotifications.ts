import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useSounds } from '@/hooks/use-sounds'
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotificationService, createCustomNotificationService } from '@/lib/services/notifications'
import type { RealtimeChannel } from '@supabase/supabase-js'
import type { NotificationRecord } from '@/lib/services/notifications'

export type Notification = NotificationRecord

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
      const notificationList = await getNotifications({ userId: user.id })
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
      await markNotificationAsRead({ userId: user.id, notificationId })
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }, [user?.id])

  // Marcar todas como lidas
  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return

    try {
      await markAllNotificationsAsRead({ userId: user.id })
    } catch (err) {
      console.error('Error marking all notifications as read:', err)
    }
  }, [user?.id])

  // Deletar notificação
  const deleteNotification = useCallback(async (notificationId: string) => {
    if (!user?.id) return

    try {
      await deleteNotificationService({ userId: user.id, notificationId })
    } catch (err) {
      console.error('Error deleting notification:', err)
    }
  }, [user?.id])

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
      await createCustomNotificationService({ targetUserId, title, message, type, category, data })
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