
import { create } from 'zustand';

interface UIState {
  // Modal states
  modals: {
    profile: boolean;
    mission: boolean;
    [key: string]: boolean;
  };
  
  // Loading states
  globalLoading: boolean;
  loadingStates: Record<string, boolean>;
  
  // Navigation
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  
  // Theme
  darkMode: boolean;
  
  // Actions
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  toggleModal: (modalId: string) => void;
  setGlobalLoading: (loading: boolean) => void;
  setLoading: (key: string, loading: boolean) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleDarkMode: () => void;
  reset: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  // Initial state
  modals: {
    profile: false,
    mission: false
  },
  globalLoading: false,
  loadingStates: {},
  sidebarOpen: true,
  mobileMenuOpen: false,
  darkMode: false,
  
  // Actions
  openModal: (modalId) => set((state) => ({
    modals: { ...state.modals, [modalId]: true }
  })),
  
  closeModal: (modalId) => set((state) => ({
    modals: { ...state.modals, [modalId]: false }
  })),
  
  toggleModal: (modalId) => set((state) => ({
    modals: { ...state.modals, [modalId]: !state.modals[modalId] }
  })),
  
  setGlobalLoading: (globalLoading) => set({ globalLoading }),
  
  setLoading: (key, loading) => set((state) => ({
    loadingStates: { ...state.loadingStates, [key]: loading }
  })),
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  
  setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
  
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  
  reset: () => set({
    modals: { profile: false, mission: false },
    globalLoading: false,
    loadingStates: {},
    sidebarOpen: true,
    mobileMenuOpen: false
  })
}));
