
import { useQuery } from '@tanstack/react-query';
import { useDataStore } from '@/stores/dataStore';
import { queryKeys } from '@/lib/query-client';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/integrations/supabase/client';

export interface ClientStats {
  rifas: number;
  cashback: number;
  completedMissions: number;
  totalEarnings: number;
}

export function useClientStats() {
  const { user } = useAuthStore();
  const { clientStats, setClientStats, isStale } = useDataStore();
  
  const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

  return useQuery({
    queryKey: queryKeys.clientStats(user?.id || 'anonymous'),
    queryFn: async (): Promise<ClientStats> => {
      // Return cached data if not stale
      if (clientStats && !isStale('clientStats', CACHE_TIME)) {
        return clientStats;
      }

      // Fetch real data if user is authenticated
      if (user?.id) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('rifas, cashback_balance')
            .eq('id', user.id)
            .single();

          if (error) throw error;

          const stats: ClientStats = {
            rifas: profile?.rifas || 0,
            cashback: profile?.cashback_balance || 0,
            completedMissions: 0, // TODO: Calculate from mission_rewards
            totalEarnings: (profile?.rifas || 0) + (profile?.cashback_balance || 0)
          };

          // Cache the result
          setClientStats(stats);
          useDataStore.getState().setLastFetch('clientStats', Date.now());
          
          return stats;
        } catch (error) {
          console.error('Error fetching client stats:', error);
        }
      }

      // Fallback data
      const stats: ClientStats = {
        rifas: 0,
        cashback: 0,
        completedMissions: 0,
        totalEarnings: 0
      };

      // Cache the result
      setClientStats(stats);
      useDataStore.getState().setLastFetch('clientStats', Date.now());
      
      return stats;
    },
    enabled: !!user,
    staleTime: CACHE_TIME,
  });
}
