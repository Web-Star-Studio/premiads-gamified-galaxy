
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UserStats {
  rifas: number;
  cashback_balance: number;
  missions_completed: number;
  total_earned_rifas: number;
}

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
      return data as UserStats;
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutos - stats mudam mais
    cacheTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    refetchInterval: 5 * 60 * 1000, // Atualiza a cada 5 minutos
  });
};
