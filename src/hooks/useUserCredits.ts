import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useCallback, useRef, useEffect } from 'react';

interface UserCreditsData {
  rifas: number;
  cashback_balance: number;
}

export const useUserCredits = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const subscriptionRef = useRef<any>(null);
  const purchaseSubscriptionRef = useRef<any>(null);
  const isSettingUpRef = useRef(false);

  const {
    data: userCreditsData = { rifas: 0, cashback_balance: 0 },
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['user-credits', user?.id],
    queryFn: async (): Promise<UserCreditsData> => {
      if (!user?.id) return { rifas: 0, cashback_balance: 0 };

      console.log('Fetching user credits for user:', user.id);

      const { data, error } = await supabase
        .from('profiles')
        .select('rifas, cashback_balance')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user credits:', error);
        throw error;
      }

      const result = {
        rifas: data?.rifas || 0,
        cashback_balance: parseFloat(String(data?.cashback_balance || '0'))
      };
      console.log('Fetched credits:', result);
      return result;
    },
    enabled: !!user?.id,
    staleTime: 0, // Always fetch fresh data for credits
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const refreshCredits = useCallback(async () => {
    if (!user?.id) return;
    
    console.log('Refreshing credits...');
    try {
      const result = await refetch();
      console.log('Credits refreshed, new value:', result.data);
      return result;
    } catch (error) {
      console.error('Error refreshing credits:', error);
      throw error;
    }
  }, [user?.id, refetch]);

  // Realtime subscriptions setup
  useEffect(() => {
    if (!user?.id || isSettingUpRef.current) return;
    
    isSettingUpRef.current = true;
    console.log('Setting up realtime subscriptions for user:', user.id);

    const setupSubscriptions = () => {
      // Profiles subscription (for rifas and cashback changes)
      subscriptionRef.current = supabase
        .channel(`profiles_${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${user.id}`,
          },
          (payload) => {
            console.log('Profile updated via realtime:', payload);
            setTimeout(() => {
              queryClient.invalidateQueries({ queryKey: ['user-credits', user.id] });
            }, 1000);
          }
        )
        .subscribe((status) => {
          console.log('Profile subscription status:', status);
        });

      // Mission rewards subscription (for when new rewards are added)
      const rewardsSubscription = supabase
        .channel(`mission_rewards_${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'mission_rewards',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log('Mission reward added via realtime:', payload);
            setTimeout(() => {
              refreshCredits();
            }, 2000);
          }
        )
        .subscribe((status) => {
          console.log('Mission rewards subscription status:', status);
        });

      // Purchase updates subscription
      purchaseSubscriptionRef.current = supabase
        .channel(`rifa_purchases_${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'rifa_purchases',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log('Rifa purchase updated via realtime:', payload);
            if (payload.new?.status === 'confirmed') {
              console.log('Purchase confirmed, refreshing rifas...');
              // Delay the refresh to allow database trigger to complete
              setTimeout(() => {
                refreshCredits();
              }, 2000);
            }
          }
        )
        .subscribe((status) => {
          console.log('Purchase subscription status:', status);
        });
    };

    setupSubscriptions();

    return () => {
      console.log('Cleaning up realtime subscriptions');
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }
      if (purchaseSubscriptionRef.current) {
        supabase.removeChannel(purchaseSubscriptionRef.current);
        purchaseSubscriptionRef.current = null;
      }
      isSettingUpRef.current = false;
    };
  }, [user?.id, queryClient, refreshCredits]);

  return {
    userCredits: userCreditsData?.rifas ?? 0,
    availableCredits: userCreditsData?.rifas ?? 0, // Alias para compatibilidade
    totalCredits: userCreditsData?.rifas ?? 0, // Alias para compatibilidade
    usedCredits: 0, // Placeholder para compatibilidade
    loading: Boolean(loading),
    isLoading: Boolean(loading), // Alias para compatibilidade
    error,
    availableCashback: userCreditsData?.cashback_balance ?? 0, // Agora busca valor real do banco
    refreshCredits
  };
};
