import { useEffect, useRef } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const useAuthStateListener = (
  setUser: (user: User | null) => void,
  syncUserProfile: (user: User) => Promise<boolean>
) => {
  const processingAuthChangeRef = useRef<boolean>(false);
  const lastEventRef = useRef<string | null>(null);
  const lastUserIdRef = useRef<string | null>(null);
  
  useEffect(() => {
    // Verificar sessão atual ao inicializar
    const checkCurrentSession = async () => {
      try {
        if (processingAuthChangeRef.current) return;
        processingAuthChangeRef.current = true;
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking current session:", error);
          processingAuthChangeRef.current = false;
          return;
        }
        
        if (session?.user) {
          const userId = session.user.id;
          
          // Evitar processamento duplicado para o mesmo usuário
          if (lastUserIdRef.current === userId) {
            processingAuthChangeRef.current = false;
            return;
          }
          
          lastUserIdRef.current = userId;
          setUser(session.user);
          await syncUserProfile(session.user);
        }
        
        processingAuthChangeRef.current = false;
      } catch (error) {
        console.error("Exception in checkCurrentSession:", error);
        processingAuthChangeRef.current = false;
      }
    };
    
    checkCurrentSession();
    
    // Configurar listener para mudanças de estado
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        // Evitar processamento duplicado para o mesmo evento
        if (lastEventRef.current === event && event !== "TOKEN_REFRESHED") {
          return;
        }
        
        // Evitar processamento simultâneo
        if (processingAuthChangeRef.current) {
          return;
        }
        
        console.log("Auth state changed:", event);
        lastEventRef.current = event;
        processingAuthChangeRef.current = true;
        
        if (event === "SIGNED_IN" && session) {
          lastUserIdRef.current = session.user.id;
          setUser(session.user);
          await syncUserProfile(session.user);
        } else if (event === "SIGNED_OUT") {
          console.log("User signed out");
          lastUserIdRef.current = null;
          setUser(null);
          
          // Clear all potential auth data from localStorage
          localStorage.removeItem("userName");
          localStorage.removeItem("userType");
          localStorage.removeItem("supabase.auth.token");
          localStorage.removeItem("sb-zfryjwaeojccskfiibtq-auth-token");
          
          // Force complete page reload to ensure clean state
          setTimeout(() => {
            window.location.href = "/auth";
          }, 200);
        } else if (event === "USER_UPDATED" && session) {
          console.log("User updated");
          lastUserIdRef.current = session.user.id;
          setUser(session.user);
          await syncUserProfile(session.user);
        } else if (event === "TOKEN_REFRESHED" && session) {
          console.log("Token refreshed");
          if (lastUserIdRef.current !== session.user.id) {
            lastUserIdRef.current = session.user.id;
            setUser(session.user);
          }
        } else if (event === "PASSWORD_RECOVERY" && session) {
          console.log("Password recovery");
          lastUserIdRef.current = session.user.id;
          setUser(session.user);
        }
        
        processingAuthChangeRef.current = false;
      } catch (error) {
        console.error("Error in auth state listener:", error);
        processingAuthChangeRef.current = false;
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, syncUserProfile]);
};
