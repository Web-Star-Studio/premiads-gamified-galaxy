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
        .select('rifas')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        const rifasCount = Number(data.rifas) || 0
        const userCredits: UserCredits = {
          totalTokens: rifasCount,
          usedTokens: 0,
          availableTokens: rifasCount
        }
        set({ credits: userCredits })
      } else {
        set({ credits: initialState })
      }
    } catch (err: any) {
      set({ error: err.message || 'Erro ao buscar rifas' });
      console.error('Erro ao buscar rifas:', err);
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
