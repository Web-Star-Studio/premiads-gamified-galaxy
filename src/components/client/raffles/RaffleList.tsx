
import { useState, useEffect } from "react";
import { Gift } from "lucide-react";
import { useSounds } from "@/hooks/use-sounds";
import { RAFFLES } from "./hooks/data/mockRaffles";
import { 
  SearchBar, 
  RafflesList 
} from "./components/raffle-list";
import { formatTimeRemaining, getRarityColor } from "./utils/raffleUtils";

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
      console.log("Raffles loaded:", RAFFLES.length);
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
  
  const handleSelectRaffle = (id: number) => {
    console.log("Selecting raffle with ID:", id);
    onSelectRaffle(id);
    playSound("pop");
  };

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold font-heading">Sorteios Disponíveis</h2>
        <Gift className="w-5 h-5 text-neon-pink" />
      </div>
      
      <SearchBar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
      />
      
      <RafflesList 
        raffles={filteredRaffles}
        selectedRaffleId={selectedRaffleId}
        onSelectRaffle={handleSelectRaffle}
        formatTimeRemaining={formatTimeRemaining}
        getRarityColor={getRarityColor}
      />
    </div>
  );
};

export default RaffleList;
