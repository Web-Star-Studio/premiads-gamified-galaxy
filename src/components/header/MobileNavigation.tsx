
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { UserType } from "@/types/auth";

interface Section {
  id: string;
  label: string;
  isLink?: boolean;
  to?: string;
}

interface MobileNavigationProps {
  sections: Section[];
  mobileMenuOpen: boolean;
  scrollToSection: (id: string) => void;
  navigateToDashboard: () => void;
  userType: UserType;
  setMobileMenuOpen: (open: boolean) => void;
}

const MobileNavigation = ({
  sections,
  mobileMenuOpen,
  scrollToSection,
  navigateToDashboard,
  userType,
  setMobileMenuOpen
}: MobileNavigationProps) => {
  // Prevents scrolling when the mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close mobile menu after clicking a link
  const handleSectionClick = (id: string) => {
    scrollToSection(id);
    setMobileMenuOpen(false);
  };
  
  // Handle dashboard navigation
  const handleDashboardClick = () => {
    navigateToDashboard();
    setMobileMenuOpen(false);
  };
  
  // Get button text based on user type
  const getButtonText = () => {
    if (userType === "participante") return "Ver Missões";
    if (userType === "anunciante") return "Criar Campanha";
    return "Acessar Painel";
  };
  
  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 top-[60px] z-30 bg-galaxy-dark/95 backdrop-blur-sm overflow-y-auto"
        >
          <div className="container mx-auto py-8 px-4">
            <ul className="space-y-4">
              {sections.map((section) => (
                <motion.li
                  key={section.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {section.isLink ? (
                    <a
                      href={section.to}
                      className="text-xl font-medium py-2 px-4 block text-white hover:text-neon-cyan transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {section.label}
                    </a>
                  ) : (
                    <button
                      onClick={() => handleSectionClick(section.id)}
                      className="text-xl font-medium py-2 px-4 block text-white hover:text-neon-cyan transition-colors w-full text-left"
                    >
                      {section.label}
                    </button>
                  )}
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="pt-6"
              >
                <Button
                  className="w-full neon-button text-lg py-6"
                  onClick={handleDashboardClick}
                >
                  {getButtonText()}
                </Button>
              </motion.li>
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileNavigation;
