
import { useQuery } from '@tanstack/react-query';
import { useDataStore } from '@/stores/dataStore';
import { queryKeys } from '@/lib/query-client';
import { useAuthStore } from '@/stores/authStore';

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

      // Mock data for now - replace with actual API call
      const stats: ClientStats = {
        rifas: 150,
        cashback: 25.50,
        completedMissions: 8,
        totalEarnings: 175.50
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
