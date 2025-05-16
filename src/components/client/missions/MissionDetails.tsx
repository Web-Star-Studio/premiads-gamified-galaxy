import React from "react";
import { motion } from "framer-motion";
import { FileText, Image, Camera, Share2, MapPin, Tag, Star, CheckCircle, Award, Trophy, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mission } from "@/hooks/useMissions";
import { MissionType } from "@/hooks/useMissionsTypes";

interface MissionDetailsProps {
  mission: Mission | null;
  onStartMission: () => void;
}

const MissionDetails = ({ mission, onStartMission }: MissionDetailsProps) => {
  if (!mission) {
    return (
      <div className="glass-panel p-6 h-full flex flex-col items-center justify-center text-center">
        <p className="text-gray-400">Selecione uma missão para ver mais detalhes</p>
      </div>
    );
  }

  return (
    <motion.div
      className="glass-panel p-6 h-full"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col h-full">
        <h2 className="text-xl font-heading mb-2">{mission.title}</h2>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-galaxy-deepPurple/70 text-neon-cyan px-2.5 py-1 rounded text-xs">
            {mission.type}
          </span>
          
          {mission.business_type && (
            <span className="bg-galaxy-deepPurple/50 text-gray-300 px-2 py-0.5 rounded text-xs">
              {mission.business_type}
            </span>
          )}
        </div>
        
        <p className="text-sm text-gray-300 mb-6">{mission.description}</p>
        
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Recompensas</h3>
          <div className="bg-galaxy-deepPurple/40 rounded p-3 border border-galaxy-purple/10">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neon-cyan/20">
                  <Award className="w-4 h-4 text-neon-cyan" />
                </div>
                <div>
                  <span className="text-sm font-medium">{mission.points} pontos</span>
                </div>
              </div>
              
              {mission.has_badges && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neon-pink/20">
                    <Trophy className="w-4 h-4 text-neon-pink" />
                  </div>
                  <div>
                    <span className="text-sm font-medium">Badge exclusivo</span>
                  </div>
                </div>
              )}
              
              {mission.streak_bonus && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neon-yellow/20">
                    <Zap className="w-4 h-4 text-neon-yellow" />
                  </div>
                  <div>
                    <span className="text-sm font-medium">
                      Bônus de sequência {mission.streak_multiplier ? `${(mission.streak_multiplier * 100) - 100}%` : ''}
                    </span>
                  </div>
                </div>
              )}
              
              {mission.has_lootbox && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/20">
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <span className="text-sm font-medium">Loot box</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {mission.requirements && mission.requirements.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Requisitos</h3>
            <ul className="space-y-2">
              {mission.requirements.map((req, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="text-neon-cyan mt-0.5 mr-2 h-4 w-4 shrink-0" />
                  <span className="text-sm">{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="mt-auto pt-6">
          <Button 
            onClick={onStartMission}
            className="w-full bg-neon-cyan hover:bg-neon-cyan/80 text-galaxy-darkPurple"
          >
            Iniciar Missão
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// Helper function to render the correct icon based on mission type
const renderMissionTypeIcon = (type: MissionType) => {
  switch (type) {
    case "form":
      return <FileText className="w-5 h-5 mr-2 text-neon-pink" />;
    case "photo":
      return <Image className="w-5 h-5 mr-2 text-neon-pink" />;
    case "video":
      return <Camera className="w-5 h-5 mr-2 text-neon-pink" />;
    case "checkin":
      return <MapPin className="w-5 h-5 mr-2 text-neon-pink" />;
    case "social":
      return <Share2 className="w-5 h-5 mr-2 text-neon-pink" />;
    case "coupon":
      return <Tag className="w-5 h-5 mr-2 text-neon-pink" />;
    case "survey":
      return <FileText className="w-5 h-5 mr-2 text-neon-pink" />;
    case "review":
      return <Star className="w-5 h-5 mr-2 text-neon-pink" />;
    default:
      return <FileText className="w-5 h-5 mr-2 text-neon-pink" />;
  }
};

// Helper function to get a readable mission type name
const getReadableMissionType = (type: MissionType): string => {
  switch (type) {
    case "form": return "Formulário";
    case "photo": return "Foto";
    case "video": return "Vídeo";
    case "checkin": return "Check-in";
    case "social": return "Redes Sociais";
    case "coupon": return "Cupom";
    case "survey": return "Pesquisa";
    case "review": return "Avaliação";
    default: 
      // Safely handle any potential 'never' type values
      return String(type);
  }
};

export default MissionDetails;
