
import { useMemo, useCallback } from 'react';
import { useAuth as useBaseAuth } from '@/hooks/useAuth';

export const useOptimizedAuth = () => {
  const auth = useBaseAuth();

  // Memoize user data to prevent unnecessary re-renders
  const memoizedUser = useMemo(() => ({
    id: auth.user?.id,
    email: auth.user?.email,
    isAuthenticated: !!auth.user
  }), [auth.user?.id, auth.user?.email]);

  // Memoize auth methods
  const memoizedMethods = useMemo(() => ({
    signIn: auth.signIn,
    signUp: auth.signUp,
    signOut: auth.signOut,
    resetPassword: auth.resetPassword
  }), [auth.signIn, auth.signUp, auth.signOut, auth.resetPassword]);

  // Optimized auth check
  const isAuthenticating = useMemo(() => 
    auth.isLoading,
    [auth.isLoading]
  );

  return {
    user: memoizedUser,
    isLoading: isAuthenticating,
    ...memoizedMethods,
    // Include original auth for backward compatibility
    ...auth
  };
};
