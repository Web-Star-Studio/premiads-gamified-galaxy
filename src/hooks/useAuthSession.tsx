
import { useSessionCheck } from "./auth/useSessionCheck";
import { useProfileSync } from "./auth/useProfileSync";
import { useAuthStateListener } from "./auth/useAuthStateListener";

export const useAuthSession = () => {
  const { user, setUser, loading, setLoading } = useSessionCheck();
  const { syncUserProfile } = useProfileSync(user);
  
  useAuthStateListener(setUser, syncUserProfile);

  return {
    user,
    loading,
    setLoading
  };
};
