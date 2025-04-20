
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type SessionStatus = 'active' | 'inactive' | 'unknown';

export const useActiveUserSession = () => {
  const [status, setStatus] = useState<SessionStatus>('unknown');
  const [lastActivity, setLastActivity] = useState<Date | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const { toast } = useToast();

  const checkAndUpdateSession = useCallback(async () => {
    try {
      // Check for current session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error checking session:', error);
        setStatus('inactive');
        return;
      }
      
      if (!session) {
        console.log('No active session found');
        setStatus('inactive');
        return;
      }
      
      // Set userId and status
      setUserId(session.user.id);
      setStatus('active');
      
      // Fetch user type from profiles
      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .single();
          
        if (profileData) {
          setUserType(profileData.user_type);
        }
      } catch (profileError) {
        console.error('Error fetching user type:', profileError);
      }
      
      // Update last activity timestamp
      const now = new Date();
      setLastActivity(now);
      localStorage.setItem('lastActivity', now.toISOString());
    } catch (error) {
      console.error('Error in checkAndUpdateSession:', error);
      toast({
        title: "Erro de sessão",
        description: "Problema ao verificar sua sessão. Tente entrar novamente.",
        variant: "destructive"
      });
      setStatus('inactive');
    }
  }, [toast]);
  
  useEffect(() => {
    // Initial check
    checkAndUpdateSession();
    
    // Set up interval to check session periodically
    const interval = setInterval(() => {
      checkAndUpdateSession();
    }, 60000); // Check every minute
    
    // Set up activity listeners
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    
    const updateActivity = () => {
      const now = new Date();
      setLastActivity(now);
      localStorage.setItem('lastActivity', now.toISOString());
      
      // If status was inactive, check session again
      if (status === 'inactive') {
        checkAndUpdateSession();
      }
    };
    
    // Add event listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, updateActivity);
    });
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN') {
        setUserId(session?.user.id || null);
        setStatus('active');
        const now = new Date();
        setLastActivity(now);
        localStorage.setItem('lastActivity', now.toISOString());
        
        // Fetch user type
        if (session?.user.id) {
          supabase
            .from('profiles')
            .select('user_type')
            .eq('id', session.user.id)
            .single()
            .then(({ data }) => {
              if (data) {
                setUserType(data.user_type);
              }
            });
        }
      }
      
      if (event === 'SIGNED_OUT') {
        setUserId(null);
        setUserType(null);
        setStatus('inactive');
        localStorage.removeItem('lastActivity');
      }
    });
    
    // Clean up
    return () => {
      clearInterval(interval);
      activityEvents.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
      subscription.unsubscribe();
    };
  }, [status, checkAndUpdateSession]);
  
  return { 
    status, 
    lastActivity, 
    userId,
    userType,
    isAdmin: userType === 'admin',
    isActive: status === 'active',
    refreshSession: async () => {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Error refreshing session:', error);
        toast({
          title: "Erro de sessão",
          description: "Não foi possível atualizar sua sessão. Tente entrar novamente.",
          variant: "destructive"
        });
        setStatus('inactive');
        return false;
      }
      
      if (data.session) {
        setStatus('active');
        const now = new Date();
        setLastActivity(now);
        localStorage.setItem('lastActivity', now.toISOString());
        return true;
      }
      
      return false;
    }
  };
};
