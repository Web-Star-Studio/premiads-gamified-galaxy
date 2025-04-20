
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { UserType } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";

type UserContextType = {
  userName: string;
  userType: UserType;
  isOverlayOpen: boolean;
  setUserName: (name: string) => void;
  setUserType: (type: UserType) => void;
  setIsOverlayOpen: (isOpen: boolean) => void;
  resetUserInfo: () => void;
  saveUserPreferences: () => Promise<void>;
};

const defaultContext: UserContextType = {
  userName: "",
  userType: "participante",
  isOverlayOpen: false,
  setUserName: () => {},
  setUserType: () => {},
  setIsOverlayOpen: () => {},
  resetUserInfo: () => {},
  saveUserPreferences: async () => {},
};

const UserContext = createContext<UserContextType>(defaultContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userName, setUserName] = useState<string>("");
  const [userType, setUserType] = useState<UserType>("participante");
  const [isOverlayOpen, setIsOverlayOpen] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Carrega informações do usuário quando o componente é montado
  useEffect(() => {
    const loadUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.id) {
        setUserId(session.user.id);
        
        // Buscar perfil do usuário
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, user_type")
          .eq("id", session.user.id)
          .single();
        
        if (error) {
          console.error("Erro ao carregar perfil do usuário:", error);
          return;
        }
        
        if (data) {
          setUserName(data.full_name || session.user.email?.split('@')[0] || "");
          setUserType(data.user_type as UserType || "participante");
        }
      }
    };
    
    loadUserData();
    
    // Configurar listener para mudanças na autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          setUserId(session.user.id);
          
          // Buscar perfil do usuário
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
  };

  // Função para salvar preferências do usuário no Supabase
  const saveUserPreferences = async () => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: userName,
          user_type: userType,
          updated_at: new Date()
        })
        .eq("id", userId);
      
      if (error) {
        console.error("Erro ao salvar preferências:", error);
        throw error;
      }
      
      console.log("Preferências de usuário salvas com sucesso");
    } catch (error) {
      console.error("Erro ao salvar preferências:", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        userName,
        userType,
        isOverlayOpen,
        setUserName,
        setUserType,
        setIsOverlayOpen,
        resetUserInfo,
        saveUserPreferences,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
