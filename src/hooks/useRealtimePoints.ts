
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRealtimePoints = (initialPoints: number = 0, userId?: string) => {
  const [points, setPoints] = useState(initialPoints);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUserPoints = useCallback(async () => {
    try {
      // If no userId is provided, get the current user's id
      let targetUserId = userId;
      
      if (!targetUserId) {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("No authenticated session");
          setLoading(false);
          return;
        }
        
        targetUserId = session.user.id;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', targetUserId)
        .single();
        
      if (error) {
        console.error('Error fetching user points:', error);
        if (error.code !== 'PGRST116') { // Not "no rows returned" error
          toast({
            title: "Erro ao carregar pontos",
            description: "Não foi possível sincronizar os pontos. Tente novamente.",
            variant: "destructive"
          });
        }
      } else if (data) {
        setPoints(data.points || 0);
      }
    } catch (error) {
      console.error('Error in fetchUserPoints:', error);
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);
  
  useEffect(() => {
    // Initialize with passed value
    setPoints(initialPoints);
    
    fetchUserPoints();
    
    // Set up realtime subscription
    const setupRealtimeSubscription = async () => {
      let targetUserId = userId;
      
      if (!targetUserId) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return null;
        targetUserId = session.user.id;
      }
      
      const channel = supabase
        .channel('profile-points-changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${targetUserId}`
          },
          (payload) => {
            console.log('Profile points changed:', payload);
            if (payload.new && 'points' in payload.new) {
              setPoints(payload.new.points as number);
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('Subscribed to profile points changes');
          }
          if (status === 'CHANNEL_ERROR') {
            console.error('Error subscribing to profile points changes');
          }
        });
        
      return channel;
    };
    
    const channelPromise = setupRealtimeSubscription();
    
    return () => {
      channelPromise.then(channel => {
        if (channel) supabase.removeChannel(channel);
      });
    };
  }, [initialPoints, userId, fetchUserPoints, toast]);
  
  return { 
    points, 
    loading,
    refreshPoints: fetchUserPoints 
  };
};
