
import { ChevronRight, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MissionsHeaderProps {
  onViewAllMissions: () => void;
}

const MissionsHeader = ({ onViewAllMissions }: MissionsHeaderProps) => (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-xl font-bold font-heading">Missões Recomendadas</h2>
        <p className="text-sm text-gray-400">Descubra missões de anunciantes de Recife</p>
      </div>
      <div className="flex items-center">
        <Button 
          variant="link" 
          className="text-neon-cyan flex items-center p-0"
          onClick={onViewAllMissions}
        >
          Ver todas <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
        <Target className="w-5 h-5 text-neon-cyan ml-2" />
      </div>
    </div>
  );

export default MissionsHeader;
