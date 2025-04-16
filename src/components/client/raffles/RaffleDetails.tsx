
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Calendar, Clock, Gift, Info, Ticket, Trophy, Users, Plus, Minus, CreditCard } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";

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
    totalTickets: 500,
    soldTickets: 238,
    progress: 47,
    imageUrl: "https://source.unsplash.com/random/800x400/?prize",
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
    totalTickets: 200,
    soldTickets: 86,
    progress: 43,
    imageUrl: "https://source.unsplash.com/random/800x400/?lootbox",
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
    totalTickets: 1000,
    soldTickets: 680,
    progress: 68,
    imageUrl: "https://source.unsplash.com/random/800x400/?electronics",
    prizes: [
      { id: 7, name: "Fone de Ouvido", rarity: "uncommon", probability: 70, image: "https://source.unsplash.com/random/100x100/?headphones" },
      { id: 8, name: "SmartWatch", rarity: "rare", probability: 25, image: "https://source.unsplash.com/random/100x100/?smartwatch" },
      { id: 9, name: "Smartphone", rarity: "legendary", probability: 5, image: "https://source.unsplash.com/random/100x100/?smartphone" }
    ]
  }
];

// Mock user data
const USER_TICKETS = 8;
const USER_POINTS = 750;
const POINTS_PER_TICKET = 100;

interface RaffleDetailsProps {
  raffleId: number;
}

