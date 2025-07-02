import React from "react";
import { motion } from "framer-motion";
import { Clock, Award, Badge as BadgeIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSounds } from "@/hooks/use-sounds";
import { Mission } from "@/hooks/useMissionsTypes";
import { ensureString, ensureNumber } from "@/utils/react-safe-render";

interface MissionsListProps {
  missions: Mission[];
  selectedMission: Mission | null;
  onMissionClick: (mission: Mission) => void;
  emptyMessage: string;
}

const MissionsList = ({ missions, selectedMission, onMissionClick, emptyMessage }: MissionsListProps) => {
  const { playSound } = useSounds();

  // Format the deadline date
  const formatDeadline = (dateString?: string) => {
    if (!dateString) return "Sem prazo";
    
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Safely render mission data with defensive checks using utility functions
  const renderMissionCard = (mission: Mission) => {
    // Ensure all values are safe to render using utility functions
    const titleValue = ensureString(mission.title, "Missão sem título");
    const brandValue = ensureString(mission.brand, "PremiAds");
    const rifasValue = ensureNumber(mission.rifas) || ensureNumber(mission.tickets_reward);

    return (
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
            <h4 className="font-medium">{titleValue}</h4>
            <p className="text-sm text-gray-400">{brandValue}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge 
              variant="secondary" 
              className="flex items-center gap-1"
            >
              <Award className="w-3 h-3" />
              <span>{rifasValue} rifas</span>
            </Badge>
            
            {mission.has_badge && (
              <Badge variant="outline" className="text-xs bg-neon-pink/20 text-neon-pink border-neon-pink/30 flex items-center gap-1">
                <BadgeIcon className="w-3 h-3" />
                <span>Badge</span>
              </Badge>
            )}
            
            {mission.hasUserSubmission && (
              <Badge variant="outline" className="text-xs bg-yellow-600/20 text-yellow-400 border-yellow-600/30">
                Já submetida
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center mt-2 text-xs text-gray-400">
          <Clock className="w-3 h-3 mr-1" />
          <span>Prazo: {formatDeadline(mission.deadline)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="glass-panel p-4">
      <h3 className="text-lg font-heading mb-4">Missões Disponíveis</h3>
      
      {missions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {missions.map(mission => renderMissionCard(mission))}
        </div>
      )}
    </div>
  );
};

export default MissionsList;
