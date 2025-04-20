
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";

import HeaderLogo from "./header/HeaderLogo";
import DesktopNavigation from "./header/DesktopNavigation";
import MobileNavigation from "./header/MobileNavigation";
import UserTypeSelector from "./header/UserTypeSelector";
import { useHeaderScroll } from "./header/useHeaderScroll";
import { useMobileMenu } from "./header/useMobileMenu";
import { useNavigation } from "./header/useNavigation";

const MainHeader = () => {
  const { userType, setIsOverlayOpen } = useUser();
  const scrolled = useHeaderScroll();
  const { mobileMenuOpen, setMobileMenuOpen, toggleMobileMenu } = useMobileMenu();
  const { changeUserType, navigateToDashboard, scrollToSection } = useNavigation();
  
  const sections = [
    { id: "como-funciona", label: "Como Funciona" },
    { id: "beneficios", label: "Benefícios" },
    { id: "depoimentos", label: "Depoimentos" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-galaxy-dark/90 backdrop-blur-lg py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <HeaderLogo />

        <DesktopNavigation sections={sections} scrollToSection={scrollToSection} />

        <div className="flex items-center space-x-4">
          <UserTypeSelector 
            userType={userType} 
            changeUserType={changeUserType} 
            setIsOverlayOpen={setIsOverlayOpen} 
          />

          <Button 
            className="hidden md:flex items-center justify-center bg-neon-cyan hover:bg-neon-cyan/90 text-galaxy-dark" 
            size="sm"
            onClick={navigateToDashboard}
          >
            {userType === "participante" ? "Entrar" : "Painel"}
          </Button>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <MobileNavigation
        sections={sections}
        mobileMenuOpen={mobileMenuOpen}
        scrollToSection={scrollToSection}
        navigateToDashboard={navigateToDashboard}
        userType={userType}
        setMobileMenuOpen={setMobileMenuOpen}
      />
    </motion.header>
  );
};

export default MainHeader;
