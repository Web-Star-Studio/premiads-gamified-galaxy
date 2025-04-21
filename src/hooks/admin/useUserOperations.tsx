
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PostgrestError } from '@supabase/supabase-js';

interface UpdateUserStatusParams {
  user_id: string;
  is_active: boolean;
}

interface DeleteUserParams {
  target_user_id: string;
}

export const useUserOperations = () => {
  const { toast } = useToast();

  const updateUserStatus = useCallback(async (userId: string, isActive: boolean) => {
    try {
      // Corrigimos a chamada para que ela corresponda à função RPC no Supabase
      const { error } = await supabase.rpc('update_user_status', {
        user_id: userId,
        is_active: isActive
      } as UpdateUserStatusParams);
        
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

  const deleteUser = useCallback(async (userId: string) => {
    try {
      // Corrigimos a chamada para que ela corresponda à função RPC no Supabase
      const { error } = await supabase.rpc('delete_user_account', {
        target_user_id: userId
      } as DeleteUserParams);
        
      if (error) throw error;
      
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
    deleteUser
  };
};
