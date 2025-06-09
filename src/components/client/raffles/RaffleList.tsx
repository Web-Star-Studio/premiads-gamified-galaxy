import { useState, useEffect } from "react";
import { Gift } from "lucide-react";
import { useSounds } from "@/hooks/use-sounds";
import { Lottery } from "@/types/lottery";
import { 
  SearchBar, 
  RafflesList 
} from "./components/raffle-list";
import { formatTimeRemaining, getRarityColor } from "./utils/raffleUtils";

interface RaffleListProps {
  onSelectRaffle: (raffleId: number) => void;
  selectedRaffleId: number | null;
  raffles: Lottery[];
}

const RaffleList = ({ onSelectRaffle, selectedRaffleId, raffles }: RaffleListProps) => {
  const { playSound } = useSounds();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRaffles, setFilteredRaffles] = useState<Lottery[]>(raffles);
  
  useEffect(() => {
    console.log("Raffles loaded:", raffles.length);
    setFilteredRaffles(raffles);
  }, [raffles]);
  
  useEffect(() => {
    // Filter raffles based on search term
    if (searchTerm.trim() === "") {
      setFilteredRaffles(raffles);
    } else {
      const filtered = raffles.filter(raffle => 
        raffle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        raffle.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRaffles(filtered);
    }
  }, [searchTerm, raffles]);
  
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
