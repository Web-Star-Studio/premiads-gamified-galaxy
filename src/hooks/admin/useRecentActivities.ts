import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Activity {
  id: string;
  event: string;
  user: string;
  timestamp: string;
  type: 'user' | 'permission' | 'raffle' | 'moderation' | 'system';
}

interface LogRecord {
  id: string;
  type: string;
  action: string;
  user_name: string;
  created_at: string;
}

export const useRecentActivities = () => {
  return useQuery({
    queryKey: ['recent-activities'],
    queryFn: async (): Promise<Activity[]> => {
      // Fetch recent logs using a raw query to avoid type issues
      const { data: logs, error } = await supabase
        .rpc('get_recent_activities', { limit_count: 5 });
      
      if (error) {
        console.error('Error fetching recent activities:', error);
        throw new Error(`Failed to fetch recent activities: ${error.message}`);
      }
      
      if (!logs || logs.length === 0) {
        return [];
      }
      
      // Map logs to Activity interface
      return (logs as LogRecord[]).map(log => {
        // Map log type to UI type
        let activityType: 'user' | 'permission' | 'raffle' | 'moderation' | 'system';
        
        switch(log.type) {
          case 'ADMIN_ADD':
            activityType = 'user';
            break;
          case 'PERMISSION_CHANGE':
            activityType = 'permission';
            break;
          case 'RIFA_CRIADA':
            activityType = 'raffle';
            break;
          case 'MISSAO_SUBMETIDA':
            activityType = 'moderation';
            break;
          default:
            activityType = 'system';
        }
        
        // Format timestamp
        const createdAt = new Date(log.created_at);
        const now = new Date();
        const diffMs = now.getTime() - createdAt.getTime();
        const diffMins = Math.round(diffMs / 60000);
        const diffHours = Math.round(diffMins / 60);
        
        let timestamp = '';
        if (diffMins < 60) {
          timestamp = `Há ${diffMins} minutos`;
        } else if (diffHours < 24) {
          timestamp = `Há ${diffHours} horas`;
        } else {
          const diffDays = Math.round(diffHours / 24);
          timestamp = `Há ${diffDays} dias`;
        }
        
        return {
          id: log.id,
          event: log.action,
          user: log.user_name || 'Sistema',
          timestamp,
          type: activityType
        };
      });
    },
    refetchInterval: 30000,
  });
};
