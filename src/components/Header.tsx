
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const Header = () => {
  const { userType, setUserType, setIsOverlayOpen } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const sections = [
    { id: "como-funciona", label: "Como Funciona" },
    { id: "beneficios", label: "Benefícios" },
    { id: "depoimentos", label: "Depoimentos" },
    { id: "faq", label: "FAQ" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  useEffect(() => {
    // Prevent scrolling when mobile menu is open
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const changeUserType = (newType: "participante" | "anunciante") => {
    if (newType !== userType) {
      setUserType(newType);
    }
  };

  const navigateToDashboard = () => {
    if (userType === "participante") {
      navigate("/cliente");
    } else {
      navigate("/anunciante");
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
      
      // Fechar menu móvel após a navegação
      setMobileMenuOpen(false);
    }
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
          <a href="#" className="text-xl sm:text-2xl font-bold font-heading neon-text-cyan">
            <span className="text-white">Premi</span>Ads
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="text-gray-300 hover:text-white hover:neon-text-cyan transition-colors"
            >
              {section.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-galaxy-deepPurple/70 border-neon-cyan/30 flex items-center justify-center"
              >
                {userType === "participante" ? "Participante" : "Anunciante"} 
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-galaxy-deepPurple/90 backdrop-blur-md border-neon-cyan/50">
              <DropdownMenuItem 
                onClick={() => changeUserType("participante")}
                className={`cursor-pointer ${userType === "participante" ? "neon-text-cyan" : ""}`}
              >
                Participante
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => changeUserType("anunciante")}
                className={`cursor-pointer ${userType === "anunciante" ? "neon-text-cyan" : ""}`}
              >
                Anunciante
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setIsOverlayOpen(true)}
                className="cursor-pointer text-neon-pink"
              >
                Alterar Perfil
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            className="hidden md:flex neon-button items-center justify-center" 
            size="sm"
            onClick={navigateToDashboard}
          >
            {userType === "participante" ? "Ver Missões" : "Criar Campanha"}
          </Button>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 top-16 bg-galaxy-dark/95 backdrop-blur-lg z-30 p-6"
        >
          <nav className="flex flex-col items-center space-y-6 pt-8">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="text-gray-200 hover:text-white hover:neon-text-cyan transition-colors text-xl py-2"
              >
                {section.label}
              </button>
            ))}
            <Button 
              className="neon-button w-full mt-6" 
              onClick={() => {
                navigateToDashboard();
                setMobileMenuOpen(false);
              }}
            >
              {userType === "participante" ? "Ver Missões" : "Criar Campanha"}
            </Button>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;
