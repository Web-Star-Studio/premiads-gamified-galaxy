
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gift, Timer, Calendar, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSounds } from "@/hooks/use-sounds";

// Mock data for available raffles
const RAFFLES = [
  {
    id: 1,
    name: "Sorteio Semanal de Pontos",
    endDate: "2025-04-22",
    status: "active",
    ticketsRequired: 1,
    participants: 147,
    prizes: [
      { name: "5000 Pontos", rarity: "common" },
      { name: "10000 Pontos", rarity: "uncommon" },
      { name: "Premium por 1 mês", rarity: "rare" }
    ]
  },
  {
    id: 2,
    name: "Loot Box Especial",
    endDate: "2025-04-24",
    status: "active",
    ticketsRequired: 3,
    participants: 72,
    prizes: [
      { name: "Skin Exclusiva", rarity: "common" },
      { name: "Título Raro", rarity: "uncommon" },
      { name: "Pacote VIP", rarity: "legendary" }
    ]
  },
  {
    id: 3,
    name: "Sorteio de Eletrônicos",
    endDate: "2025-05-10",
    status: "active",
    ticketsRequired: 5,
    participants: 238,
    prizes: [
      { name: "Fone de Ouvido", rarity: "uncommon" },
      { name: "SmartWatch", rarity: "rare" },
      { name: "Smartphone", rarity: "legendary" }
    ]
  }
];

interface RaffleListProps {
  onSelectRaffle: (raffleId: number) => void;
  selectedRaffleId: number | null;
}

const RaffleList = ({ onSelectRaffle, selectedRaffleId }: RaffleListProps) => {
  const { playSound } = useSounds();
  const [activeRaffles, setActiveRaffles] = useState(RAFFLES);
  
  useEffect(() => {
    // In a real app, we would fetch raffles from the API
    const timer = setTimeout(() => {
      playSound("chime");
    }, 300);
    
    return () => clearTimeout(timer);
  }, [playSound]);
  
  const formatTimeRemaining = (dateStr: string) => {
    const endDate = new Date(dateStr);
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    
    if (diff <= 0) return "Encerrado";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days > 0) {
      return `${days} dias`;
    }
    
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };
  
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "text-gray-300";
      case "uncommon": return "text-neon-lime";
      case "rare": return "text-neon-cyan";
      case "legendary": return "text-neon-pink";
      default: return "text-gray-300";
    }
  };

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold font-heading">Sorteios Disponíveis</h2>
        <Gift className="w-5 h-5 text-neon-pink" />
      </div>
      
      {activeRaffles.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">Nenhum sorteio ativo no momento.</p>
          <p className="text-sm text-gray-500 mt-2">Volte mais tarde para novos sorteios!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeRaffles.map((raffle) => (
            <motion.div
              key={raffle.id}
              className={`bg-galaxy-deepPurple/30 rounded-lg p-4 border cursor-pointer transition-all duration-200 ${
                selectedRaffleId === raffle.id 
                  ? "border-neon-cyan shadow-[0_0_15px_rgba(0,200,255,0.15)]" 
                  : "border-galaxy-purple/20 hover:border-galaxy-purple/50"
              }`}
              onClick={() => onSelectRaffle(raffle.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-white">{raffle.name}</h3>
                  <div className="flex items-center text-xs text-gray-400 mt-1">
                    <Timer className="w-3 h-3 mr-1" />
                    <span>Encerra em: {formatTimeRemaining(raffle.endDate)}</span>
                  </div>
                </div>
                
                <Badge className="bg-galaxy-deepPurple text-neon-cyan border border-neon-cyan/30">
                  {raffle.ticketsRequired} {raffle.ticketsRequired > 1 ? "tickets" : "ticket"}
                </Badge>
              </div>
              
              <div className="mt-3 pt-3 border-t border-galaxy-purple/10">
                <div className="text-xs text-gray-400 mb-2 flex items-center">
                  <Award className="w-3 h-3 mr-1" />
                  <span>Prêmios principais:</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {raffle.prizes.map((prize, index) => (
                    <span 
                      key={index}
                      className={`text-xs ${getRarityColor(prize.rarity)}`}
                    >
                      {prize.name}
                      {index < raffle.prizes.length - 1 && " • "}
                    </span>
                  ))}
                </div>
                
                <div className="mt-2 text-xs text-gray-500 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>{raffle.participants} participantes</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RaffleList;
