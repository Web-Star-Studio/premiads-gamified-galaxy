
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuthSession } from '@/hooks/useAuthSession'
import { useEffect } from 'react';

/**
 * Hook for managing user credits with real-time updates
 * @returns Object containing credit information and helper functions
 */
export function useUserCredits() {
  const { user } = useAuthSession()
  const queryClient = useQueryClient()

  // Subscribe to real-time updates for user credits
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`user-credits-${user.id}`)
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'profiles',
          filter: `id=eq.${user.id}` 
        },
        (payload) => {
          console.log('Real-time credit update received:', payload);
          // Invalidate and refetch the user's credits query
          queryClient.invalidateQueries({ queryKey: ['user-rifas', user.id] });
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  const {
    data: rifasData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['user-rifas', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        return { rifas: 0, cashback_balance: 0 }
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('rifas, cashback_balance')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching user rifas:', error)
        throw error
      }

      return { rifas: data?.rifas || 0, cashback_balance: data?.cashback_balance || 0 }
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  })

  const rifas = rifasData?.rifas || 0
  const cashback = rifasData?.cashback_balance || 0

  const refreshCredits = async () => {
    await refetch()
    // Also invalidate related queries
    queryClient.invalidateQueries({ queryKey: ['user-rifas'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] })
  }

  const hasEnoughCredits = (amount: number) => {
    return rifas >= amount
  }

  return {
    credits: { 
      totalTokens: rifas, 
      availableTokens: rifas, 
      usedTokens: 0 
    },
    totalCredits: rifas,
    availableCredits: rifas,
    usedCredits: 0,
    availableCashback: cashback,
    isLoading,
    isInitialized: !isLoading && !error,
    error: error?.message || null,
    hasEnoughCredits,
    refreshCredits
  }
}
