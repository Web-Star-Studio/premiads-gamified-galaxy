
import { FC } from "react";
import { UserType } from "@/types/auth";
import { cn } from "@/lib/utils";

interface MobileNavigationProps {
  sections: Array<{
    id: string;
    label: string;
    isLink?: boolean;
    to?: string;
  }>;
  mobileMenuOpen: boolean;
  scrollToSection: (sectionId: string) => void;
  navigateToDashboard: () => void;
  userType: UserType;
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
  const getButtonText = () => {
    if (userType === "participante") return "Ver Missões";
    if (userType === "anunciante") return "Criar Campanha";
    if (userType === "admin") return "Painel Admin";
    if (userType === "moderator") return "Painel Moderador";
    return "Acessar Painel";
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-galaxy-dark/95 backdrop-blur-sm transform transition-transform duration-300 ease-in-out",
        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <nav className="flex flex-col items-center justify-center h-full space-y-8">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => {
              if (section.isLink && section.to) {
                // Handle navigation to link
              } else {
                scrollToSection(section.id);
              }
              setMobileMenuOpen(false);
            }}
            className="text-lg font-medium text-white hover:text-neon-cyan transition-colors"
          >
            {section.label}
          </button>
        ))}
        <button
          onClick={() => {
            navigateToDashboard();
            setMobileMenuOpen(false);
          }}
          className="px-6 py-2 bg-neon-cyan/80 hover:bg-neon-cyan text-white rounded-md transition-colors"
        >
          {getButtonText()}
        </button>
      </nav>
    </div>
  );
};

export default MobileNavigation;
