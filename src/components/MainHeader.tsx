
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
import { DrawerMenu } from "@/components/ui/drawer-menu";

const MainHeader = () => {
  const { userType, setUserType, setIsOverlayOpen } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  
  const sections = [
    { id: "como-funciona", label: "Como Funciona" },
    { id: "beneficios", label: "Benefícios" },
    { id: "depoimentos", label: "Depoimentos" },
    { id: "faq", label: "FAQ" },
  ];
  
  const menuItems = sections.map(section => ({
    label: section.label,
    href: `#${section.id}`,
    onClick: () => scrollToSection(section.id)
  }));

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

          {/* Mobile menu using DrawerMenu component */}
          <DrawerMenu 
            items={menuItems} 
            ctaButton={{
              label: userType === "participante" ? "Ver Missões" : "Criar Campanha",
              href: userType === "participante" ? "/cliente" : "/anunciante",
            }}
          />
        </div>
      </div>
    </motion.header>
  );
};

export default MainHeader;
