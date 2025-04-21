
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from './useUsers';

export const useUserOperations = () => {
  const { toast } = useToast();

  const updateUserStatus = useCallback(async (userId: string, isActive: boolean) => {
    try {
      const { error } = await supabase.rpc('update_user_status', {
        user_id: userId,
        is_active: isActive
      });
        
      if (error) throw error;
      
      toast({
        title: 'User updated',
        description: `User status updated to ${isActive ? 'active' : 'inactive'}`
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
      const { error } = await supabase.rpc('delete_user_account', {
        target_user_id: userId
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
