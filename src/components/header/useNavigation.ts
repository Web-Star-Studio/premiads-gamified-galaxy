
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { UserType } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";
import { useAuthMethods } from "@/hooks/useAuthMethods";
import { useSounds } from "@/hooks/use-sounds";

/**
 * useNavigation hook
 * - Handles userType changes for visitor menu and navigation before/after login
 * - Ensures dashboard/browser route matches selected userType
 * - Handles logout
 */
export const useNavigation = () => {
  const { userType, setUserType, saveUserPreferences, clearUserSession, isAuthenticated } = useUser();
  const { signOut } = useAuthMethods();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { playSound } = useSounds();

  // Allow userType selection for unauthenticated users
  const changeUserType = async (newType: UserType) => {
    if (newType !== userType) {
      setUserType(newType);
      playSound("pop");
      if (isAuthenticated) {
        try {
          await saveUserPreferences();
          toast({
            title: "Perfil atualizado",
            description: `Tipo de usuário alterado para ${newType}`,
          });
        } catch (error) {
          toast({
            title: "Erro ao salvar preferências",
            description: "Não foi possível salvar suas preferências",
            variant: "destructive",
          });
        }
      } else {
        localStorage.setItem("userType", newType);
      }
    }
    return true;
  };

  // Centralized robust dashboard navigation
  const navigateToDashboard = (overrideType?: UserType) => {
    const currentUserType = overrideType || userType;
    if (!isAuthenticated) {
      return false;
    }
    if (currentUserType === "participante") {
      navigate("/cliente", { replace: true });
      return true;
    } else if (currentUserType === "anunciante") {
      navigate("/anunciante", { replace: true });
      return true;
    } else if (currentUserType === "admin") {
      navigate("/admin", { replace: true });
      return true;
    }
    toast({
      title: "Erro de navegação",
      description: "Tipo de usuário desconhecido ou não suportado",
      variant: "destructive",
    });
    return false;
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      toast({
        title: "Erro ao fazer logout",
        description: "Não foi possível desconectar. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return {
    changeUserType,
    navigateToDashboard,
    scrollToSection,
    handleLogout
  };
};
