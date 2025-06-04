
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { SignInCredentials, SignUpCredentials } from '@/types/auth';
import { queryKeys } from '@/lib/query-client';
import { useCallback } from 'react';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isLoading, setUser, setLoading, setError, reset } = useAuthStore();
  const { setGlobalLoading } = useUIStore();

  // Session query
  const { data: session } = useQuery({
    queryKey: queryKeys.auth(),
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    },
    enabled: !user, // Only fetch if we don't have a user
    staleTime: Infinity, // Session doesn't change often
  });

  // Sign in mutation
  const signInMutation = useMutation({
    mutationFn: async (credentials: SignInCredentials) => {
      setGlobalLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword(credentials);
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth() });
    },
    onError: (error: any) => {
      setError(error.message);
    },
    onSettled: () => {
      setGlobalLoading(false);
    }
  });

  // Sign up mutation
  const signUpMutation = useMutation({
    mutationFn: async (credentials: SignUpCredentials) => {
      setGlobalLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            full_name: credentials.name,
            user_type: credentials.userType || 'participante'
          }
        }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data.user) {
        setUser(data.user);
      }
    },
    onError: (error: any) => {
      setError(error.message);
    },
    onSettled: () => {
      setGlobalLoading(false);
    }
  });

  // Sign out mutation
  const signOutMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      reset();
      queryClient.clear();
    }
  });

  const signIn = useCallback((credentials: SignInCredentials) => {
    return signInMutation.mutateAsync(credentials);
  }, [signInMutation]);

  const signUp = useCallback((credentials: SignUpCredentials) => {
    return signUpMutation.mutateAsync(credentials);
  }, [signUpMutation]);

  const signOut = useCallback(() => {
    return signOutMutation.mutateAsync();
  }, [signOutMutation]);

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || signInMutation.isPending || signUpMutation.isPending,
    signIn,
    signUp,
    signOut,
    error: useAuthStore.getState().error
  };
};
