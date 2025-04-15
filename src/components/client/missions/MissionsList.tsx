
import React from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSounds } from "@/hooks/use-sounds";
import { Mission } from "@/hooks/useMissions";

interface MissionsListProps {
  missions: Mission[];
  selectedMission: Mission | null;
  onMissionClick: (mission: Mission) => void;
  emptyMessage: string;
}

const MissionsList = ({ missions, selectedMission, onMissionClick, emptyMessage }: MissionsListProps) => {
  const { playSound } = useSounds();

  return (
    <div className="glass-panel p-4">
      <h3 className="text-lg font-heading mb-4">Missões Disponíveis</h3>
      
      {missions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {missions.map(mission => (
            <div 
              key={mission.id}
              className={`bg-galaxy-deepPurple/40 p-3 rounded border border-galaxy-purple/20 cursor-pointer transition-all hover:border-neon-cyan/40 ${selectedMission?.id === mission.id ? 'border-neon-cyan' : ''}`}
              onClick={() => {
                onMissionClick(mission);
                playSound("pop");
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{mission.title}</h4>
                  <p className="text-sm text-gray-400">{mission.brand || "PremiAds"}</p>
                </div>
                <Badge variant="secondary">{mission.points} pts</Badge>
              </div>
              <div className="flex items-center mt-2 text-xs text-gray-400">
                <Clock className="w-3 h-3 mr-1" />
                <span>Prazo: {mission.deadline ? new Date(mission.deadline).toLocaleDateString('pt-BR') : "Sem prazo"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MissionsList;
