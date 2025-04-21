
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { UserType } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";
import { useAuthMethods } from "@/hooks/useAuthMethods";

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

  // Allow userType selection for unauthenticated users
  const changeUserType = async (newType: UserType) => {
    if (newType !== userType) {
      setUserType(newType);

      // Save it for logged in users, just update context for visitors
      if (isAuthenticated) {
        try {
          await saveUserPreferences();
        } catch (error) {
          toast({
            title: "Erro ao salvar preferências",
            description: "Não foi possível salvar suas preferências",
            variant: "destructive",
          });
        }
      }
    }
  };

  // Centralized dashboard navigation. Ready for both visitor and logged-in
  const navigateToDashboard = () => {
    if (userType === "participante") {
      navigate("/cliente");
    } else if (userType === "anunciante") {
      navigate("/anunciante");
    } else if (userType === "admin") {
      navigate("/admin");
    }
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
