
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { UserType } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type UserContextType = {
  userName: string;
  userType: UserType;
  isOverlayOpen: boolean;
  isAuthenticated: boolean;
  setUserName: (name: string) => void;
  setUserType: (type: UserType) => void;
  setIsOverlayOpen: (isOpen: boolean) => void;
  setIsAuthenticated: (isAuth: boolean) => void;
  resetUserInfo: () => void;
  saveUserPreferences: () => Promise<void>;
};

const defaultContext: UserContextType = {
  userName: "",
  userType: "participante",
  isOverlayOpen: false,
  isAuthenticated: false,
  setUserName: () => {},
  setUserType: () => {},
  setIsOverlayOpen: () => {},
  setIsAuthenticated: () => {},
  resetUserInfo: () => {},
  saveUserPreferences: async () => {},
};

const UserContext = createContext<UserContextType>(defaultContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userName, setUserName] = useState<string>("");
  const [userType, setUserType] = useState<UserType>("participante");
  const [isOverlayOpen, setIsOverlayOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  // Load user data when component mounts
  useEffect(() => {
    const loadUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.id) {
        setUserId(session.user.id);
        setIsAuthenticated(true);
        
        // Fetch user profile
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, user_type")
          .eq("id", session.user.id)
          .single();
        
        if (error) {
          console.error("Error loading user profile:", error);
          return;
        }
        
        if (data) {
          setUserName(data.full_name || session.user.email?.split('@')[0] || "");
          setUserType(data.user_type as UserType || "participante");
        }
      }
    };
    
    loadUserData();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (event === "SIGNED_IN" && session) {
          setUserId(session.user.id);
          setIsAuthenticated(true);
          
          // Fetch user profile
          const { data, error } = await supabase
            .from("profiles")
            .select("full_name, user_type")
            .eq("id", session.user.id)
            .single();
          
          if (!error && data) {
            setUserName(data.full_name || session.user.email?.split('@')[0] || "");
            setUserType(data.user_type as UserType || "participante");
          }
        } else if (event === "SIGNED_OUT") {
          resetUserInfo();
          setUserId(null);
          setIsAuthenticated(false);
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const resetUserInfo = () => {
    setUserName("");
    setUserType("participante");
    setIsOverlayOpen(false);
    setIsAuthenticated(false);
  };

  // Save user preferences to Supabase
  const saveUserPreferences = async () => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: userName,
          user_type: userType,
          updated_at: new Date().toISOString(),
          profile_completed: true
        })
        .eq("id", userId);
      
      if (error) {
        console.error("Error saving preferences:", error);
        toast({
          title: "Erro",
          description: "Não foi possível salvar suas preferências.",
          variant: "destructive"
        });
        throw error;
      }
      
      toast({
        title: "Sucesso",
        description: "Suas preferências foram salvas com sucesso.",
      });
      
      console.log("User preferences saved successfully");
    } catch (error) {
      console.error("Error saving preferences:", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        userName,
        userType,
        isOverlayOpen,
        isAuthenticated,
        setUserName,
        setUserType,
        setIsOverlayOpen,
        setIsAuthenticated,
        resetUserInfo,
        saveUserPreferences,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
