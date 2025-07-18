import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';

export interface ClientStats {
  rifas: number;
  cashback: number;
  completedMissions: number;
  totalEarnings: number;
}

export function useClientStats() {
  const { user } = useAuthStore();
  
  const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

  return useQuery({
    queryKey: ['client-stats', user?.id],
    queryFn: async (): Promise<ClientStats> => {
      // Mock data for now - replace with actual API call
      const stats: ClientStats = {
        rifas: 150,
        cashback: 25.50,
        completedMissions: 8,
        totalEarnings: 175.50
      };

      return stats;
    },
    enabled: !!user,
    staleTime: CACHE_TIME,
  });
}
