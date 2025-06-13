import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';
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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data: functionData, error: functionError } = await supabase.rpc('get_all_users');
      
      if (functionError) throw functionError;
      
      if (!functionData) {
        setUsers([]);
        return;
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
      
      setUsers(mappedUsers);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message);
      toast({
        title: 'Error fetching users',
        description: err.message,
        variant: 'destructive'
      });
      
      // Set empty array to avoid UI issues
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    let profilesSubscription: RealtimeChannel;

    // Initial fetch
    fetchUsers();

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
          // Refresh user list when profiles change
          fetchUsers();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      profilesSubscription.unsubscribe();
    };
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers
  };
};
