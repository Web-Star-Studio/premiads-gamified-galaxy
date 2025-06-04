
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@supabase/supabase-js';
import { UserType } from '@/types/auth';

interface AuthState {
  // State
  user: User | null;
  userType: UserType;
  userName: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setUserType: (type: UserType) => void;
  setUserName: (name: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      userType: 'participante',
      userName: '',
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      // Actions
      setUser: (user) => set((state) => ({ 
        user, 
        isAuthenticated: !!user,
        error: null
      })),
      
      setUserType: (userType) => set({ userType }),
      
      setUserName: (userName) => set({ userName }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      reset: () => set({
        user: null,
        userType: 'participante',
        userName: '',
        isAuthenticated: false,
        isLoading: false,
        error: null
      })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        userType: state.userType, 
        userName: state.userName 
      })
    }
  )
);
