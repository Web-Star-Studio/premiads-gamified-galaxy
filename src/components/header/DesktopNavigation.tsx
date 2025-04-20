
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface Section {
  id: string;
  label: string;
  isLink?: boolean;
  to?: string;
}

interface DesktopNavigationProps {
  sections: Section[];
  scrollToSection: (sectionId: string) => void;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ sections, scrollToSection }) => {
  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="hidden md:flex items-center"
    >
      {sections.map((section) => (
        section.isLink && section.to ? (
          <Link
            key={section.id}
            to={section.to}
            className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
          >
            {section.label}
          </Link>
        ) : (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
          >
            {section.label}
          </button>
        )
      ))}
    </motion.nav>
  );
};

export default DesktopNavigation;
