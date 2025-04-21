
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserType } from '@/types/auth';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserType;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string | null;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      // Use the get_all_users() function instead of direct table access
      const { data, error } = await supabase.rpc('get_all_users');
      
      if (error) throw error;
      
      // Transform the data to match our User interface
      const transformedUsers: User[] = data.map((user: any) => ({
        id: user.id,
        email: user.email,
        name: user.full_name || user.email.split('@')[0],
        role: user.user_type || 'participante',
        status: 'active', // Default status, adjust as needed
        lastLogin: user.last_sign_in_at
      }));
      
      setUsers(transformedUsers);
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
  };

  const updateUserStatus = async (userId: string, isActive: boolean) => {
    try {
      // Implement user status update logic
      const { error } = await supabase
        .from('profiles')
        .update({ 
          // Assuming we have a status column in the profiles table
          user_status: isActive ? 'active' : 'inactive' 
        })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Optimistically update local state
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, status: isActive ? 'active' : 'inactive' } 
          : user
      ));
      
      toast({
        title: 'Status do usuário atualizado',
        description: `Usuário ${isActive ? 'ativado' : 'desativado'} com sucesso.`
      });
    } catch (err: any) {
      console.error('Error updating user status:', err);
      toast({
        title: 'Erro ao atualizar status',
        description: err.message,
        variant: 'destructive'
      });
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // Implement user deletion logic
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) throw error;
      
      // Remove user from local state
      setUsers(prev => prev.filter(user => user.id !== userId));
      
      toast({
        title: 'Usuário excluído',
        description: 'Usuário removido com sucesso.'
      });
    } catch (err: any) {
      console.error('Error deleting user:', err);
      toast({
        title: 'Erro ao excluir usuário',
        description: err.message,
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { 
    users, 
    loading, 
    error, 
    fetchUsers,
    updateUserStatus,
    deleteUser 
  };
};
