import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import React from 'react';

export const useUserCredits = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: userCredits = 0,
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['user-rifas', user?.id],
    queryFn: async () => {
      if (!user) return 0;

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
    enabled: !!user,
    staleTime: 0, // Always consider data stale to ensure fresh fetch
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 30000, // Refetch every 30 seconds as fallback
  });

  const refreshCredits = async () => {
    console.log('Refreshing credits...');
    // Force refetch by invalidating and removing the query
    await queryClient.invalidateQueries({ queryKey: ['user-rifas', user?.id] });
    await queryClient.removeQueries({ queryKey: ['user-rifas', user?.id] });
    const result = await refetch();
    console.log('Credits refreshed, new value:', result.data);
    return result;
  };

  // Listen to realtime changes in rifas
  const setupRealtimeSubscription = React.useCallback(() => {
    if (!user) return;

    console.log('Setting up realtime subscription for user:', user.id);

    const subscription = supabase
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
          console.log('New rifas value:', payload.new?.rifas);
          
          // Force immediate refetch
          queryClient.invalidateQueries({ queryKey: ['user-rifas', user?.id] });
          queryClient.removeQueries({ queryKey: ['user-rifas', user?.id] });
          refetch();
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    return () => {
      console.log('Cleaning up realtime subscription');
      supabase.removeChannel(subscription);
    };
  }, [user?.id, queryClient, refetch]);

  // Set up realtime subscription
  React.useEffect(() => {
    if (user) {
      const cleanup = setupRealtimeSubscription();
      return cleanup;
    }
  }, [user?.id, setupRealtimeSubscription]);

  // Also listen for any rifa_purchases changes that might affect this user
  React.useEffect(() => {
    if (!user) return;

    console.log('Setting up rifa_purchases subscription for user:', user.id);

    const purchaseSubscription = supabase
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
            // Refresh after a short delay to allow database to update
            setTimeout(() => {
              refreshCredits();
            }, 1000);
          }
        }
      )
      .subscribe((status) => {
        console.log('Purchase subscription status:', status);
      });

    return () => {
      console.log('Cleaning up purchase subscription');
      supabase.removeChannel(purchaseSubscription);
    };
  }, [user?.id, refreshCredits]);

  return {
    userCredits,
    availableCredits: userCredits, // Alias para compatibilidade
    totalCredits: userCredits, // Alias para compatibilidade
    usedCredits: 0, // Placeholder para compatibilidade
    loading,
    isLoading: loading, // Alias para compatibilidade
    error,
    availableCashback: 0, // Placeholder para compatibilidade
    refreshCredits
  };
};
