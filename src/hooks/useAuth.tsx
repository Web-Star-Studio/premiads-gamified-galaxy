
import { createContext, useContext, ReactNode } from "react";
import { User } from "@supabase/supabase-js";
import { useAuthSession } from "./useAuthSession";
import { useAuthMethods } from "./useAuthMethods";
import { SignUpCredentials, SignInCredentials } from "@/types/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  currentUser: User | null;
  user: User | null;
  loading: boolean;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: sessionLoading } = useAuthSession();
  const { loading: methodsLoading, signIn: signInMethod, signOut: signOutMethod, signUp: signUpMethod } = useAuthMethods();
  
  const isLoading = sessionLoading || methodsLoading;
  
  // Adapt the return types to match the interface
  const signIn = async (credentials: SignInCredentials): Promise<void> => {
    await signInMethod(credentials);
  };

  const signUp = async (credentials: SignUpCredentials): Promise<void> => {
    await signUpMethod(credentials);
  };

  const signOut = async (): Promise<void> => {
    await signOutMethod();
  };
  
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        isLoading,
        currentUser: user,
        user, // Alias for currentUser
        loading: isLoading, // Alias for isLoading
        signIn,
        signOut,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};

export type { SignUpCredentials, SignInCredentials };
