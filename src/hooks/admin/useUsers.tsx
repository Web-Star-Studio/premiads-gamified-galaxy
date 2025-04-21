
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Define a User type that matches what components expect
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'moderator' | 'anunciante' | 'participante';
  status: 'active' | 'inactive' | 'pending';
  avatar_url?: string;
  lastLogin?: string;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.rpc('get_all_users');
        
      if (error) throw error;
      
      if (!data) {
        setUsers([]);
        return;
      }
      
      // Map the response to our User interface
      const mappedUsers: User[] = data.map((user: any) => ({
        id: user.id,
        email: user.email,
        name: user.full_name || 'User',
        role: (user.user_type || 'participante') as User['role'],
        status: user.active ? 'active' : 'inactive',
        avatar_url: user.avatar_url,
        lastLogin: user.last_sign_in_at || 'Never'
      }));
      
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
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers
  };
};
