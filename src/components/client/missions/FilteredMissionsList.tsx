
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

const FilteredMissionsList = ({ missions, onMissionClick, emptyMessage, type }: FilteredMissionsListProps) => (
    <div className="grid grid-cols-1 gap-4">
      {missions.length === 0 ? (
        <div className="glass-panel p-8 text-center">
          <p className="text-gray-400">{emptyMessage}</p>
        </div>
      ) : (
        missions.map(mission => (
          <div 
            key={mission.id}
            className="glass-panel p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{mission.title}</h4>
                <p className="text-sm text-gray-400">{mission.brand || "PremiAds"}</p>
              </div>
              <Badge 
                className={
                  type === "completed" ? "bg-green-600" : 
                  type === "pending" ? "bg-yellow-600" : 
                  "bg-blue-600"
                }
              >
                {mission.tickets_reward} pts
              </Badge>
            </div>
            <p className="mt-2 mb-2">{mission.description}</p>
            
            {type === "completed" && (
              <div className="bg-green-600/20 rounded p-2 text-sm flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                <p className="text-green-400">Concluída e aprovada</p>
              </div>
            )}
            
            {type === "pending" && (
              <div className="bg-yellow-600/20 rounded p-2 text-sm">
                <p className="text-yellow-300">Aguardando aprovação do anunciante</p>
              </div>
            )}
            
            {type === "in_progress" && onMissionClick && (
              <div className="flex justify-end">
                <Button 
                  className="bg-neon-cyan text-galaxy-dark hover:bg-neon-cyan/80"
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

export default FilteredMissionsList;
