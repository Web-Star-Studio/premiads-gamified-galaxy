
import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Section {
  id: string;
  label: string;
  isLink?: boolean;
  to?: string;
}

interface MobileNavigationProps {
  sections: Section[];
  mobileMenuOpen: boolean;
  scrollToSection: (sectionId: string) => void;
  navigateToDashboard: () => void;
  userType: "participante" | "anunciante";
  setMobileMenuOpen: (isOpen: boolean) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  sections,
  mobileMenuOpen,
  scrollToSection,
  navigateToDashboard,
  userType,
  setMobileMenuOpen,
}) => {
  const handleNavigation = (section: Section) => {
    setMobileMenuOpen(false);
    
    if (section.isLink && section.to) {
      // For direct links, the Link component will handle navigation
      return;
    } else {
      scrollToSection(section.id);
    }
  };

  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 top-[60px] bg-black/95 backdrop-blur-md z-30 md:hidden overflow-auto pt-6"
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col space-y-4">
              {sections.map((section) => (
                section.isLink && section.to ? (
                  <Link
                    key={section.id}
                    to={section.to}
                    className="text-lg py-3 border-b border-zinc-800 text-white hover:text-neon-cyan transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {section.label}
                  </Link>
                ) : (
                  <button
                    key={section.id}
                    onClick={() => handleNavigation(section)}
                    className="text-lg py-3 border-b border-zinc-800 text-white hover:text-neon-cyan transition-colors text-left"
                  >
                    {section.label}
                  </button>
                )
              ))}

              <Button
                className="neon-button mt-6"
                size="lg"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigateToDashboard();
                }}
              >
                {userType === "participante" ? "Ver Missões" : "Criar Campanha"}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileNavigation;
