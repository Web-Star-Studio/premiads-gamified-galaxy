
import { useUser } from "@/context/UserContext";
import { useAuthSession } from "./useAuthSession";
import { useAuthMethods } from "./useAuthMethods";

export type { SignUpCredentials, SignInCredentials } from "@/types/auth";

export const useAuth = () => {
  const { user, loading: sessionLoading, setLoading } = useAuthSession();
  const { 
    loading: methodsLoading, 
    signUp, 
    signIn, 
    signOut 
  } = useAuthMethods();

  // Combine loading states
  const loading = sessionLoading || methodsLoading;

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut
  };
};
