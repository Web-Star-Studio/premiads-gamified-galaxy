
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useMemo } from 'react';

interface OptimizedMission {
  id: string;
  title: string;
  description: string;
  type: string;
  rifas: number;
  cashback_reward: number;
  has_badge: boolean;
  has_lootbox: boolean;
  end_date: string;
  advertiser_id: string;
  advertiser_name: string;
  advertiser_avatar: string;
}

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
      return data;
    },
    enabled: !!user,
    staleTime: 10 * 60 * 1000, // 10 minutos - missões mudam pouco
    cacheTime: 30 * 60 * 1000, // 30 minutos
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
