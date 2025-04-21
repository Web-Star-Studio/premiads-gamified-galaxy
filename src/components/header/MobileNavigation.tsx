
import React from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { UserType } from "@/types/auth";

interface MobileNavigationProps {
  sections: Array<{
    id: string;
    label: string;
    isLink?: boolean;
    to?: string;
  }>;
  mobileMenuOpen: boolean;
  scrollToSection: (sectionId: string) => void;
  navigateToDashboard: (e: React.MouseEvent) => void;
  userType: UserType;
  setMobileMenuOpen: (open: boolean) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  sections,
  mobileMenuOpen,
  scrollToSection,
  navigateToDashboard,
  userType,
  setMobileMenuOpen,
}) => {
  const getButtonText = () => {
    if (userType === "participante") return "Ver Missões";
    if (userType === "anunciante") return "Criar Campanha";
    return "Acessar Painel";
  };

  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="absolute top-full left-0 right-0 bg-galaxy-dark/95 backdrop-blur-lg shadow-lg z-40"
        >
          <div className="container mx-auto px-4 py-6 flex flex-col space-y-6">
            <nav className="flex flex-col space-y-4">
              {sections.map((section) => (
                <Button
                  key={section.id}
                  variant="ghost"
                  className="justify-start px-2 py-3 text-white hover:text-neon-cyan hover:bg-galaxy-purple/20"
                  onClick={() => {
                    if (section.isLink && section.to) {
                      window.location.href = section.to;
                    } else {
                      scrollToSection(section.id);
                      setMobileMenuOpen(false);
                    }
                  }}
                >
                  {section.label}
                </Button>
              ))}
            </nav>
            
            <Button 
              className="w-full neon-button" 
              onClick={navigateToDashboard}
            >
              {getButtonText()}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileNavigation;
