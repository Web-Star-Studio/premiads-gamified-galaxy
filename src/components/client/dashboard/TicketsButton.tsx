
import { useNavigate } from "react-router-dom";
import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClientDashboard } from "@/hooks/useClientDashboard";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";

// Icon component for reusability
const TicketIcon = () => {
  return <Gift className="w-6 h-6 mr-2 text-white" />;
};

// Text label component for reusability
const TicketLabel = () => {
  return <span className="text-xl font-heading">Sorteios</span>;
};

// Content container for the button
const TicketButtonContent = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex items-center">
        <TicketIcon />
        <TicketLabel />
      </div>
    </div>
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
      className="w-full neon-button py-6 px-4"
      onClick={handleNavigateToRaffles}
    >
      <TicketButtonContent />
    </Button>
  );
};

export default TicketsButton;
