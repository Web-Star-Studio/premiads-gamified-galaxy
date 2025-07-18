import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'moderator' | 'anunciante' | 'participante';
  status: 'active' | 'inactive' | 'pending';
  avatar_url?: string;
  lastLogin?: string;
}

interface UserRPCResponse {
  id: string;
  email: string;
  full_name: string | null;
  user_type: string;
  active: boolean;
  avatar_url: string | null;
  last_sign_in_at: string | null;
}

export const useUsers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query para buscar usuários
  const {
    data: users = [],
    isLoading: loading,
    error,
    refetch: fetchUsers
  } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async (): Promise<User[]> => {
      const { data: functionData, error: functionError } = await supabase.rpc('get_all_users');
      
      if (functionError) throw functionError;
      
      if (!functionData) {
        return [];
      }
      
      // Parse the JSON data and properly type it
      const mappedUsers: User[] = (functionData as any[]).map((jsonData: any) => {
        // Parse each JSON object to match our UserRPCResponse structure
        const user = jsonData as unknown as UserRPCResponse;
        
        return {
          id: user.id,
          email: user.email,
          name: user.full_name || 'User',
          role: (user.user_type || 'participante') as User['role'],
          status: user.active ? 'active' : 'inactive',
          avatar_url: user.avatar_url || undefined,
          lastLogin: user.last_sign_in_at || 'Never'
        };
      });
      
      return mappedUsers;
    },
    staleTime: 1000 * 60 * 2, // 2 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
    retry: 3
  });

  // Handle query errors
  if (error) {
    console.error('Error fetching users:', error);
    toast({
      title: 'Error fetching users',
      description: error.message,
      variant: 'destructive'
    });
  }

  // Configurar realtime subscription
  useEffect(() => {
    let profilesSubscription: RealtimeChannel;

    // Set up real-time subscription to profiles table
    profilesSubscription = supabase
      .channel('profiles-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'profiles' 
        }, 
        () => {
          // Invalidate and refetch users when profiles change
          queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      profilesSubscription.unsubscribe();
    };
  }, [queryClient]);

  return {
    users,
    loading,
    error: error?.message || null,
    fetchUsers
  };
};
