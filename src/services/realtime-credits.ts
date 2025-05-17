import { supabase } from '@/integrations/supabase/client';

type UpdateCallback = (eventType: 'INSERT' | 'UPDATE' | 'DELETE') => void;

/**
 * Service to handle real-time updates for user credits
 */
export const realtimeCreditsService = {
  // Current real-time channel for credits updates
  channel: null as any,
  /**
   * List of callbacks to execute when credits are updated
   */
  updateListeners: [] as UpdateCallback[],
  
  /**
   * Subscribes to changes in a user's credits
   * @param userId - The ID of the user to subscribe to
   * @returns Promise that resolves when subscription is established
   */
  subscribeToUserCredits: async (userId: string): Promise<void> => {
    if (!userId) {
      console.warn('Cannot subscribe to credits: No user ID provided');
      return;
    }
    
    // Unsubscribe existing channel if any
    if (realtimeCreditsService.channel) {
      await supabase.removeChannel(realtimeCreditsService.channel)
      realtimeCreditsService.channel = null
    }
    
    // Subscribe to changes in the profiles table for this user
    realtimeCreditsService.channel = supabase
      .channel('profile-credits-changes')
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`
        }, 
        (payload) => {
          // Notify all listeners of the update
          realtimeCreditsService.updateListeners.forEach(callback => {
            callback(payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE');
          });
          
          console.log('Credits updated:', (payload.new as any)?.credits);
        }
      )
      .subscribe();
    
    console.log(`Subscribed to credit updates for user ${userId}`);
  },
  
  /**
   * Unsubscribe from real-time credits updates
   */
  unsubscribe: async (): Promise<void> => {
    if (realtimeCreditsService.channel) {
      await supabase.removeChannel(realtimeCreditsService.channel)
      realtimeCreditsService.channel = null
    }
  },
  
  /**
   * Adds a listener function to be called when credits are updated
   * @param callback - Function to call when credits are updated
   * @returns Unsubscribe function
   */
  addUpdateListener: (callback: UpdateCallback): (() => void) => {
    realtimeCreditsService.updateListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = realtimeCreditsService.updateListeners.indexOf(callback);
      if (index !== -1) {
        realtimeCreditsService.updateListeners.splice(index, 1);
      }
    };
  }
};
