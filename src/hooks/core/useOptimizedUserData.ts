
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface OptimizedUserData {
  profile: {
    id: string;
    full_name: string;
    avatar_url?: string;
    rifas: number;
    cashback_balance: number;
    user_type: string;
    profile_completed: boolean;
  };
  recent_rewards: Array<{
    id: string;
    rifas_earned: number;
    cashback_earned: number;
    rewarded_at: string;
    mission_title: string;
    mission_type: string;
  }>;
  active_submissions_count: number;
  completed_missions_count: number;
  total_badges: number;
}

export const useOptimizedUserData = () => {
  const { user } = useAuth();

  return useQuery<OptimizedUserData>({
    queryKey: ['optimized-user-data', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      // Usar a nova função RPC para buscar todos os dados em 1 chamada
      const { data, error } = await supabase.rpc('get_user_dashboard_data', {
        p_user_id: user.id
      });

      if (error) throw error;
      return data as OptimizedUserData;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutos - cache agressivo
    cacheTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
