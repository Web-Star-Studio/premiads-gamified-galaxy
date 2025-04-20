
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

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { playSound } = useSounds();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get users from auth.users and join with profiles
      const { data: authUsers, error: authError } = await supabase
        .from('auth.users')
        .select('*');
        
      if (authError) throw authError;
      
      // Get profiles with more details
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
        
      if (profilesError) throw profilesError;
      
      // Combine the data
      const combinedUsers = profiles.map(profile => {
        const authUser = authUsers.find(user => user.id === profile.id);
        
        return {
          id: profile.id,
          name: profile.full_name || 'Usuário sem nome',
          email: authUser?.email || 'Email não disponível',
          role: profile.user_type || 'participante',
          status: profile.profile_completed ? 'active' : 'pending',
          lastLogin: authUser?.last_sign_in_at 
            ? new Date(authUser.last_sign_in_at).toLocaleDateString('pt-BR')
            : undefined,
          avatar_url: profile.avatar_url
        };
      });
      
      setUsers(combinedUsers);
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
      
      // Delete from auth will cascade to profiles due to foreign key
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
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
