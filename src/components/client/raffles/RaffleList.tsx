import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gift, Timer, Calendar, Award, Users, Search, Tag, Filter, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSounds } from "@/hooks/use-sounds";
import { RAFFLES } from "./hooks/data/mockRaffles";

interface RaffleListProps {
  onSelectRaffle: (raffleId: number) => void;
  selectedRaffleId: number | null;
}

const RaffleList = ({ onSelectRaffle, selectedRaffleId }: RaffleListProps) => {
  const { playSound } = useSounds();
  const [activeRaffles, setActiveRaffles] = useState(RAFFLES);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRaffles, setFilteredRaffles] = useState(RAFFLES);
  
  useEffect(() => {
    // In a real app, we would fetch raffles from the API
    const timer = setTimeout(() => {
      playSound("chime");
    }, 300);
    
    return () => clearTimeout(timer);
  }, [playSound]);
  
  useEffect(() => {
    // Filter raffles based on search term
    if (searchTerm.trim() === "") {
      setFilteredRaffles(activeRaffles);
    } else {
      const filtered = activeRaffles.filter(raffle => 
        raffle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        raffle.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRaffles(filtered);
    }
  }, [searchTerm, activeRaffles]);
  
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
  
  const getCountdownBadge = (raffle: any) => {
    if (!raffle.minPointsReachedAt) return null;
    
    const minPointsDate = new Date(raffle.minPointsReachedAt);
    const drawDate = new Date(raffle.drawDate);
    const now = new Date();
    
    // Check if we're in the last hour
    const oneHourBeforeDraw = new Date(drawDate);
    oneHourBeforeDraw.setHours(oneHourBeforeDraw.getHours() - 1);
    
    if (now >= oneHourBeforeDraw && now <= drawDate) {
      return (
        <Badge className="absolute top-2 left-2 bg-amber-500 text-black border border-amber-400/50 flex items-center gap-1 px-2 py-0.5">
          <AlertCircle className="w-3 h-3" />
          Última hora!
        </Badge>
      );
    }
    
    if (now >= minPointsDate && now <= drawDate) {
      return (
        <Badge className="absolute top-2 left-2 bg-blue-500 text-white border border-blue-400/50 flex items-center gap-1 px-2 py-0.5">
          <Clock className="w-3 h-3" />
          Contagem regressiva
        </Badge>
      );
    }
    
    return null;
  };

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold font-heading">Sorteios Disponíveis</h2>
        <Gift className="w-5 h-5 text-neon-pink" />
      </div>
      
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar sorteios..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex justify-end mt-2">
          <Button 
            variant="outline" 
            size="sm"
            className="text-xs flex items-center gap-1 bg-galaxy-deepPurple/30"
          >
            <Filter className="h-3 w-3" />
            Filtros
          </Button>
        </div>
      </div>
      
      {filteredRaffles.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">Nenhum sorteio encontrado.</p>
          <p className="text-sm text-gray-500 mt-2">Tente outros termos de busca ou volte mais tarde para novos sorteios!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRaffles.map((raffle) => (
            <motion.div
              key={raffle.id}
              className={`bg-galaxy-deepPurple/30 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                selectedRaffleId === raffle.id 
                  ? "border border-neon-cyan shadow-[0_0_15px_rgba(0,200,255,0.15)]" 
                  : "border border-galaxy-purple/20 hover:border-galaxy-purple/50"
              }`}
              onClick={() => onSelectRaffle(raffle.id)}
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
                
                {/* Countdown Badge */}
                {getCountdownBadge(raffle)}
                
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
                  </div>
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
