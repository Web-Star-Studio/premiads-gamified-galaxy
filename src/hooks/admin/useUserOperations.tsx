import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PostgrestError } from '@supabase/supabase-js';

export const useUserOperations = () => {
  const { toast } = useToast();

  const updateUserStatus = useCallback(async (userId: string, isActive: boolean) => {
    try {
      const { data, error } = await supabase.rpc('update_user_status', {
        user_id: userId,
        is_active: isActive
      });
        
      if (error) throw error;
      
      toast({
        title: 'User updated',
        description: `User status updated to ${isActive ? 'active' : 'inactive'}`
      });

      return true;
    } catch (err: unknown) {
      const error = err as PostgrestError;
      console.error('Error updating user status:', error);
      toast({
        title: 'Error updating user',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive'
      });
      return false;
    }
  }, [toast]);

  const updateUserRole = useCallback(async (userId: string, newRole: string) => {
    try {
      const { data, error } = await supabase.rpc(
        'update_user_role' as any, 
        {
          target_user_id: userId,
          new_role: newRole
        }
      );
        
      if (error) throw error;
      
      toast({
        title: 'User role updated',
        description: `User role updated to ${newRole}`
      });

      return true;
    } catch (err: unknown) {
      const error = err as PostgrestError;
      console.error('Error updating user role:', error);
      toast({
        title: 'Error updating user role',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive'
      });
      return false;
    }
  }, [toast]);

  const deleteUser = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('delete_user_account', {
        target_user_id: userId
      });
        
      if (error) {
        if (error.code === '23503') {
          throw new Error('Cannot delete user because they have related data in the system. Consider deactivating the user instead.');
        }
        throw error;
      }
      
      toast({
        title: 'User deleted',
        description: 'User has been deleted successfully'
      });

      return true;
    } catch (err: unknown) {
      const error = err as PostgrestError;
      console.error('Error deleting user:', error);
      toast({
        title: 'Error deleting user',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive'
      });
      return false;
    }
  }, [toast]);

  return {
    updateUserStatus,
    updateUserRole,
    deleteUser
  };
};
