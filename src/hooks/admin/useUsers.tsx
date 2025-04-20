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
      
      // Get profiles with user information
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
        
      if (profilesError) throw profilesError;
      
      // Get auth metadata if needed (admin only)
      // Note: This requires special permissions, so we'll use profiles data primarily
      let authData: Record<string, any> = {};
      try {
        // Instead of using RPC, we'll just get the relevant data from profiles
        // We'll work with what we have in the profiles table
        console.log("Working with profile data only since we can't access auth users directly");
      } catch (authError) {
        console.warn('Could not fetch auth users data, using profiles only', authError);
      }
      
      // Combine the data - using only profiles data
      const combinedUsers: User[] = profiles.map(profile => {
        // Determine status based on profile data
        let status: 'active' | 'inactive' | 'pending';
        if (profile.profile_completed) {
          status = 'active';
        } else {
          status = 'pending';
        }
        
        return {
          id: profile.id,
          name: profile.full_name || 'Usuário sem nome',
          email: profile.profile_data?.email || 'Email não disponível', // Use profile_data for email if available
          role: profile.user_type || 'participante',
          status,
          lastLogin: profile.updated_at 
            ? new Date(profile.updated_at).toLocaleDateString('pt-BR')
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
