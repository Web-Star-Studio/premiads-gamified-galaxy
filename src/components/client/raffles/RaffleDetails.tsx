
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Calendar, Clock, Gift, Info, Ticket, Trophy, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { SpinningWheel } from "@/components/admin/lottery";

// Mock data for raffles
const RAFFLES = [
  {
    id: 1,
    name: "Sorteio Semanal de Pontos",
    description: "Participe do sorteio semanal e concorra a pontos extras e benefícios exclusivos. Quanto mais tickets, maiores suas chances!",
    startDate: "2025-04-15",
    endDate: "2025-04-22",
    drawDate: "2025-04-23",
    ticketsRequired: 1,
    status: "active",
    maxTicketsPerUser: 10,
    totalParticipants: 147,
    prizes: [
      { id: 1, name: "5000 Pontos", rarity: "common", probability: 60, image: "https://source.unsplash.com/random/100x100/?coin" },
      { id: 2, name: "10000 Pontos", rarity: "uncommon", probability: 30, image: "https://source.unsplash.com/random/100x100/?diamond" },
      { id: 3, name: "Premium por 1 mês", rarity: "rare", probability: 10, image: "https://source.unsplash.com/random/100x100/?crown" }
    ]
  },
  {
    id: 2,
    name: "Loot Box Especial",
    description: "Uma loot box recheada de itens exclusivos e raros para personalizar sua experiência. Participe agora!",
    startDate: "2025-04-17",
    endDate: "2025-04-24",
    drawDate: "2025-04-25",
    ticketsRequired: 3,
    status: "active",
    maxTicketsPerUser: 5,
    totalParticipants: 72,
    prizes: [
      { id: 4, name: "Skin Exclusiva", rarity: "common", probability: 55, image: "https://source.unsplash.com/random/100x100/?skin" },
      { id: 5, name: "Título Raro", rarity: "uncommon", probability: 35, image: "https://source.unsplash.com/random/100x100/?title" },
      { id: 6, name: "Pacote VIP", rarity: "legendary", probability: 10, image: "https://source.unsplash.com/random/100x100/?vip" }
    ]
  },
  {
    id: 3,
    name: "Sorteio de Eletrônicos",
    description: "Concorra a incríveis produtos eletrônicos! Este é um sorteio especial com prêmios físicos que serão enviados diretamente para sua casa.",
    startDate: "2025-04-10",
    endDate: "2025-05-10",
    drawDate: "2025-05-12",
    ticketsRequired: 5,
    status: "active",
    maxTicketsPerUser: 3,
    totalParticipants: 238,
    prizes: [
      { id: 7, name: "Fone de Ouvido", rarity: "uncommon", probability: 70, image: "https://source.unsplash.com/random/100x100/?headphones" },
      { id: 8, name: "SmartWatch", rarity: "rare", probability: 25, image: "https://source.unsplash.com/random/100x100/?smartwatch" },
      { id: 9, name: "Smartphone", rarity: "legendary", probability: 5, image: "https://source.unsplash.com/random/100x100/?smartphone" }
    ]
  }
];

// Mock user data
const USER_TICKETS = 8;

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
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
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
  
  const getRarityBorderColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "border-gray-300/30";
      case "uncommon": return "border-neon-lime/30";
      case "rare": return "border-neon-cyan/30";
      case "legendary": return "border-neon-pink/30";
      default: return "border-gray-300/30";
    }
  };
  
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
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="my-6"
        >
          <SpinningWheel prizes={raffle.prizes} />
          <p className="text-center text-sm text-gray-400 mt-4">
            Esta é apenas uma simulação. O sorteio real acontecerá em {formatDate(raffle.drawDate)}.
          </p>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="bg-galaxy-deepPurple/30 border-galaxy-purple/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="w-4 h-4 text-neon-cyan" />
                  Informações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-400">Início</div>
                  <div className="flex items-center text-sm">
                    <Calendar className="w-3 h-3 mr-1 text-neon-cyan" />
                    {formatDate(raffle.startDate)}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-400">Encerramento</div>
                  <div className="flex items-center text-sm">
                    <Calendar className="w-3 h-3 mr-1 text-neon-pink" />
                    {formatDate(raffle.endDate)}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-400">Sorteio</div>
                  <div className="flex items-center text-sm">
                    <Clock className="w-3 h-3 mr-1 text-neon-lime" />
                    {formatDate(raffle.drawDate)}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-400">Participantes</div>
                  <div className="flex items-center text-sm">
                    <Users className="w-3 h-3 mr-1" />
                    {raffle.totalParticipants}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-400">Custo</div>
                  <div className="flex items-center text-sm">
                    <Ticket className="w-3 h-3 mr-1 text-neon-cyan" />
                    {raffle.ticketsRequired} {raffle.ticketsRequired > 1 ? "tickets" : "ticket"} por participação
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-400">Limite por usuário</div>
                  <div className="text-sm">{raffle.maxTicketsPerUser} participações</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-galaxy-deepPurple/30 border-galaxy-purple/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-neon-pink" />
                  Prêmios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {raffle.prizes.map((prize: any) => (
                    <div 
                      key={prize.id} 
                      className={`flex items-center p-2 rounded-lg border ${getRarityBorderColor(prize.rarity)} bg-galaxy-deepPurple/40`}
                    >
                      <div className="w-10 h-10 rounded-md overflow-hidden border border-galaxy-purple/30">
                        <img 
                          src={prize.image} 
                          alt={prize.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <div className={`font-medium ${getRarityColor(prize.rarity)}`}>
                          {prize.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          Chance: {prize.probability}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-galaxy-deepPurple/40 rounded-lg p-4 border border-galaxy-purple/20 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-neon-cyan mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-medium mb-1">Sua participação</h4>
                <p className="text-sm text-gray-400">
                  {participationCount > 0 ? (
                    <>Você está participando com <span className="text-neon-cyan">{participationCount} ticket(s)</span> neste sorteio.</>
                  ) : (
                    <>Você ainda não está participando deste sorteio.</>
                  )}
                  {remainingSlots > 0 && (
                    <> Você ainda pode adicionar <span className="text-neon-lime">{remainingSlots} ticket(s)</span> adicionais.</>
                  )}
                </p>
              </div>
            </div>
          </div>
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
