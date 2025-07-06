import { getSupabaseClient } from '@/lib/supabaseClient'
import { withPerformanceMonitoring as withPerf } from '@/utils/performance-monitor'

export interface NotificationRecord {
  id: string
  user_id: string
  type: string
  category: string
  title: string
  message: string
  data?: any
  read: boolean
  created_at: string
  updated_at: string
}

export const getNotifications = withPerf(
  async ({ userId, limit = 50 }: { userId: string; limit?: number }): Promise<NotificationRecord[]> => {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) throw error
    return data as NotificationRecord[]
  },
  'getNotifications'
)

export const markNotificationAsRead = withPerf(
  async ({ userId, notificationId }: { userId: string; notificationId: string }): Promise<void> => {
    const supabase = await getSupabaseClient()
    const { error } = await supabase
      .from('notifications')
      .update({ read: true, updated_at: new Date().toISOString() })
      .eq('id', notificationId)
      .eq('user_id', userId)
    if (error) throw error
  },
  'markNotificationAsRead'
)

export const markAllNotificationsAsRead = withPerf(
  async ({ userId }: { userId: string }): Promise<void> => {
    const supabase = await getSupabaseClient()
    const { error } = await supabase
      .from('notifications')
      .update({ read: true, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('read', false)
    if (error) throw error
  },
  'markAllNotificationsAsRead'
)

export const deleteNotificationService = withPerf(
  async ({ userId, notificationId }: { userId: string; notificationId: string }): Promise<void> => {
    const supabase = await getSupabaseClient()
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', userId)
    if (error) throw error
  },
  'deleteNotification'
)

export const createCustomNotificationService = withPerf(
  async ({ targetUserId, title, message, type, category, data }: {
    targetUserId: string
    title: string
    message: string
    type: string
    category: string
    data?: any
  }): Promise<void> => {
    const supabase = await getSupabaseClient()
    const { error } = await supabase.functions.invoke('smart-notifications', {
      body: {
        action: 'create_custom_notification',
        data: { user_id: targetUserId, title, message, type, category, data }
      }
    })
    if (error) throw error
  },
  'createCustomNotification'
) 