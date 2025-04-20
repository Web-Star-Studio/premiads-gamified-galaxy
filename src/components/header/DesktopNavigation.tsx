
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
      className="hidden md:flex space-x-6 items-center"
    >
      {sections.map((section) => (
        section.isLink && section.to ? (
          <Link
            key={section.id}
            to={section.to}
            className="text-sm text-gray-300 hover:text-white transition-colors relative group py-2"
          >
            {section.label}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-cyan group-hover:w-full transition-all duration-300"></span>
          </Link>
        ) : (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className="text-sm text-gray-300 hover:text-white transition-colors relative group py-2"
          >
            {section.label}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-cyan group-hover:w-full transition-all duration-300"></span>
          </button>
        )
      ))}
    </motion.nav>
  );
};

export default DesktopNavigation;
