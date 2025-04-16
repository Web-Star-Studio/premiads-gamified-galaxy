
import { useNavigate } from "react-router-dom";
import { Gift, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClientDashboard } from "@/hooks/useClientDashboard";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { motion } from "framer-motion";

// Icon component for reusability
const TicketIcon = () => {
  return (
    <div className="relative">
      <Gift className="w-6 h-6 mr-2 text-white" />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.3
        }}
        className="absolute -top-1 -right-1"
      >
        <Sparkles className="w-3 h-3 text-neon-pink" />
      </motion.div>
    </div>
  );
};

// Text label component for reusability
const TicketLabel = () => {
  return <span className="text-xl font-heading">Sorteios</span>;
};

// Content container for the button
const TicketButtonContent = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center">
        <TicketIcon />
        <TicketLabel />
      </div>
    </motion.div>
  );
};

const TicketsButton = () => {
  const navigate = useNavigate();
  const { points } = useClientDashboard(navigate);
  const { toast } = useToast();
  const { playSound } = useSounds();
  
  const handleNavigateToRaffles = () => {
    try {
      playSound("pop");
      navigate("/cliente/sorteios");
    } catch (error) {
      console.error("Navigation error:", error);
      toast({
        title: "Erro de navegação",
        description: "Não foi possível acessar a página de sorteios. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Button
      variant="gradient"
      className="w-full py-6 px-4 overflow-hidden group"
      onClick={handleNavigateToRaffles}
    >
      <TicketButtonContent />
      <motion.div 
        className="absolute inset-0 bg-white opacity-0 pointer-events-none"
        whileHover={{ opacity: 0.05 }}
        transition={{ duration: 0.3 }}
      />
    </Button>
  );
};

export default TicketsButton;
