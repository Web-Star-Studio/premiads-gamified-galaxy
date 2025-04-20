
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSounds } from '@/hooks/use-sounds';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin?: string;
  avatar_url?: string;
}

// Interface for the JSON structure returned by get_all_users function
interface UserData {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { playSound } = useSounds();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      
      // Use the Postgres function to get all users
      const { data, error: usersError } = await supabase
        .rpc('get_all_users');
        
      if (usersError) throw usersError;
      
      // Properly parse the JSON data before mapping
      const parsedData = Array.isArray(data) ? data.map(item => {
        // Handle each item as a JSON object with expected properties
        if (typeof item === 'object' && item !== null) {
          const jsonItem = item as Record<string, unknown>;
          return {
            id: jsonItem.id as string,
            email: jsonItem.email as string,
            created_at: jsonItem.created_at as string,
            last_sign_in_at: jsonItem.last_sign_in_at as string | null
          } as UserData;
        }
        return null;
      }).filter(Boolean) as UserData[] : [];
      
      // Map the parsed data to our User interface
      const mappedUsers: User[] = parsedData.map(user => ({
        id: user.id,
        name: '', // We might want to fetch full names separately
        email: user.email,
        role: 'admin', // Default to admin since this RPC requires admin role
        status: 'active',
        lastLogin: user.last_sign_in_at 
          ? new Date(user.last_sign_in_at).toLocaleDateString('pt-BR')
          : undefined
      }));
      
      setUsers(mappedUsers);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message);
      toast({
        title: 'Erro ao buscar usuários',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Function to update user status
  const updateUserStatus = async (userId: string, isActive: boolean) => {
    try {
      setLoading(true);
      playSound('pop');
      
      const { error } = await supabase
        .from('profiles')
        .update({ profile_completed: isActive })
        .eq('id', userId);
        
      if (error) throw error;
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, status: isActive ? 'active' : 'inactive' } 
            : user
        )
      );
      
      toast({
        title: `Status alterado para ${isActive ? 'Ativo' : 'Inativo'}`,
        description: `O usuário foi ${isActive ? 'ativado' : 'desativado'}.`,
      });
    } catch (err: any) {
      console.error('Error updating user status:', err);
      toast({
        title: 'Erro ao atualizar status',
        description: err.message,
        variant: 'destructive'
      });
      playSound('error');
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a user
  const deleteUser = async (userId: string) => {
    try {
      setLoading(true);
      playSound('error');
      
      // Only remove from profiles for now, as auth deletion requires admin API access
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      
      if (error) throw error;
      
      // Update local state
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      
      toast({
        title: 'Usuário excluído',
        description: 'O usuário foi removido do sistema.',
      });
    } catch (err: any) {
      console.error('Error deleting user:', err);
      toast({
        title: 'Erro ao excluir usuário',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Load users on component mount
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
