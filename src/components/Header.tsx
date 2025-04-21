
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { UserType } from "@/types/auth";

import HeaderLogo from "./header/HeaderLogo";
import DesktopNavigation from "./header/DesktopNavigation";
import MobileNavigation from "./header/MobileNavigation";
import UserTypeSelector from "./header/UserTypeSelector";
import { useHeaderScroll } from "./header/useHeaderScroll";
import { useMobileMenu } from "./header/useMobileMenu";
import { useNavigation } from "./header/useNavigation";

const Header = () => {
  const { userType, setIsOverlayOpen } = useUser();
  const scrolled = useHeaderScroll();
  const { mobileMenuOpen, setMobileMenuOpen, toggleMobileMenu } = useMobileMenu();
  const { changeUserType, navigateToDashboard, scrollToSection } = useNavigation();
  
  const openWhatsApp = () => {
    const phoneNumber = "5581985595912";
    const message = encodeURIComponent("Olá, gostaria de saber mais sobre o PremiAds!");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };
  
  const sections = [
    { id: "como-funciona", label: "Como Funciona" },
    { id: "beneficios", label: "Benefícios" },
    { id: "depoimentos", label: "Depoimentos" },
    { id: "faq", label: "FAQ" },
    { id: "blog", label: "Blog", isLink: true, to: "/blog" },
  ];

  // Helper function to get button text based on user type
  const getButtonText = () => {
    if (userType === "participante") return "Ver Missões";
    if (userType === "anunciante") return "Criar Campanha";
    if (userType === "admin" || userType === "moderator") return "Acessar Painel";
    return "Acessar Painel";
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-40 py-2 sm:py-4 transition-all duration-300 ${
        scrolled ? "bg-galaxy-dark/80 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <HeaderLogo />
        </div>

        <DesktopNavigation sections={sections} scrollToSection={scrollToSection} />

        <div className="flex items-center space-x-2 sm:space-x-4">
          <UserTypeSelector 
            userType={userType as UserType} 
            changeUserType={changeUserType} 
            setIsOverlayOpen={setIsOverlayOpen} 
          />

          <Button 
            className="hidden md:flex neon-button items-center justify-center" 
            size="sm"
            onClick={navigateToDashboard}
          >
            {getButtonText()}
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
        userType={userType as UserType}
        setMobileMenuOpen={setMobileMenuOpen}
      />
    </motion.header>
  );
};

export default Header;
