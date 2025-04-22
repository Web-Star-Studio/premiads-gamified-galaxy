
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { UserType } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";

export const useNavigation = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const changeUserType = useCallback((type: UserType) => {
    localStorage.setItem("userType", type);
    window.location.reload();
  }, []);
  
  const navigateToDashboard = useCallback(() => {
    // If not authenticated, send to login/register
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    const userType = localStorage.getItem("userType") as UserType || "participante";
    
    if (userType === "anunciante") {
      navigate("/anunciante");
    } else if (userType === "admin" || userType === "moderator") {
      navigate("/admin");
    } else {
      navigate("/cliente");
    }
  }, [navigate, isAuthenticated]);
  
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  }, []);
  
  return {
    changeUserType,
    navigateToDashboard,
    scrollToSection
  };
};
