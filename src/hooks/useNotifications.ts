import { useState, useEffect, useCallback, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useSounds } from '@/hooks/use-sounds'
import type { RealtimeChannel } from '@supabase/supabase-js'

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'activity'
  category: 'system' | 'mission' | 'reward' | 'social' | 'general'
  read: boolean
  data?: any
  created_at: string
  updated_at: string
}

export interface NotificationStats {
  total: number
  unread: number
  byType: Record<string, number>
  byCategory: Record<string, number>
}

export function useNotifications() {
  const { user } = useAuth()
  const { playSound } = useSounds()
  const queryClient = useQueryClient()

  // Query para buscar notificações
  const {
    data: notifications = [],
    isLoading: loading,
    error,
    refetch: fetchNotifications
  } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async (): Promise<Notification[]> => {
      if (!user?.id) return []

      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (fetchError) throw fetchError

      return data || []
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 1, // 1 minuto
    gcTime: 1000 * 60 * 10, // 10 minutos
    retry: 3
  })

  // Calcular estatísticas
  const stats = useMemo((): NotificationStats => {
    const stats: NotificationStats = {
      total: notifications.length,
      unread: notifications.filter(n => !n.read).length,
      byType: {},
      byCategory: {}
    }

    notifications.forEach(notification => {
      // Contar por tipo
      stats.byType[notification.type] = (stats.byType[notification.type] || 0) + 1
      
      // Contar por categoria
      stats.byCategory[notification.category] = (stats.byCategory[notification.category] || 0) + 1
    })

    return stats
  }, [notifications])

  // Mutation para marcar como lida
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      if (!user?.id) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('notifications')
        .update({ read: true, updated_at: new Date().toISOString() })
        .eq('id', notificationId)
        .eq('user_id', user.id)

      if (error) throw error
    },
    onSuccess: (_, notificationId) => {
      // Atualizar cache otimisticamente
      queryClient.setQueryData(['notifications', user?.id], (old: Notification[] | undefined) => {
        if (!old) return old
        return old.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      })

      playSound?.('pop')
    },
    onError: (error) => {
      console.error('Error marking notification as read:', error)
    }
  })

  // Mutation para marcar todas como lidas
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('notifications')
        .update({ read: true, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('read', false)

      if (error) throw error
    },
    onSuccess: () => {
      // Atualizar cache otimisticamente
      queryClient.setQueryData(['notifications', user?.id], (old: Notification[] | undefined) => {
        if (!old) return old
        return old.map(notification => ({ ...notification, read: true }))
      })

      playSound?.('chime')
    },
    onError: (error) => {
      console.error('Error marking all notifications as read:', error)
    }
  })

  // Mutation para deletar notificação
  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      if (!user?.id) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', user.id)

      if (error) throw error
    },
    onSuccess: (_, notificationId) => {
      // Remover do cache otimisticamente
      queryClient.setQueryData(['notifications', user?.id], (old: Notification[] | undefined) => {
        if (!old) return old
        return old.filter(notification => notification.id !== notificationId)
      })

      playSound?.('error')
    },
    onError: (error) => {
      console.error('Error deleting notification:', error)
    }
  })

  // Mutation para criar notificação personalizada
  const createCustomNotificationMutation = useMutation({
    mutationFn: async ({
      targetUserId,
      title,
      message,
      type = 'info',
      category = 'system',
      data = {}
    }: {
      targetUserId: string
      title: string
      message: string
      type?: Notification['type']
      category?: Notification['category']
      data?: any
    }) => {
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
    },
    onSuccess: () => {
      playSound?.('success')
    },
    onError: (error) => {
      console.error('Error creating custom notification:', error)
    }
  })

  // Funções utilitárias para filtrar notificações
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
              
              // Atualizar cache com nova notificação
              queryClient.setQueryData(['notifications', user.id], (old: Notification[] | undefined) => {
                const updated = [newNotification, ...(old || [])]
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
              
              // Atualizar cache com notificação atualizada
              queryClient.setQueryData(['notifications', user.id], (old: Notification[] | undefined) => {
                if (!old) return old
                return old.map(n => 
                  n.id === updatedNotification.id ? updatedNotification : n
                )
              })
            }

            if (payload.eventType === 'DELETE') {
              const deletedId = payload.old.id as string
              
              // Remover do cache
              queryClient.setQueryData(['notifications', user.id], (old: Notification[] | undefined) => {
                if (!old) return old
                return old.filter(n => n.id !== deletedId)
              })
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
  }, [user?.id, queryClient, playSound])

  // Wrapper functions para as mutations
  const markAsRead = async (notificationId: string) => {
    await markAsReadMutation.mutateAsync(notificationId)
  }

  const markAllAsRead = async () => {
    await markAllAsReadMutation.mutateAsync()
  }

  const deleteNotification = async (notificationId: string) => {
    await deleteNotificationMutation.mutateAsync(notificationId)
  }

  const createCustomNotification = async (
    targetUserId: string,
    title: string,
    message: string,
    type: Notification['type'] = 'info',
    category: Notification['category'] = 'system',
    data: any = {}
  ) => {
    await createCustomNotificationMutation.mutateAsync({
      targetUserId,
      title,
      message,
      type,
      category,
      data
    })
  }

  return {
    notifications,
    stats,
    loading,
    error: error?.message || null,
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