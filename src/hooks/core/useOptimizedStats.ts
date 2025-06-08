
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { UserStats } from '@/types/optimized';

export const useOptimizedStats = () => {
  const { user } = useAuth();

  return useQuery<UserStats>({
    queryKey: ['user-stats-fast', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('get_user_stats_fast', {
        p_user_id: user.id
      });

      if (error) throw error;
      
      // Handle the response format from our new RPC function
      const stats = Array.isArray(data) ? data[0] : data;
      return {
        rifas: stats?.rifas || 0,
        cashback_balance: stats?.cashback_balance || 0,
        missions_completed: stats?.missions_completed || 0,
        total_earned_rifas: stats?.total_earned_rifas || 0
      };
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos (React Query v5)
    refetchOnWindowFocus: false,
    refetchInterval: 5 * 60 * 1000,
  });
};
