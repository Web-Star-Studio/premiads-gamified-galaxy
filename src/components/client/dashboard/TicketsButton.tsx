
import { useNavigate } from "react-router-dom";
import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClientDashboard } from "@/hooks/useClientDashboard";

const TicketsButton = () => {
  const navigate = useNavigate();
  const { points } = useClientDashboard(navigate);
  
  return (
    <Button
      className="w-full neon-button py-6 px-4"
      onClick={() => navigate("/cliente/sorteios")}
    >
      <div className="flex flex-col items-center justify-center w-full">
        <div className="flex items-center">
          <Gift className="w-6 h-6 mr-2 text-white" />
          <span className="text-xl font-heading">Sorteios</span>
        </div>
      </div>
    </Button>
  );
};

export default TicketsButton;
