import React from "react";
import { motion } from "framer-motion";
import { FileText, Image, Camera, Share2, MapPin, Tag, Star } from "lucide-react";
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
      <div className="glass-panel p-8 text-center h-full flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 2
          }}
        >
          <div className="w-24 h-24 rounded-full bg-galaxy-deepPurple/50 flex items-center justify-center border border-neon-cyan/30">
            <FileText className="w-12 h-12 text-neon-cyan" />
          </div>
        </motion.div>
        <h3 className="text-xl font-heading mt-6">Selecione uma Missão</h3>
        <p className="text-gray-400 mt-2 max-w-md">
          Escolha uma das missões disponíveis para ver detalhes e iniciar sua participação.
        </p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-heading">{mission.title}</h2>
          <p className="text-sm text-gray-400">{mission.brand || "PremiAds"}</p>
        </div>
        <Badge 
          variant="secondary" 
          className="text-lg px-3 py-1 bg-neon-cyan/20 text-neon-cyan"
        >
          {mission.points} pts
        </Badge>
      </div>
      
      <p className="mb-6">{mission.description}</p>
      
      {mission.requirements && mission.requirements.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Requisitos</h3>
          <ul className="space-y-1 list-disc pl-5">
            {mission.requirements.map((req: string, index: number) => (
              <li key={index} className="text-gray-300">{req}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Tipo de Missão</h3>
        <div className="flex items-center">
          {renderMissionTypeIcon(mission.type)}
          <span className="capitalize">{getReadableMissionType(mission.type)}</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center text-sm text-gray-400 mb-6">
        <div className="flex items-center">
          <span>Prazo: {mission.deadline 
            ? new Date(mission.deadline).toLocaleDateString('pt-BR') 
            : "Sem prazo"}</span>
        </div>
      </div>
      
      <Button 
        className="w-full bg-neon-cyan text-galaxy-dark hover:bg-neon-cyan/80"
        onClick={onStartMission}
      >
        Iniciar Missão
      </Button>
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
