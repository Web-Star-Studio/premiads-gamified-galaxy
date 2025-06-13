import { useRef } from "react";
import { useSessionCheck } from "./auth/useSessionCheck";
import { useProfileSync } from "./auth/useProfileSync";
import { useAuthStateListener } from "./auth/useAuthStateListener";

export const useAuthSession = () => {
  const sessionCheckRef = useRef<boolean>(false);
  const { user, setUser, loading, setLoading } = useSessionCheck(sessionCheckRef);
  const { syncUserProfile } = useProfileSync(user);
  
  useAuthStateListener(setUser, syncUserProfile);

  return {
    user,
    loading,
    setLoading
  };
};
