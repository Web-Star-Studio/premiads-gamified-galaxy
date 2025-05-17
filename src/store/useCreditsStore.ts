
import { create } from 'zustand';
import { supabase } from '@/services/supabase';

interface UserCredits {
  totalTokens: number;
  usedTokens: number;
  availableTokens: number;
}

interface CreditsState {
  credits: UserCredits;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchCredits: (userId: string) => Promise<void>;
  refreshCredits: (userId: string) => Promise<void>;
  setCredits: (credits: UserCredits) => void;
  resetCredits: () => void;
}

const initialState: UserCredits = {
  totalTokens: 0,
  usedTokens: 0,
  availableTokens: 0
};

export const useCreditsStore = create<CreditsState>((set, get) => ({
  credits: initialState,
  isLoading: false,
  error: null,
  
  fetchCredits: async (userId: string) => {
    if (!userId) return;
    
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        const creditCount = Number(data.credits) || 0
        const userCredits: UserCredits = {
          totalTokens: creditCount,
          usedTokens: 0,
          availableTokens: creditCount
        }
        set({ credits: userCredits })
      } else {
        set({ credits: initialState })
      }
    } catch (err: any) {
      set({ error: err.message || 'Erro ao buscar créditos' });
      console.error('Erro ao buscar créditos:', err);
    } finally {
      set({ isLoading: false });
    }
  },
  
  refreshCredits: async (userId: string) => {
    await get().fetchCredits(userId);
  },
  
  setCredits: (credits: UserCredits) => {
    set({ credits });
  },
  
  resetCredits: () => {
    set({ credits: initialState });
  }
}));
