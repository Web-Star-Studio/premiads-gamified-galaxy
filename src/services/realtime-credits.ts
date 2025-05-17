
import { supabase } from '@/integrations/supabase/client';

type UpdateCallback = (eventType: 'INSERT' | 'UPDATE' | 'DELETE') => void;

/**
 * Service to handle real-time updates for user credits
 */
export const realtimeCreditsService = {
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
    
    // Subscribe to changes in the profiles table for this user
    supabase
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
          
          console.log('Credits updated:', payload.new?.credits);
        }
      )
      .subscribe();
    
    console.log(`Subscribed to credit updates for user ${userId}`);
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
