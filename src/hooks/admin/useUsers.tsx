
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
  points?: number;
}

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
      
      // Fetch users through the RPC function
      const { data, error: usersError } = await supabase
        .rpc('get_all_users');
        
      if (usersError) throw usersError;
      
      // Properly parse the JSON data before mapping
      const parsedData = Array.isArray(data) ? data.map(item => {
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
      
      // Fetch additional profile data for each user
      const userPromises = parsedData.map(async (user) => {
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, user_type, profile_completed, avatar_url, points')
            .eq('id', user.id)
            .single();
            
          if (profileError && profileError.code !== 'PGRST116') {
            console.error(`Error fetching profile for user ${user.id}:`, profileError);
          }
          
          return {
            id: user.id,
            name: profileData?.full_name || user.email.split('@')[0],
            email: user.email,
            role: profileData?.user_type || 'participante',
            status: profileData?.profile_completed ? 'active' : 'inactive',
            lastLogin: user.last_sign_in_at 
              ? new Date(user.last_sign_in_at).toLocaleDateString('pt-BR')
              : undefined,
            avatar_url: profileData?.avatar_url,
            points: profileData?.points || 0
          } as User;
        } catch (err) {
          console.error(`Error processing user ${user.id}:`, err);
          return {
            id: user.id,
            name: user.email.split('@')[0],
            email: user.email,
            role: 'participante',
            status: 'pending',
            lastLogin: user.last_sign_in_at 
              ? new Date(user.last_sign_in_at).toLocaleDateString('pt-BR')
              : undefined
          } as User;
        }
      });
      
      const usersWithProfiles = await Promise.all(userPromises);
      setUsers(usersWithProfiles);
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

  // Function to update user role
  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      setLoading(true);
      playSound('pop');
      
      const { error } = await supabase
        .from('profiles')
        .update({ user_type: newRole })
        .eq('id', userId);
        
      if (error) throw error;
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, role: newRole } 
            : user
        )
      );
      
      toast({
        title: `Papel alterado para ${newRole}`,
        description: `O usuário agora tem papel de ${newRole}.`,
      });
    } catch (err: any) {
      console.error('Error updating user role:', err);
      toast({
        title: 'Erro ao atualizar papel',
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

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    updateUserStatus,
    updateUserRole,
    deleteUser
  };
};
