
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type SessionStatus = 'active' | 'inactive' | 'unknown';

export const useActiveUserSession = () => {
  const [status, setStatus] = useState<SessionStatus>('unknown');
  const [lastActivity, setLastActivity] = useState<Date | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAndUpdateSession = async () => {
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
      
      // Update last activity timestamp
      const now = new Date();
      setLastActivity(now);
      localStorage.setItem('lastActivity', now.toISOString());
    };
    
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
    
    // Clean up
    return () => {
      clearInterval(interval);
      activityEvents.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, [status]);
  
  return { 
    status, 
    lastActivity, 
    userId, 
    isActive: status === 'active',
    refreshSession: async () => {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
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
