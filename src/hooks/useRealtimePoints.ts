
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useRealtimePoints = (initialPoints: number = 0) => {
  const [points, setPoints] = useState(initialPoints);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize with passed value
    setPoints(initialPoints);
    
    const fetchUserPoints = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("No authenticated session");
          setLoading(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('profiles')
          .select('points')
          .eq('id', session.user.id)
          .single();
          
        if (error) {
          console.error('Error fetching user points:', error);
        } else if (data) {
          setPoints(data.points || 0);
        }
      } catch (error) {
        console.error('Error in fetchUserPoints:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserPoints();
    
    // Set up realtime subscription
    const setupRealtimeSubscription = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return null;
      
      const userId = session.user.id;
      
      const channel = supabase
        .channel('profile-points-changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${userId}`
          },
          (payload) => {
            console.log('Profile points changed:', payload);
            if (payload.new && 'points' in payload.new) {
              setPoints(payload.new.points as number);
            }
          }
        )
        .subscribe();
        
      return channel;
    };
    
    const channelPromise = setupRealtimeSubscription();
    
    return () => {
      channelPromise.then(channel => {
        if (channel) supabase.removeChannel(channel);
      });
    };
  }, [initialPoints]);
  
  return { points, loading };
};
