
import { FC } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface MobileNavigationProps {
  sections: Array<{
    id: string;
    label: string;
  }>;
  mobileMenuOpen: boolean;
  scrollToSection: (sectionId: string) => void;
  navigateToDashboard: () => void;
  userType: "participante" | "anunciante";
  setMobileMenuOpen: (open: boolean) => void;
}

const MobileNavigation: FC<MobileNavigationProps> = ({
  sections,
  mobileMenuOpen,
  scrollToSection,
  navigateToDashboard,
  userType,
  setMobileMenuOpen,
}) => {
  if (!mobileMenuOpen) return null;

  return (
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
            onClick={() => {
              scrollToSection(section.id);
              setMobileMenuOpen(false);
            }}
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
  );
};

export default MobileNavigation;
