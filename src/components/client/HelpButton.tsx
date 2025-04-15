
import { HelpCircle } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const HelpButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleHelpMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        variant="outline"
        size="icon"
        className="w-12 h-12 rounded-full bg-galaxy-purple text-white border-neon-cyan shadow-glow"
        onClick={toggleHelpMenu}
      >
        <HelpCircle className="h-6 w-6" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-16 right-0 glass-panel p-4 rounded-lg w-64 shadow-glow"
          >
            <h3 className="text-lg font-heading mb-3">Ajuda</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-300 hover:text-white flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full mr-2"></span>
                  Perguntas frequentes
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-300 hover:text-white flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-neon-pink rounded-full mr-2"></span>
                  Falar com suporte
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-300 hover:text-white flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-neon-lime rounded-full mr-2"></span>
                  Tour guiado
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HelpButton;
