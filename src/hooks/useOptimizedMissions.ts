
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { missionService } from '@/services/supabase';
import { Mission } from '@/types/mission-unified';

export const useOptimizedMissions = () => {
  const { user } = useAuth();

  const {
    data: missions = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['missions', 'active'],
    queryFn: async () => {
      const data = await missionService.getMissions('ativa');
      return data as Mission[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!user,
  });

  return {
    missions,
    loading: isLoading,
    error: error?.message || '',
    refetch
  };
};
