
import React from "react";
import { motion } from "framer-motion";
import { Timer, Users, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import RaffleStatusBadge from "./RaffleStatusBadge";

interface RaffleListItemProps {
  raffle: any;
  isSelected: boolean;
  onSelect: () => void;
  formatTimeRemaining: (date: string) => string;
  getRarityColor: (rarity: string) => string;
}

const RaffleListItem = ({ 
  raffle, 
  isSelected, 
  onSelect,
  formatTimeRemaining,
  getRarityColor
}: RaffleListItemProps) => {
  return (
    <motion.div
      className={`bg-galaxy-deepPurple/30 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
        isSelected 
          ? "border border-neon-cyan shadow-[0_0_15px_rgba(0,200,255,0.15)]" 
          : "border border-galaxy-purple/20 hover:border-galaxy-purple/50"
      }`}
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative h-36">
        <img 
          src={raffle.imageUrl} 
          alt={raffle.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-galaxy-deepPurple/90 to-transparent" />
        
        <RaffleStatusBadge raffle={raffle} />
        
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="font-medium text-white text-lg">{raffle.name}</h3>
        </div>
        <Badge className="absolute top-2 right-2 bg-galaxy-deepPurple text-neon-cyan border border-neon-cyan/30">
          {raffle.ticketsRequired} {raffle.ticketsRequired > 1 ? "tickets" : "ticket"}
        </Badge>
      </div>
      
      <div className="p-3">
        <p className="text-sm text-gray-300 mb-3 line-clamp-2">
          {raffle.description}
        </p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-400">
            <div className="flex items-center">
              <Timer className="w-3 h-3 mr-1" />
              {raffle.isAutoScheduled && raffle.minPointsReachedAt ? (
                <span>Sorteio em: {formatTimeRemaining(raffle.drawDate)}</span>
              ) : (
                <span>Meta: {raffle.minPoints.toLocaleString('pt-BR')} pontos</span>
              )}
            </div>
            <div className="flex items-center">
              <Users className="w-3 h-3 mr-1" />
              <span>{raffle.totalParticipants} participantes</span>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progresso</span>
              <span>{raffle.progress}%</span>
            </div>
            <Progress value={raffle.progress} className="h-2" />
          </div>
          
          <div className="pt-2 border-t border-galaxy-purple/10">
            <div className="text-xs text-gray-400 mb-1 flex items-center">
              <Award className="w-3 h-3 mr-1" />
              <span>Prêmios:</span>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {raffle.prizes.map((prize: any, index: number) => (
                <span 
                  key={index}
                  className={`text-xs ${getRarityColor(prize.rarity)}`}
                >
                  {prize.name}
                  {index < raffle.prizes.length - 1 && " • "}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RaffleListItem;
