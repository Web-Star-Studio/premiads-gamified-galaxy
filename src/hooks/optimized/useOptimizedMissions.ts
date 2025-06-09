
import { useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { missionService } from '@/services/supabase';
import { Mission, mapSupabaseMissionToMission } from '@/types/mission-unified';

export const useOptimizedMissions = () => {
  const { user } = useAuth();

  // Memoize query key to prevent unnecessary refetches
  const queryKey = useMemo(() => ['missions', 'active', user?.id], [user?.id]);

  const {
    data: missions = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey,
    queryFn: async () => {
      console.log('⚡ Fetching missions with optimized query');
      const data = await missionService.getMissions('ativa');
      return data.map(mapSupabaseMissionToMission);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!user,
    select: useCallback((data: Mission[]) => {
      console.log('⚡ Selecting and sorting missions');
      return data.sort((a, b) => {
        // Sort by deadline first, then by reward
        const aDeadline = a.deadline ? new Date(a.deadline).getTime() : Infinity;
        const bDeadline = b.deadline ? new Date(b.deadline).getTime() : Infinity;
        
        if (aDeadline !== bDeadline) {
          return aDeadline - bDeadline;
        }
        
        return (b.rifas || 0) - (a.rifas || 0);
      });
    }, []),
  });

  // Memoize filtered missions by status
  const activeMissions = useMemo(() => 
    missions.filter(mission => mission.status === 'ativa'),
    [missions]
  );

  const completedMissions = useMemo(() => 
    missions.filter(mission => mission.status === 'completa'),
    [missions]
  );

  // Memoize refetch function
  const optimizedRefetch = useCallback(async () => {
    console.log('⚡ Optimized missions refetch');
    return await refetch();
  }, [refetch]);

  return {
    missions,
    activeMissions,
    completedMissions,
    loading: isLoading,
    error: error?.message || '',
    refetch: optimizedRefetch
  };
};
