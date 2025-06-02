// Temporarily disabled. Stub implementation pending full tickets/cashback refactor.
import { useMemo } from 'react'

/**
 * Hook for managing user credits with real-time updates
 * @returns Object containing credit information and helper functions
 */
export function useUserCredits() {
  return useMemo(() => ({
    credits: { totalTokens: 0, availableTokens: 0, usedTokens: 0 },
    totalCredits: 0,
    availableCredits: 0,
    usedCredits: 0,
    isLoading: false,
    isInitialized: true,
    error: null,
    hasEnoughCredits: () => true,
    refreshCredits: async () => {}
  }), [])
}
