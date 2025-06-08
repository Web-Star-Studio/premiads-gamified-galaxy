
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

      // Usar query direta enquanto RPC não está disponível
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('rifas, cashback_balance')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      // Buscar missões completadas
      const { data: rewards, error: rewardsError } = await supabase
        .from('mission_rewards')
        .select('rifas_earned')
        .eq('user_id', user.id);

      if (rewardsError) throw rewardsError;

      const missionsCompleted = rewards?.length || 0;
      const totalEarnedRifas = rewards?.reduce((sum, r) => sum + (r.rifas_earned || 0), 0) || 0;

      return {
        rifas: profile?.rifas || 0,
        cashback_balance: profile?.cashback_balance || 0,
        missions_completed: missionsCompleted,
        total_earned_rifas: totalEarnedRifas
      };
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos (React Query v5)
    refetchOnWindowFocus: false,
    refetchInterval: 5 * 60 * 1000,
  });
};
