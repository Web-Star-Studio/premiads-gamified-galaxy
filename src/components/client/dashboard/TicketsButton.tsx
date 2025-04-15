
import { useNavigate } from "react-router-dom";
import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClientDashboard } from "@/hooks/useClientDashboard";

const TicketsButton = () => {
  const navigate = useNavigate();
  const { points } = useClientDashboard(navigate);
  const tickets = Math.floor(points / 100);
  
  return (
    <Button
      className="w-full neon-button py-6 px-4" // Added px-4 to give horizontal padding
      onClick={() => navigate("/cliente/sorteios")}
    >
      <div className="flex flex-col items-center justify-center w-full">
        <div className="flex items-center mb-2">
          <Gift className="w-6 h-6 mr-2 text-neon-pink" />
          <span className="text-xl font-heading">Sorteios</span>
        </div>
        <div className="text-sm text-gray-300 text-center w-full">
          Você tem <span className="text-neon-cyan">{tickets} tickets</span> disponíveis
        </div>
      </div>
    </Button>
  );
};

export default TicketsButton;
