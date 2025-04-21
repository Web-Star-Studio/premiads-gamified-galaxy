
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

// Define a type for the get_all_users RPC response
interface GetAllUsersResponse {
  id: string;
  email: string;
  full_name?: string; 
  user_type?: string;
  active?: boolean;
  avatar_url?: string;
  last_sign_in_at?: string;
}

// Define RPC function param types
interface DeleteUserParams {
  user_id: string;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fixed: Use proper generic type parameters for RPC call
      const { data: rawData, error } = await supabase
        .rpc<GetAllUsersResponse[], null>('get_all_users', null);
        
      if (error) throw error;
      
      if (!rawData) {
        setUsers([]);
        return;
      }
      
      // Map the data to match our User interface
      const mappedUsers: User[] = rawData.map((user: GetAllUsersResponse) => ({
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
      
      // We need to update the 'active' field in the profiles table
      // But first we need to check if this field exists in the database schema
      // Since it's not in the TypeScript type, we'll use a generic update approach
      
      // Set the update data as a record with any key
      const updateData: Record<string, any> = { active };
      
      // Custom update to ensure we're setting the active field
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
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
      
      // Fixed: Use proper generic type parameters for RPC call
      const { error } = await supabase
        .rpc<null, DeleteUserParams>('delete_user', { user_id: userId });
        
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
