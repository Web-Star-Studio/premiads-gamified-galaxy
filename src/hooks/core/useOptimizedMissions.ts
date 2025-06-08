
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
      // Usar query direta enquanto RPC não está disponível
      const { data: missions, error } = await supabase
        .from('missions')
        .select(`
          id,
          title,
          description,
          type,
          rifas,
          cashback_reward,
          has_badge,
          has_lootbox,
          end_date,
          advertiser_id,
          profiles!inner(full_name, avatar_url)
        `)
        .eq('status', 'ativa')
        .eq('is_active', true)
        .range(offset, offset + limit - 1);

      if (error) throw error;

      // Contar total
      const { count, error: countError } = await supabase
        .from('missions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ativa')
        .eq('is_active', true);

      if (countError) throw countError;

      const formattedMissions = missions?.map(mission => ({
        id: mission.id,
        title: mission.title,
        description: mission.description,
        type: mission.type,
        rifas: mission.rifas,
        cashback_reward: mission.cashback_reward,
        has_badge: mission.has_badge,
        has_lootbox: mission.has_lootbox,
        end_date: mission.end_date,
        advertiser_id: mission.advertiser_id,
        advertiser_name: (mission.profiles as any)?.full_name || 'Anunciante',
        advertiser_avatar: (mission.profiles as any)?.avatar_url || ''
      })) || [];

      return {
        missions: formattedMissions,
        total_count: count || 0
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
