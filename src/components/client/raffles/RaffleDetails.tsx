
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Gift, Ticket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { RAFFLES, USER_TICKETS } from "./raffleData";
import RaffleInfo from "./RaffleInfo";
import RafflePrizes from "./RafflePrizes";
import RaffleParticipation from "./RaffleParticipation";
import RaffleWheel from "./RaffleWheel";

interface RaffleDetailsProps {
  raffleId: number;
}

const RaffleDetails = ({ raffleId }: RaffleDetailsProps) => {
  const { toast } = useToast();
  const { playSound } = useSounds();
  const [raffle, setRaffle] = useState<any>(null);
  const [userTickets, setUserTickets] = useState(USER_TICKETS);
  const [participationCount, setParticipationCount] = useState(0);
  const [isParticipating, setIsParticipating] = useState(false);
  const [showWheel, setShowWheel] = useState(false);
  
  useEffect(() => {
    // In a real app, we would fetch this from the API
    const foundRaffle = RAFFLES.find(r => r.id === raffleId);
    setRaffle(foundRaffle);
    // Reset participation count when raffle changes
    setParticipationCount(0);
  }, [raffleId]);
  
  if (!raffle) {
    return (
      <div className="glass-panel p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-neon-cyan border-galaxy-purple rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-400">Carregando detalhes do sorteio...</p>
        </div>
      </div>
    );
  }
  
  const canParticipate = () => {
    return (
      userTickets >= raffle.ticketsRequired && 
      participationCount < raffle.maxTicketsPerUser
    );
  };
  
  const handleParticipate = () => {
    if (!canParticipate()) {
      toast({
        title: "Não foi possível participar",
        description: userTickets < raffle.ticketsRequired 
          ? "Você não tem tickets suficientes" 
          : "Você atingiu o limite máximo de participações",
        variant: "destructive",
      });
      playSound("error");
      return;
    }
    
    setIsParticipating(true);
    
    // Simulate participation process
    setTimeout(() => {
      setUserTickets(prev => prev - raffle.ticketsRequired);
      setParticipationCount(prev => prev + 1);
      setIsParticipating(false);
      
      // Show success message
      toast({
        title: "Participação confirmada!",
        description: `Você está participando com ${participationCount + 1} ticket(s)!`,
      });
      
      playSound("reward");
      
      // Show spinning wheel animation
      setShowWheel(true);
      setTimeout(() => {
        setShowWheel(false);
      }, 5000);
    }, 1500);
  };
  
  const remainingSlots = raffle.maxTicketsPerUser - participationCount;

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold font-heading">{raffle.name}</h2>
        <div className="flex items-center space-x-1 bg-galaxy-deepPurple/70 px-3 py-1 rounded-full">
          <Ticket className="w-4 h-4 text-neon-cyan" />
          <span className="text-sm">{userTickets} tickets</span>
        </div>
      </div>
      
      <p className="text-gray-400 mb-6">{raffle.description}</p>
      
      {showWheel ? (
        <RaffleWheel prizes={raffle.prizes} drawDate={raffle.drawDate} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <RaffleInfo raffle={raffle} />
            <RafflePrizes prizes={raffle.prizes} />
          </div>
          
          <RaffleParticipation 
            participationCount={participationCount} 
            remainingSlots={remainingSlots} 
          />
        </>
      )}
      
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <Button 
          variant="outline" 
          className="border-galaxy-purple/30 hover:bg-galaxy-deepPurple/50"
          onClick={() => {
            setShowWheel(!showWheel);
            if (!showWheel) {
              playSound("chime");
            }
          }}
        >
          {showWheel ? "Esconder Simulação" : "Ver Simulação"}
        </Button>
        
        <Button 
          className="neon-button"
          disabled={!canParticipate() || isParticipating}
          onClick={handleParticipate}
        >
          {isParticipating ? (
            <>
              <div className="w-4 h-4 border-2 border-t-white/20 border-white rounded-full animate-spin mr-2"></div>
              Processando...
            </>
          ) : (
            <>
              <Gift className="w-4 h-4 mr-2" />
              Participar do Sorteio
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default RaffleDetails;
