
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { supabase } from "@/integrations/supabase/client";
import { signOutAndCleanup } from "@/utils/auth";
import { SignUpCredentials, SignInCredentials, UserType } from "@/types/auth";

export const useAuthMethods = () => {
  const [loading, setLoading] = useState(false);
  const [sessionCheckInProgress, setSessionCheckInProgress] = useState(false);
  const { setUserName, setUserType, setIsAuthenticated, resetUserInfo, checkSession } = useUser();
  const { toast } = useToast();
  const { playSound } = useSounds();
  const navigate = useNavigate();
  
  // Helper function to redirect to the correct dashboard based on user type
  const redirectToDashboard = (userType: UserType) => {
    console.log(`Auth: Redirecting to dashboard for user type: ${userType}`);
    
    // Use timeout to ensure state updates have propagated
    setTimeout(() => {
      switch (userType) {
        case "admin":
          navigate("/admin", { replace: true });
          break;
        case "anunciante":
          navigate("/anunciante", { replace: true });
          break;
        default:
          navigate("/cliente", { replace: true });
          break;
      }
    }, 100);
  };

  // Helper function to handle errors
  const handleAuthError = (error: any, defaultMessage: string) => {
    const errorMessage = error.message || defaultMessage;
    console.error(errorMessage, error);
    playSound("error");
    toast({
      title: "Erro",
      description: errorMessage,
      variant: "destructive",
    });
    return false;
  };

  // --- SIGN UP LOGIC ---
  const signUp = async (credentials: SignUpCredentials) => {
    setLoading(true);
    
    try {
      console.log("Starting signup process for user:", credentials.email);
      
      // Only allow 'participante' and 'anunciante' registration
      if (credentials.userType === "admin") {
        toast({
          title: "Cadastro não permitido",
          description: "Não é possível registrar administradores pelo painel padrão.",
          variant: "destructive",
        });
        setLoading(false);
        return false;
      }

      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            full_name: credentials.name,
            user_type: credentials.userType || "participante"
          }
        }
      });
      
      if (error) throw error;
      
      playSound("chime");
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Bem-vindo à plataforma de engajamento!",
      });
      
      if (data.user) {
        console.log("User created successfully:", data.user.id);
        
        setUserName(credentials.name);
        setUserType(credentials.userType || "participante");
        setIsAuthenticated(true);
        
        // Check if profile exists, if not create one
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();
        
        if (profileError && profileError.code === "PGRST116") {
          // Profile doesn't exist, create one
          console.log("Creating new profile for user:", data.user.id);
          
          const { error: insertError } = await supabase
            .from("profiles")
            .insert([
              {
                id: data.user.id,
                full_name: credentials.name,
                user_type: credentials.userType || "participante",
                points: 0,
                credits: 0,
                profile_completed: true
              }
            ]);
          if (insertError) {
            console.error("Error creating profile:", insertError);
          }
        }
        
        // Force a session check
        await checkSession(true);

        console.log("Redirecting new user to dashboard");
        // Redirect based on user type
        redirectToDashboard(credentials.userType || "participante");
      }
      
      return true;
    } catch (error: any) {
      return handleAuthError(error, "Ocorreu um erro durante o cadastro");
    } finally {
      setLoading(false);
    }
  };

  // --- SIGN IN LOGIC ---
  const signIn = async (credentials: SignInCredentials) => {
    if (sessionCheckInProgress) {
      console.log("Session check in progress, waiting...");
      return false;
    }

    setLoading(true);
    setSessionCheckInProgress(true);
    
    try {
      console.log("Starting signin process for user:", credentials.email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        console.log("User signed in successfully:", data.user.id);
        
        setIsAuthenticated(true);
        
        // Get user profile to determine type
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type, full_name')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          console.log("User profile found:", profile);
          
          setUserName(profile.full_name);
          // Fix: Cast the user_type string to UserType
          const userType = profile.user_type as UserType;
          setUserType(userType);

          console.log("User authenticated as:", userType);
          
          // Show toast first, then redirect
          toast({
            title: "Login realizado com sucesso",
            description: "Bem-vindo de volta!",
          });

          // Redirect based on user type (centralized here)
          // Use a timeout to ensure state is updated before redirect
          setTimeout(() => {
            console.log("Redirecting to dashboard after login");
            redirectToDashboard(userType);
          }, 300);
          
          return true;
        } else {
          console.log("No profile found for user, creating default profile");
          
          // Default to participante if no profile exists
          setUserType("participante");
          setUserName(data.user.email?.split('@')[0] || "User");
          
          // Create a profile
          await supabase.from('profiles').insert({
            id: data.user.id,
            user_type: "participante",
            full_name: data.user.email?.split('@')[0] || "User",
            points: 0,
            credits: 0,
            profile_completed: false
          });
          
          // Redirect to client dashboard
          setTimeout(() => {
            redirectToDashboard("participante");
          }, 300);
          
          return true;
        }
      }
      
      return false;
    } catch (error: any) {
      return handleAuthError(error, "Ocorreu um erro durante o login");
    } finally {
      setLoading(false);
      setSessionCheckInProgress(false);
    }
  };

  // --- SIGN OUT LOGIC ---
  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      console.log("Attempting to sign out...");
      await signOutAndCleanup(); // Use robust global handler
      resetUserInfo();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      
      // Ensure navigation to home page
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 100);
      
      return true;
    } catch (error: any) {
      playSound("error");
      toast({
        title: "Erro ao sair",
        description: error?.message || "Não foi possível realizar o logout.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [resetUserInfo, toast, playSound, navigate]);

  return {
    loading,
    signUp,
    signIn,
    signOut
  };
};
