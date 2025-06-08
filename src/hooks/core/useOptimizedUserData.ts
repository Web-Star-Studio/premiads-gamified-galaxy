
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { OptimizedUserData } from '@/types/optimized';

export const useOptimizedUserData = () => {
  const { user } = useAuth();

  return useQuery<OptimizedUserData>({
    queryKey: ['optimized-user-data', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('get_user_dashboard_data', {
        p_user_id: user.id
      });

      if (error) throw error;
      
      // Type assertion with proper fallbacks
      const userData = data as OptimizedUserData;
      return {
        profile: userData?.profile || {
          id: user.id,
          full_name: '',
          rifas: 0,
          cashback_balance: 0,
          user_type: 'participante',
          profile_completed: false
        },
        recent_rewards: userData?.recent_rewards || [],
        active_submissions_count: userData?.active_submissions_count || 0,
        completed_missions_count: userData?.completed_missions_count || 0,
        total_badges: userData?.total_badges || 0
      };
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (React Query v5)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
