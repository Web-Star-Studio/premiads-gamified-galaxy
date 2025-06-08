
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useRealtimeOptimized = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    console.log('Setting up optimized realtime subscriptions for user:', user.id);

    // Subscription para mission_rewards
    const rewardsSubscription = supabase
      .channel('mission_rewards_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mission_rewards',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Mission reward realtime update:', payload);
          // Invalidar queries relacionadas
          queryClient.invalidateQueries({ queryKey: ['user-stats-fast', user.id] });
          queryClient.invalidateQueries({ queryKey: ['optimized-user-data', user.id] });
        }
      )
      .subscribe();

    // Subscription para mission_submissions
    const submissionsSubscription = supabase
      .channel('mission_submissions_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mission_submissions',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Mission submission realtime update:', payload);
          queryClient.invalidateQueries({ queryKey: ['optimized-user-data', user.id] });
        }
      )
      .subscribe();

    // Subscription para profiles (atualizações de rifas/cashback)
    const profilesSubscription = supabase
      .channel('profiles_realtime')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`
        },
        (payload) => {
          console.log('Profile realtime update:', payload);
          queryClient.invalidateQueries({ queryKey: ['user-stats-fast', user.id] });
          queryClient.invalidateQueries({ queryKey: ['optimized-user-data', user.id] });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up realtime subscriptions');
      rewardsSubscription.unsubscribe();
      submissionsSubscription.unsubscribe();
      profilesSubscription.unsubscribe();
    };
  }, [user?.id, queryClient]);
};
