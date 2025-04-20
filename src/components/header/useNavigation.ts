
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { UserType } from "@/types/auth";

export const useNavigation = () => {
  const { userType, setUserType } = useUser();
  const navigate = useNavigate();

  const changeUserType = (newType: "participante" | "anunciante") => {
    if (newType !== userType) {
      setUserType(newType);
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
