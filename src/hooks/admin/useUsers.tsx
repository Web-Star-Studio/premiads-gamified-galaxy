
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
      
      // Cast the response data to any type first to avoid TypeScript errors 
      // with the RPC function return type
      const { data: rawData, error } = await supabase.rpc('get_all_users') as { 
        data: any[]; 
        error: any 
      };
        
      if (error) throw error;
      
      if (!rawData) {
        setUsers([]);
        return;
      }
      
      // Map the data to match our User interface
      const mappedUsers: User[] = rawData.map((user: any) => ({
        id: user.id,
        email: user.email,
        name: user.full_name || 'User',
        role: (user.user_type || 'participante') as User['role'],
        status: user.active ? 'active' as const : 'inactive' as const,
        avatar_url: user.avatar_url || undefined,
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

  // Add updateUserStatus method
  const updateUserStatus = async (userId: string, active: boolean) => {
    try {
      setLoading(true);
      
      // Custom update to ensure we're setting the active field
      const { error } = await supabase
        .from('profiles')
        .update({ 
          active: active // Using key without quotes for proper TypeScript handling
        })
        .eq('id', userId);
        
      if (error) throw error;
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, status: active ? 'active' : 'inactive' } 
            : user
        )
      );
      
      toast({
        title: 'User updated',
        description: `User status updated to ${active ? 'active' : 'inactive'}`
      });
    } catch (err: any) {
      console.error('Error updating user status:', err);
      toast({
        title: 'Error updating user',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Add deleteUser method
  const deleteUser = async (userId: string) => {
    try {
      setLoading(true);
      
      // This will delete the auth.user and cascade to the profile via RLS
      // Cast the response to avoid TypeScript errors with the RPC function
      const { error } = await supabase
        .rpc('delete_user', { user_id: userId }) as { error: any };
        
      if (error) throw error;
      
      // Update local state
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      
      toast({
        title: 'User deleted',
        description: 'User has been deleted successfully'
      });
    } catch (err: any) {
      console.error('Error deleting user:', err);
      toast({
        title: 'Error deleting user',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    updateUserStatus,
    deleteUser
  };
};
