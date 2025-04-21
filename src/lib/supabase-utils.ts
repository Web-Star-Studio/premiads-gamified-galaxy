
import { supabase } from '@/integrations/supabase/client';

export const fetchAllUsers = async () => {
  try {
    const { data, error } = await supabase.rpc('get_all_users');
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const fetchUserById = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};
