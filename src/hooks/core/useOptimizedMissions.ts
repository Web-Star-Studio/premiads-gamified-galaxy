
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useMemo } from 'react';
import type { OptimizedMissionsResponse, OptimizedMission } from '@/types/optimized';

export const useOptimizedMissions = (limit = 10, offset = 0) => {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['optimized-missions', limit, offset],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_filtered_missions', {
        p_status: 'ativa',
        p_limit: limit,
        p_offset: offset
      });

      if (error) throw error;
      
      // Handle the response format from our new RPC function
      const response = Array.isArray(data) ? data[0] : data;
      return {
        missions: response?.missions || [],
        total_count: response?.total_count || 0
      };
    },
    enabled: !!user,
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos (React Query v5)
    refetchOnWindowFocus: false,
  });

  const missions = useMemo(() => {
    return data?.missions || [];
  }, [data]);

  return {
    missions,
    totalCount: data?.total_count || 0,
    isLoading,
    error
  };
};
