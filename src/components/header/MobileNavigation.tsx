
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
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden w-full bg-galaxy-dark/95 backdrop-blur-lg overflow-hidden"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-2">
              {sections.map((section) => (
                section.isLink && section.to ? (
                  <Link
                    key={section.id}
                    to={section.to}
                    className="py-3 text-gray-200 hover:text-white text-lg font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {section.label}
                  </Link>
                ) : (
                  <button
                    key={section.id}
                    onClick={() => handleNavigation(section)}
                    className="py-3 text-gray-200 hover:text-white text-lg font-medium text-left"
                  >
                    {section.label}
                  </button>
                )
              ))}

              <Button
                className="mt-4 w-full bg-neon-cyan hover:bg-neon-cyan/90 text-galaxy-dark"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigateToDashboard();
                }}
              >
                {userType === "participante" ? "Entrar" : "Painel"}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileNavigation;
