
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { UserType } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";

export const useNavigation = () => {
  const { userType, setUserType, saveUserPreferences } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const changeUserType = async (newType: UserType) => {
    if (newType !== userType) {
      setUserType(newType);
      
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
  };

  const navigateToDashboard = () => {
    if (userType === "participante") {
      navigate("/cliente");
    } else if (userType === "anunciante") {
      navigate("/anunciante");
    } else if (userType === "admin") {
      navigate("/admin");
    }
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

  return {
    changeUserType,
    navigateToDashboard,
    scrollToSection
  };
};
