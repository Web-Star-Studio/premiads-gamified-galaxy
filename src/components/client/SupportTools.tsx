
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HelpCircle, BookOpen, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import HelpButton from "./HelpButton";
import LiveChat from "./LiveChat";

const SupportTools = () => {
  const navigate = useNavigate();

  // Nova função para navegar para páginas específicas
  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <LiveChat />
      <HelpButton />
      
      {/* Barra flutuante de acesso rápido */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-24 left-6 flex flex-col gap-2 z-50"
      >
        <Button
          onClick={() => navigateTo("/tutoriais")}
          variant="outline"
          size="icon"
          className="w-10 h-10 rounded-full bg-galaxy-purple text-white border-neon-cyan shadow-glow"
          title="Tutoriais"
        >
          <BookOpen className="h-5 w-5" />
        </Button>
        
        <Button
          onClick={() => navigateTo("/faq")}
          variant="outline"
          size="icon"
          className="w-10 h-10 rounded-full bg-galaxy-purple text-white border-neon-cyan shadow-glow"
          title="Perguntas Frequentes"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
        
        <Button
          onClick={() => navigateTo("/suporte")}
          variant="outline"
          size="icon"
          className="w-10 h-10 rounded-full bg-galaxy-purple text-white border-neon-pink shadow-glow"
          title="Suporte"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      </motion.div>
    </>
  );
};

export default SupportTools;
