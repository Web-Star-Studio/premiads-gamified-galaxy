
import React, { useState } from 'react';
import { Ticket, Calendar, Plus } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import NewLotteryDialog from './NewLotteryDialog';

interface Prize {
  id: number;
  name: string;
  rarity: string;
  probability: number;
}

export interface Lottery {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  prizes: Prize[];
}

interface LotteryListProps {
  lotteries: Lottery[];
  selectedLotteryId: number | null;
  onSelectLottery: (lottery: Lottery) => void;
  onLotteryCreated?: (lottery: Lottery) => void;
}

const LotteryList: React.FC<LotteryListProps> = ({ 
  lotteries,
  selectedLotteryId,
  onSelectLottery,
  onLotteryCreated
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-neon-lime text-black">Ativo</Badge>;
      case 'pending': return <Badge className="bg-yellow-500 text-black">Pendente</Badge>;
      case 'completed': return <Badge className="bg-muted">Concluído</Badge>;
      default: return <Badge>Desconhecido</Badge>;
    }
  };

  const handleNewLotteryClick = () => {
    setDialogOpen(true);
  };

  const handleLotteryCreated = (newLottery: Lottery) => {
    if (onLotteryCreated) {
      onLotteryCreated(newLottery);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium flex items-center">
          <Ticket className="h-4 w-4 mr-2 text-neon-cyan" />
          Sorteios
        </h3>
        <button 
          className="bg-neon-pink hover:bg-neon-pink/80 text-white px-3 py-1.5 rounded-md text-sm flex items-center"
          onClick={handleNewLotteryClick}
          aria-label="Adicionar novo sorteio"
        >
          <Plus className="h-4 w-4 mr-1" />
          Novo
        </button>
      </div>
      
      <div className="space-y-3 max-h-[500px] overflow-y-auto fancy-scrollbar pr-2">
        {lotteries.length > 0 ? (
          lotteries.map(lottery => (
            <div
              key={lottery.id}
              className={`p-3 rounded-md border cursor-pointer transition-all duration-200 ${
                selectedLotteryId === lottery.id 
                  ? 'border-neon-cyan bg-galaxy-dark/50 shadow-[0_0_10px_rgba(0,255,231,0.3)]' 
                  : 'border-galaxy-purple/30 hover:border-galaxy-purple/60'
              }`}
              onClick={() => onSelectLottery(lottery)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{lottery.name}</div>
                  <div className="text-sm text-muted-foreground flex items-center mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    {lottery.startDate} - {lottery.endDate}
                  </div>
                </div>
                <div>{getStatusBadge(lottery.status)}</div>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                {lottery.prizes.length} prêmios configurados
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            Nenhum sorteio encontrado. Crie um novo sorteio clicando em "Novo".
          </div>
        )}
      </div>

      <NewLotteryDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        onLotteryCreated={handleLotteryCreated}
      />
    </div>
  );
};

export default LotteryList;
