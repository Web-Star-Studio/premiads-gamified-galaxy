
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const CreateAdminUser = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const createAdminUser = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('create-admin-user', {
        body: JSON.stringify({
          email: 'felipe@webstar.studio',
          password: 'Client@123',
          fullName: 'Felipe Antunes',
          adminKey: 'your-admin-key-here' // This will be handled by the edge function's env var
        })
      });

      if (error) throw error;

      toast({
        title: 'Admin User Created',
        description: 'Felipe Antunes has been successfully added as an admin user.',
      });
    } catch (error: any) {
      console.error('Error creating admin user:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create admin user',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button 
        onClick={createAdminUser} 
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? 'Creating...' : 'Create Admin User'}
      </button>
    </div>
  );
};

export default CreateAdminUser;
