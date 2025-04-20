
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRealtimePoints = (initialPoints: number = 0) => {
  const [points, setPoints] = useState(initialPoints);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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
          if (error.code !== 'PGRST116') { // Not "no rows returned" error
            toast({
              title: "Erro ao carregar pontos",
              description: "Não foi possível sincronizar seus pontos. Tente novamente.",
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
  }, [initialPoints, toast]);
  
  return { points, loading };
};
