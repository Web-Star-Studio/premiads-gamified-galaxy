
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UserProfile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  email?: string;
  user_type?: string;
  // Add other profile fields here
}

interface UserContextType {
  userProfile: UserProfile | null;
  userName: string;
  userType: string;
  loading: boolean;
  refreshUserProfile: () => Promise<void>;
  setUserType: (type: string) => void;
  setUserName: (name: string) => void;
  setIsOverlayOpen: (open: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userType, setUserType] = useState('participante');
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchUserProfile = useCallback(async () => {
    if (!user?.id) {
      console.log('No user ID, clearing profile');
      setUserProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching user profile for:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        setUserProfile(null);
      } else {
        console.log('Fetched user profile:', data);
        setUserProfile(data);
        if (data.user_type) {
          setUserType(data.user_type);
        }
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const userName = userProfile?.full_name || user?.email?.split('@')[0] || 'Usuário';

  const refreshUserProfile = async () => {
    await fetchUserProfile();
  };

  const setUserName = (name: string) => {
    if (userProfile) {
      setUserProfile({ ...userProfile, full_name: name });
    }
  };

  return (
    <UserContext.Provider value={{ 
      userProfile, 
      userName, 
      userType,
      loading, 
      refreshUserProfile: fetchUserProfile,
      setUserType,
      setUserName,
      setIsOverlayOpen
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
