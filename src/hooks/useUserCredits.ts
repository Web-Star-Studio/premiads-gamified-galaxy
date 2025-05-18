
import { useEffect, useState } from 'react';
import { useCreditsStore } from '@/store/useCreditsStore';
import { useSounds } from '@/hooks/use-sounds';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for managing user credits with real-time updates
 * @returns Object containing credit information and helper functions
 */
export function useUserCredits() {
  const { user } = useAuth();
  const { playSound } = useSounds();
  const { toast } = useToast();
  const { credits, isLoading, error, fetchCredits } = useCreditsStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch initial credits and set up real-time subscription
  useEffect(() => {
    let subscription;
    
    const initCredits = async () => {
      if (!user?.id) return;
      
      // Fetch initial credits
      await fetchCredits(user.id);
      
      // Subscribe to profile changes (credits are stored in profiles table)
      subscription = supabase
        .channel('public:profiles')
        .on('postgres_changes', 
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${user.id}`
          }, 
          (payload) => {
            // When credits/points are updated, play sound and refresh credits
            if (payload.new && payload.old) {
              // Check which values changed
              if (payload.new.credits > payload.old.credits) {
                playSound('reward');
                toast({
                  title: "Créditos adicionados",
                  description: `Você recebeu ${payload.new.credits - payload.old.credits} créditos!`,
                });
              }
              
              if (payload.new.points > payload.old.points) {
                playSound('reward');
                toast({
                  title: "Pontos ganhos",
                  description: `Você ganhou ${payload.new.points - payload.old.points} pontos!`,
                });
              }
              
              // Refresh credits data
              fetchCredits(user.id);
            }
          }
        )
        .subscribe();
      
      setIsInitialized(true);
    };
    
    initCredits();
    
    // Cleanup subscription on unmount
    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [user?.id, fetchCredits, playSound, toast]);
  
  // Derived values for convenience
  const availableCredits = credits.availableTokens;
  const totalCredits = credits.totalTokens;
  const usedCredits = credits.usedTokens;
  
  // Helper functions
  const hasEnoughCredits = (amount: number) => availableCredits >= amount;
  
  // Force manual refresh of credits
  const refreshCredits = async () => {
    if (user?.id) {
      await fetchCredits(user.id);
    }
  };

  return {
    // Values
    credits,
    totalCredits,
    availableCredits,
    usedCredits,
    
    // States
    isLoading,
    isInitialized,
    error,
    
    // Helper functions
    hasEnoughCredits,
    refreshCredits
  };
}
