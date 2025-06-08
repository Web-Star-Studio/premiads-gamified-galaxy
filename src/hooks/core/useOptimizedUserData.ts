
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { OptimizedUserData } from '@/types/optimized';

export const useOptimizedUserData = () => {
  const { user } = useAuth();

  return useQuery<OptimizedUserData>({
    queryKey: ['optimized-user-data', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      // Buscar dados do perfil
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Buscar recompensas recentes
      const { data: recentRewards, error: rewardsError } = await supabase
        .from('mission_rewards')
        .select(`
          id,
          rifas_earned,
          cashback_earned,
          rewarded_at,
          missions(title, type)
        `)
        .eq('user_id', user.id)
        .order('rewarded_at', { ascending: false })
        .limit(5);

      if (rewardsError) throw rewardsError;

      // Buscar contadores
      const { data: submissions, error: submissionsError } = await supabase
        .from('mission_submissions')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'pending');

      if (submissionsError) throw submissionsError;

      const { data: completedMissions, error: completedError } = await supabase
        .from('mission_rewards')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (completedError) throw completedError;

      const { data: badges, error: badgesError } = await supabase
        .from('user_badges')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (badgesError) throw badgesError;

      const formattedRewards = recentRewards?.map(reward => ({
        id: reward.id,
        rifas_earned: reward.rifas_earned,
        cashback_earned: reward.cashback_earned || 0,
        rewarded_at: reward.rewarded_at,
        mission_title: (reward.missions as any)?.title || 'Missão',
        mission_type: (reward.missions as any)?.type || 'form'
      })) || [];

      return {
        profile: {
          id: profile.id,
          full_name: profile.full_name || '',
          avatar_url: profile.avatar_url,
          rifas: profile.rifas || 0,
          cashback_balance: profile.cashback_balance || 0,
          user_type: profile.user_type || 'participante',
          profile_completed: profile.profile_completed || false
        },
        recent_rewards: formattedRewards,
        active_submissions_count: submissions?.length || 0,
        completed_missions_count: completedMissions?.length || 0,
        total_badges: badges?.length || 0
      };
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (React Query v5)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
