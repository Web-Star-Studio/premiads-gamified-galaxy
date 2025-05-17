
import { useEffect, useState } from 'react';
import { useCreditsStore } from '@/store/useCreditsStore';
import { useSounds } from '@/hooks/use-sounds';
import { useAuth } from '@/hooks/useAuth';
import { realtimeCreditsService } from '@/services/realtime-credits';

/**
 * Hook for managing user credits with real-time updates
 * @returns Object containing credit information and helper functions
 */
export function useUserCredits() {
  const { user } = useAuth();
  const { playSound } = useSounds();
  const { credits, isLoading, error, fetchCredits } = useCreditsStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch initial credits and set up real-time subscription
  useEffect(() => {
    if (!user?.id) return;
    
    // Fetch initial credits
    const initCredits = async () => {
      await fetchCredits(user.id);
      setIsInitialized(true);
    };
    
    initCredits();
    
    // Set up real-time listener
    const unsubscribeListener = realtimeCreditsService.addUpdateListener(() => {
      // When credits are updated, play sound and refresh credits
      playSound('reward');
      fetchCredits(user.id);
    });
    
    // Cleanup subscription on unmount
    return () => {
      unsubscribeListener();
    };
  }, [user?.id, fetchCredits, playSound]);
  
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
