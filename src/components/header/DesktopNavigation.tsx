
import { FC } from "react";

interface NavigationProps {
  sections: Array<{
    id: string;
    label: string;
  }>;
  scrollToSection: (sectionId: string) => void;
}

const DesktopNavigation: FC<NavigationProps> = ({ sections, scrollToSection }) => {
  return (
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
  );
};

export default DesktopNavigation;
