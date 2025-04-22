
import { useState } from "react";
import { HelpCircle, X, MessageSquare, BookOpen, LifeBuoy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HelpButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  
  const navigateTo = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };
  
  const openLiveChat = () => {
    // Aqui poderia implementar uma lógica para abrir um chat ao vivo
    console.log("Abrir chat ao vivo");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-16 right-0 bg-galaxy-deepPurple border border-galaxy-purple/40 rounded-lg shadow-xl p-4 w-64"
          >
            <div className="space-y-2">
              <button 
                onClick={() => navigateTo("/faq")}
                className="flex items-center w-full p-2 rounded-md hover:bg-galaxy-purple/20 transition-colors text-left"
              >
                <BookOpen size={18} className="mr-2 text-neon-cyan" />
                <span>FAQs e Ajuda</span>
              </button>
              
              <button 
                onClick={() => navigateTo("/tutoriais")}
                className="flex items-center w-full p-2 rounded-md hover:bg-galaxy-purple/20 transition-colors text-left"
              >
                <LifeBuoy size={18} className="mr-2 text-neon-cyan" />
                <span>Tutoriais</span>
              </button>
              
              <button 
                onClick={() => navigateTo("/suporte")}
                className="flex items-center w-full p-2 rounded-md hover:bg-galaxy-purple/20 transition-colors text-left"
              >
                <MessageSquare size={18} className="mr-2 text-neon-cyan" />
                <span>Contato</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleOpen}
        className="w-12 h-12 rounded-full bg-neon-cyan flex items-center justify-center shadow-lg shadow-neon-cyan/20"
      >
        {isOpen ? (
          <X size={24} className="text-galaxy-dark" />
        ) : (
          <HelpCircle size={24} className="text-galaxy-dark" />
        )}
      </motion.button>
    </div>
  );
};

export default HelpButton;
