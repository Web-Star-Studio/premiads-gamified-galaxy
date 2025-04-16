
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gift, Timer, Calendar, Award, Users, Search, Tag, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSounds } from "@/hooks/use-sounds";

// Mock data for available raffles
const RAFFLES = [
  {
    id: 1,
    name: "Sorteio Semanal de Pontos",
    description: "Acumule pontos extras para usar em outras promoções e vantagens exclusivas.",
    endDate: "2025-04-22",
    drawDate: "2025-04-23",
    status: "active",
    ticketsRequired: 1,
    participants: 147,
    totalTickets: 500,
    soldTickets: 238,
    progress: 47,
    imageUrl: "https://source.unsplash.com/random/300x200/?prize",
    prizes: [
      { name: "5000 Pontos", rarity: "common" },
      { name: "10000 Pontos", rarity: "uncommon" },
      { name: "Premium por 1 mês", rarity: "rare" }
    ]
  },
  {
    id: 2,
    name: "Loot Box Especial",
    description: "Ganhe itens raros e exclusivos para personalizar sua experiência.",
    endDate: "2025-04-24",
    drawDate: "2025-04-25",
    status: "active",
    ticketsRequired: 3,
    participants: 72,
    totalTickets: 200,
    soldTickets: 86,
    progress: 43,
    imageUrl: "https://source.unsplash.com/random/300x200/?lootbox",
    prizes: [
      { name: "Skin Exclusiva", rarity: "common" },
      { name: "Título Raro", rarity: "uncommon" },
      { name: "Pacote VIP", rarity: "legendary" }
    ]
  },
  {
    id: 3,
    name: "Sorteio de Eletrônicos",
    description: "Concorra a incríveis produtos eletrônicos que serão enviados para sua casa.",
    endDate: "2025-05-10",
    drawDate: "2025-05-12",
    status: "active",
    ticketsRequired: 5,
    participants: 238,
    totalTickets: 1000,
    soldTickets: 680,
    progress: 68,
    imageUrl: "https://source.unsplash.com/random/300x200/?electronics",
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
                      <span>Encerra em: {formatTimeRemaining(raffle.endDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      <span>{raffle.participants} participantes</span>
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
