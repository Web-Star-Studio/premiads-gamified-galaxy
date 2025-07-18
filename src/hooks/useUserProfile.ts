import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  user_type: string;
  active: boolean;
}

export const useUserProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Query para buscar perfil do usuário
  const {
    data: profile,
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!user?.id) return null;

      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError);
        throw profileError;
      }

      return data;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
    retry: 3
  });

  // Configurar listener para mudanças em tempo real
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('profile_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Perfil atualizado:', payload);
          if (payload.eventType === 'UPDATE' && payload.new) {
            // Atualizar cache diretamente para mudanças em tempo real
            queryClient.setQueryData(['user-profile', user.id], payload.new as UserProfile);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  return {
    profile,
    loading,
    error: error?.message || null,
    userName: profile?.full_name || profile?.email?.split('@')[0] || 'Usuário',
    userType: profile?.user_type || 'participante',
    refetch
  };
}; 