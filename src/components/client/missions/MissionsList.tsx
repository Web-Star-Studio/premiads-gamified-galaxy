import React from "react";
import { motion } from "framer-motion";
import { Clock, Award, Badge as BadgeIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSounds } from "@/hooks/use-sounds";
import { Mission } from "@/hooks/useMissionsTypes";

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

  return (
    <div className="glass-panel p-4">
      <h3 className="text-lg font-heading mb-4">Missões Disponíveis</h3>
      
      {missions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {missions.map(mission => {
            const rifasReward =
              typeof mission.rifas === 'number'
                ? mission.rifas
                : typeof mission.tickets_reward === 'number'
                  ? mission.tickets_reward
                  : 0;

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
                    <h4 className="font-medium">{mission.title}</h4>
                    <p className="text-sm text-gray-400">{typeof mission.brand === 'string' ? mission.brand : 'PremiAds'}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge 
                      variant="secondary" 
                      className="flex items-center gap-1"
                    >
                      <Award className="w-3 h-3" />
                      <span>{rifasReward} rifas</span>
                    </Badge>
                    
                    {mission.has_badge && (
                      <Badge variant="outline" className="text-xs bg-neon-pink/20 text-neon-pink border-neon-pink/30 flex items-center gap-1">
                        <BadgeIcon className="w-3 h-3" />
                        <span>Badge</span>
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center mt-2 text-xs text-gray-400">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>Prazo: {formatDeadline(typeof mission.deadline === 'string' ? mission.deadline : undefined)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MissionsList;
