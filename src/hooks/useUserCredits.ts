import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useCallback, useRef, useEffect } from 'react';

export const useUserCredits = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const subscriptionRef = useRef<any>(null);
  const purchaseSubscriptionRef = useRef<any>(null);
  const isSettingUpRef = useRef(false);

  const {
    data: userCredits = 0,
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['user-rifas', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;

      console.log('Fetching user rifas for user:', user.id);

      const { data, error } = await supabase
        .from('profiles')
        .select('rifas')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user credits:', error);
        throw error;
      }

      const rifas = data?.rifas || 0;
      console.log('Fetched rifas:', rifas);
      return rifas;
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

  // Setup realtime subscriptions
  useEffect(() => {
    if (!user?.id || isSettingUpRef.current) return;

    isSettingUpRef.current = true;

    const setupSubscriptions = () => {
      // Clean up existing subscriptions first
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
      if (purchaseSubscriptionRef.current) {
        supabase.removeChannel(purchaseSubscriptionRef.current);
      }

      console.log('Setting up realtime subscription for user:', user.id);

      // Profile updates subscription
      subscriptionRef.current = supabase
        .channel(`user_rifas_changes_${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${user.id}`,
          },
          (payload) => {
            console.log('Rifas updated via realtime:', payload);
            if (payload.new?.rifas !== undefined) {
              console.log('New rifas value:', payload.new.rifas);
              
              // Update the query cache directly
              queryClient.setQueryData(['user-rifas', user.id], payload.new.rifas);
            }
          }
        )
        .subscribe((status) => {
          console.log('Realtime subscription status:', status);
        });

      console.log('Setting up rifa_purchases subscription for user:', user.id);

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
    userCredits,
    availableCredits: userCredits, // Alias para compatibilidade
    totalCredits: userCredits, // Alias para compatibilidade
    usedCredits: 0, // Placeholder para compatibilidade
    loading: Boolean(loading),
    isLoading: Boolean(loading), // Alias para compatibilidade
    error,
    availableCashback: 0, // Placeholder para compatibilidade
    refreshCredits
  };
};
