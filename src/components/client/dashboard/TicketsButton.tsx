
import { useNavigate } from "react-router-dom";
import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

const TicketsButton = () => {
  const navigate = useNavigate();
  
  return (
    <Button
      className="w-full neon-button py-6"
      onClick={() => navigate("/cliente/sorteios")}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center mb-2">
          <Gift className="w-6 h-6 mr-2 text-neon-pink" />
          <span className="text-xl font-heading">Sorteios</span>
        </div>
        <div className="text-sm text-gray-300">
          Você tem <span className="text-neon-cyan">8 tickets</span> disponíveis
        </div>
      </div>
    </Button>
  );
};

export default TicketsButton;
