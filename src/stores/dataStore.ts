
import { create } from 'zustand';
import { ClientStats } from '@/hooks/useClientStats';

interface DataState {
  // Cache data
  clientStats: ClientStats | null;
  missions: any[];
  campaigns: any[];
  
  // Cache metadata
  lastFetch: Record<string, number>;
  
  // Actions
  setClientStats: (stats: ClientStats) => void;
  setMissions: (missions: any[]) => void;
  setCampaigns: (campaigns: any[]) => void;
  setLastFetch: (key: string, timestamp: number) => void;
  isStale: (key: string, maxAge: number) => boolean;
  invalidateCache: (key?: string) => void;
  reset: () => void;
}

export const useDataStore = create<DataState>((set, get) => ({
  // Initial state
  clientStats: null,
  missions: [],
  campaigns: [],
  lastFetch: {},
  
  // Actions
  setClientStats: (clientStats) => set({ clientStats }),
  
  setMissions: (missions) => set({ missions }),
  
  setCampaigns: (campaigns) => set({ campaigns }),
  
  setLastFetch: (key, timestamp) => set((state) => ({
    lastFetch: { ...state.lastFetch, [key]: timestamp }
  })),
  
  isStale: (key, maxAge) => {
    const lastFetch = get().lastFetch[key];
    if (!lastFetch) return true;
    return Date.now() - lastFetch > maxAge;
  },
  
  invalidateCache: (key) => {
    if (key) {
      set((state) => {
        const newLastFetch = { ...state.lastFetch };
        delete newLastFetch[key];
        return { lastFetch: newLastFetch };
      });
    } else {
      set({ lastFetch: {} });
    }
  },
  
  reset: () => set({
    clientStats: null,
    missions: [],
    campaigns: [],
    lastFetch: {}
  })
}));
