
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from './useUsers';

export const useUserOperations = () => {
  const { toast } = useToast();

  const updateUserStatus = useCallback(async (userId: string, active: boolean) => {
    try {
      const updateData = { active };
      
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);
        
      if (error) throw error;
      
      toast({
        title: 'User updated',
        description: `User status updated to ${active ? 'active' : 'inactive'}`
      });

      return true;
    } catch (err: any) {
      console.error('Error updating user status:', err);
      toast({
        title: 'Error updating user',
        description: err.message,
        variant: 'destructive'
      });
      return false;
    }
  }, [toast]);

  const deleteUser = useCallback(async (userId: string) => {
    try {
      const { error } = await supabase.rpc('delete_user', {
        user_id: userId
      });
        
      if (error) throw error;
      
      toast({
        title: 'User deleted',
        description: 'User has been deleted successfully'
      });

      return true;
    } catch (err: any) {
      console.error('Error deleting user:', err);
      toast({
        title: 'Error deleting user',
        description: err.message,
        variant: 'destructive'
      });
      return false;
    }
  }, [toast]);

  return {
    updateUserStatus,
    deleteUser
  };
};
