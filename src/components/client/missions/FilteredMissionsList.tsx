
import React from "react";
import { CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mission } from "@/hooks/useMissions";

interface FilteredMissionsListProps {
  missions: Mission[];
  onMissionClick?: (mission: Mission) => void;
  emptyMessage: string;
  type: "in_progress" | "pending" | "completed";
}

const FilteredMissionsList = ({ missions, onMissionClick, emptyMessage, type }: FilteredMissionsListProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6">
      {missions.length === 0 ? (
        <div className="glass-panel p-6 md:p-8 text-center">
          <p className="text-medium-contrast">
            {emptyMessage}
          </p>
        </div>
      ) : (
        missions.map(mission => (
          <div 
            key={mission.id}
            className="glass-panel p-4 md:p-5 card-mobile-spaced"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-base md:text-lg">{mission.title}</h4>
                <p className="text-sm md:text-base text-medium-contrast">{mission.brand || "PremiAds"}</p>
              </div>
              <Badge 
                className={
                  type === "completed" ? "bg-green-600" : 
                  type === "pending" ? "bg-yellow-600" : 
                  "bg-blue-600"
                }
              >
                {mission.points} pts
              </Badge>
            </div>
            <p className="mt-2 mb-2 text-sm md:text-base">
              {mission.description}
            </p>
            
            {type === "completed" && (
              <div className="bg-green-600/20 rounded p-2 md:p-3 text-sm md:text-base flex items-center">
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 mr-2 text-green-400" />
                <p className="text-green-400">Concluída e aprovada</p>
              </div>
            )}
            
            {type === "pending" && (
              <div className="bg-yellow-600/20 rounded p-2 md:p-3 text-sm md:text-base">
                <p className="text-yellow-300">Aguardando aprovação do anunciante</p>
              </div>
            )}
            
            {type === "in_progress" && onMissionClick && (
              <div className="flex justify-end mt-3">
                <Button 
                  className="bg-neon-cyan text-galaxy-dark hover:bg-neon-cyan/80 px-4 py-2 md:px-5 md:py-2.5"
                  onClick={() => onMissionClick(mission)}
                >
                  Continuar
                </Button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default FilteredMissionsList;
