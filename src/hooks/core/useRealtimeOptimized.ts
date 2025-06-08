
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';

// Debounce personalizado mais eficiente
const useDebounce = (callback: Function, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  return (...args: any[]) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => callback(...args), delay);
  };
};

export const useRealtimeOptimized = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!user?.id) return;

    // Debounce para evitar muitas invalidações - mais agressivo
    const debouncedInvalidate = useDebounce((queryKeys: string[]) => {
      queryKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: [key, user.id] });
      });
    }, 1000); // 1 segundo de debounce

    // Canal único para todas as subscriptions do usuário
    const channel = supabase
      .channel(`user-updates-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`
        },
        () => {
          debouncedInvalidate(['optimized-user-data', 'user-stats-fast']);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mission_submissions',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          debouncedInvalidate(['optimized-user-data', 'user-stats-fast']);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mission_rewards',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          debouncedInvalidate(['optimized-user-data', 'user-stats-fast']);
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [user?.id, queryClient]);
};
