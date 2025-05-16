import React from "react";
import { Award, Calendar, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mission } from "@/hooks/missions/types";
import confetti from "canvas-confetti";

interface CompletedMissionCardProps {
  mission: Mission;
  reward?: {
    points_earned: number;
    rewarded_at: string;
  };
  onShareClick?: () => void;
}

const CompletedMissionCard = ({ mission, reward, onShareClick }: CompletedMissionCardProps) => {
  // Format the reward date nicely
  const formatRewardDate = (dateString?: string) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Handle share click with confetti effect
  const handleShare = () => {
    // Trigger confetti effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    // Call the share handler if provided
    if (onShareClick) onShareClick();
  };

  return (
    <div className="bg-galaxy-deepPurple/40 border border-galaxy-purple/20 rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium text-white">{mission.title}</h3>
            <p className="text-sm text-gray-400">{mission.brand || "PremiAds"}</p>
          </div>
          
          <div className="flex items-start gap-2">
            <Badge 
              className="bg-green-600/30 text-green-400 hover:bg-green-600/30"
            >
              <Check className="w-3 h-3 mr-1" />
              Concluída
            </Badge>
          </div>
        </div>
        
        <p className="text-sm text-gray-300 mb-4 line-clamp-2">{mission.description}</p>
        
        <div className="mb-4 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-neon-cyan" />
            <span className="text-sm font-medium text-neon-cyan">
              {reward?.points_earned || mission.points} pts
            </span>
          </div>
          
          {reward?.rewarded_at && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatRewardDate(reward.rewarded_at)}</span>
            </div>
          )}
        </div>
        
        <Button
          variant="outline" 
          size="sm"
          onClick={handleShare}
          className="w-full border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10"
        >
          Compartilhar conquista
        </Button>
      </div>
    </div>
  );
};

export default CompletedMissionCard; 