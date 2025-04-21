
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
      console.log(`Changing user type from ${userType} to ${newType}`);
      
      // First update the context immediately for UI responsiveness
      setUserType(newType);
      playSound("pop");

      // Save it for logged in users, just update context for visitors
      if (isAuthenticated) {
        try {
          console.log("User is authenticated, saving preferences to profile");
          await saveUserPreferences();
          toast({
            title: "Perfil atualizado",
            description: `Tipo de usuário alterado para ${newType}`,
          });
        } catch (error) {
          console.error("Error saving user preferences:", error);
          toast({
            title: "Erro ao salvar preferências",
            description: "Não foi possível salvar suas preferências",
            variant: "destructive",
          });
        }
      } else {
        console.log("User is visitor, only updating context state");
        // For visitors, we just save to localStorage to remember their choice
        localStorage.setItem("userType", newType);
      }
    }

    return true;
  };

  // Centralized dashboard navigation with improved logging and user feedback
  const navigateToDashboard = () => {
    console.log(`Navigating to dashboard for ${userType} (authenticated: ${isAuthenticated})`);
    
    if (!isAuthenticated) {
      // Not authenticated, should open login dialog instead
      console.log("User not authenticated, opening auth overlay");
      return false;
    }
    
    // User is authenticated, navigate to the appropriate dashboard
    if (userType === "participante") {
      navigate("/cliente");
      return true;
    } else if (userType === "anunciante") {
      navigate("/anunciante");
      return true;
    } else if (userType === "admin") {
      navigate("/admin");
      return true;
    }
    
    // Fallback for unknown user types
    console.error(`Unknown user type: ${userType}`);
    toast({
      title: "Erro de navegação",
      description: "Tipo de usuário desconhecido ou não suportado",
      variant: "destructive",
    });
    return false;
  };

  // For smooth scrolling to section
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
      console.log("Navigation: Handling logout");
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Navigation: Error during logout:", error);
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