const RaffleDetails = ({ raffleId }: RaffleDetailsProps) => {
  const { toast } = useToast();
  const { playSound } = useSounds();
  const [raffle, setRaffle] = useState<any>(null);
  const [userTickets, setUserTickets] = useState(USER_TICKETS);
  const [userPoints, setUserPoints] = useState(USER_POINTS);
  const [participationCount, setParticipationCount] = useState(0);
  const [isParticipating, setIsParticipating] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState(1);
  const [purchaseMode, setPurchaseMode] = useState<'tickets' | 'points'>('tickets');
  
  useEffect(() => {
    // In a real app, we would fetch this from the API
    const foundRaffle = RAFFLES.find(r => r.id === raffleId);
    setRaffle(foundRaffle);
    // Reset participation count and purchase amount when raffle changes
    setParticipationCount(0);
    setPurchaseAmount(1);
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
  
  const canPurchaseWithTickets = () => {
    return (
      userTickets >= purchaseAmount && 
      participationCount + purchaseAmount <= raffle.maxTicketsPerUser
    );
  };
  
  const canPurchaseWithPoints = () => {
    const pointsNeeded = purchaseAmount * raffle.ticketsRequired * POINTS_PER_TICKET;
    return (
      userPoints >= pointsNeeded && 
      participationCount + purchaseAmount <= raffle.maxTicketsPerUser
    );
  };
  
  const handleDecreasePurchase = () => {
    if (purchaseAmount > 1) {
      setPurchaseAmount(purchaseAmount - 1);
    }
  };
  
  const handleIncreasePurchase = () => {
    const remainingSlots = raffle.maxTicketsPerUser - participationCount;
    if (purchaseAmount < remainingSlots) {
      setPurchaseAmount(purchaseAmount + 1);
    }
  };
  
  const handlePurchase = () => {
    if (purchaseMode === 'tickets' && !canPurchaseWithTickets()) {
      toast({
        title: "Não foi possível participar",
        description: userTickets < purchaseAmount
          ? "Você não tem tickets suficientes" 
          : "Você atingiu o limite máximo de participações",
        variant: "destructive",
      });
      playSound("error");
      return;
    }
    
    if (purchaseMode === 'points' && !canPurchaseWithPoints()) {
      toast({
        title: "Não foi possível participar",
        description: "Você não tem pontos suficientes",
        variant: "destructive",
      });
      playSound("error");
      return;
    }
    
    setIsParticipating(true);
    
    // Simulate participation process
    setTimeout(() => {
      if (purchaseMode === 'tickets') {
        setUserTickets(prev => prev - purchaseAmount);
      } else {
        setUserPoints(prev => prev - (purchaseAmount * raffle.ticketsRequired * POINTS_PER_TICKET));
      }
      
      setParticipationCount(prev => prev + purchaseAmount);
      setIsParticipating(false);
      
      // Show success message
      toast({
        title: "Participação confirmada!",
        description: `Você está participando com ${participationCount + purchaseAmount} ticket(s)!`,
      });
      
      playSound("reward");
    }, 1500);
  };
  
  const remainingSlots = raffle.maxTicketsPerUser - participationCount;
  const pointsNeeded = purchaseAmount * raffle.ticketsRequired * POINTS_PER_TICKET;

  return (
    <div className="glass-panel p-6">
      <div className="mb-6">
        <div className="relative h-56 rounded-lg overflow-hidden mb-4">
          <img 
            src={raffle.imageUrl} 
            alt={raffle.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-galaxy-deepPurple/90 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-heading text-white">{raffle.name}</h2>
              <Badge className="bg-galaxy-deepPurple text-neon-cyan border border-neon-cyan/30">
                {raffle.ticketsRequired} {raffle.ticketsRequired > 1 ? "tickets" : "ticket"}
              </Badge>
            </div>
          </div>
        </div>
        
        <p className="text-gray-400 mb-4">{raffle.description}</p>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>Progresso do sorteio</span>
            <span>{raffle.progress}% ({raffle.soldTickets}/{raffle.totalTickets})</span>
          </div>
          <Progress value={raffle.progress} className="h-2" />
        </div>
      </div>
      
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
      
      <Card className="bg-galaxy-deepPurple/30 border-galaxy-purple/20 mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Ticket className="w-4 h-4 text-neon-cyan" />
            Participar do Sorteio
          </CardTitle>
          <CardDescription>
            {remainingSlots > 0 
              ? `Você pode adicionar até ${remainingSlots} participações neste sorteio.`
              : "Você atingiu o limite máximo de participações neste sorteio."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="flex items-center p-1 bg-galaxy-deepPurple/50 rounded-md border border-galaxy-purple/30">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-8 h-8 p-0"
                    onClick={handleDecreasePurchase}
                    disabled={purchaseAmount <= 1 || isParticipating}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{purchaseAmount}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-8 h-8 p-0"
                    onClick={handleIncreasePurchase}
                    disabled={purchaseAmount >= remainingSlots || isParticipating}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-gray-400">participações</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={purchaseMode === 'tickets' ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setPurchaseMode('tickets')}
                  disabled={isParticipating}
                  className={purchaseMode === 'tickets' ? "bg-neon-cyan/20 text-neon-cyan" : "bg-galaxy-deepPurple/30"}
                >
                  <Ticket className="w-3 h-3 mr-1" />
                  Tickets
                </Button>
                <Button
                  variant={purchaseMode === 'points' ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setPurchaseMode('points')}
                  disabled={isParticipating}
                  className={purchaseMode === 'points' ? "bg-neon-pink/20 text-neon-pink" : "bg-galaxy-deepPurple/30"}
                >
                  <CreditCard className="w-3 h-3 mr-1" />
                  Pontos
                </Button>
              </div>
            </div>
            
            <div className="bg-galaxy-deepPurple/50 p-3 rounded-md border border-galaxy-purple/30">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm">Você tem:</div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <Ticket className="w-3 h-3 mr-1 text-neon-cyan" />
                    <span className="text-neon-cyan">{userTickets} tickets</span>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="w-3 h-3 mr-1 text-neon-pink" />
                    <span className="text-neon-pink">{userPoints} pontos</span>
                  </div>
                </div>
              </div>
              
              {purchaseMode === 'tickets' ? (
                <div className="text-sm text-gray-400">
                  Custo: <span className="text-neon-cyan">{purchaseAmount} tickets</span>
                </div>
              ) : (
                <div className="text-sm text-gray-400">
                  Custo: <span className="text-neon-pink">{pointsNeeded} pontos</span> 
                  <span className="text-xs ml-1">({purchaseAmount} x {raffle.ticketsRequired} tickets x {POINTS_PER_TICKET} pontos)</span>
                </div>
              )}
            </div>
            
            {participationCount > 0 && (
              <div className="bg-galaxy-deepPurple/50 p-3 rounded-md border border-neon-cyan/20 text-sm">
                <div className="flex items-center">
                  <AlertTriangle className="w-4 h-4 text-neon-cyan mr-2" />
                  <span>Você já está participando com <span className="text-neon-cyan">{participationCount} ticket(s)</span></span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          className="neon-button"
          disabled={
            (purchaseMode === 'tickets' && !canPurchaseWithTickets()) || 
            (purchaseMode === 'points' && !canPurchaseWithPoints()) || 
            isParticipating
          }
          onClick={handlePurchase}
        >
          {isParticipating ? (
            <>
              <div className="w-4 h-4 border-2 border-t-white/20 border-white rounded-full animate-spin mr-2"></div>
              Processando...
            </>
          ) : (
            <>
              <Gift className="w-4 h-4 mr-2" />
              {purchaseMode === 'tickets' 
                ? `Participar com ${purchaseAmount} ticket${purchaseAmount > 1 ? 's' : ''}` 
                : `Comprar com ${pointsNeeded} pontos`}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default RaffleDetails;
