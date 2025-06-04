
import { QueryClient } from '@tanstack/react-query';

// Query keys factory for consistency
export const queryKeys = {
  all: ['queries'] as const,
  auth: () => [...queryKeys.all, 'auth'] as const,
  user: (id: string) => [...queryKeys.auth(), 'user', id] as const,
  
  missions: () => [...queryKeys.all, 'missions'] as const,
  mission: (id: string) => [...queryKeys.missions(), id] as const,
  userMissions: (userId: string) => [...queryKeys.missions(), 'user', userId] as const,
  
  campaigns: () => [...queryKeys.all, 'campaigns'] as const,
  campaign: (id: string) => [...queryKeys.campaigns(), id] as const,
  
  stats: () => [...queryKeys.all, 'stats'] as const,
  clientStats: (userId: string) => [...queryKeys.stats(), 'client', userId] as const,
  
  raffles: () => [...queryKeys.all, 'raffles'] as const,
  raffle: (id: string) => [...queryKeys.raffles(), id] as const,
};

// Optimized query client configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Aggressive caching for better performance
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) return false;
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
    mutations: {
      retry: 1,
    },
  },
});
