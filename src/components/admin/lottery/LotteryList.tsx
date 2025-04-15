
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, CheckCircle, Circle, Timer } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from '@/lib/utils';
import NewLotteryDialog from './NewLotteryDialog';
import { Lottery } from './types';

interface LotteryListProps {
  lotteries: Lottery[];
  selectedLotteryId: number | null;
  onSelectLottery: (lottery: Lottery) => void;
  onLotteryCreated: (lottery: Lottery) => void;
}

const LotteryList: React.FC<LotteryListProps> = ({ 
  lotteries, 
  selectedLotteryId, 
  onSelectLottery,
  onLotteryCreated
}) => {
  const [open, setOpen] = React.useState(false);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Lista de Sorteios</h3>
        <Button size="sm" onClick={() => setOpen(true)} aria-label="Adicionar novo sorteio">
          Novo Sorteio
        </Button>
        <NewLotteryDialog 
          open={open} 
          onOpenChange={setOpen}
          onLotteryCreated={onLotteryCreated}
        />
      </div>
      
      {lotteries.length === 0 ? (
        <p className="text-muted-foreground">Nenhum sorteio encontrado.</p>
      ) : (
        <ScrollArea className="h-[400px] w-full rounded-md border border-galaxy-purple/30">
          <div className="p-2">
            {lotteries.map((lottery) => (
              <motion.div
                key={lottery.id}
                className={cn(
                  "group flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-secondary cursor-pointer",
                  selectedLotteryId === lottery.id ? "bg-secondary" : "bg-transparent"
                )}
                onClick={() => onSelectLottery(lottery)}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-white">{lottery.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {lottery.status === 'active' && (
                    <Badge variant="default">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Ativo
                    </Badge>
                  )}
                  {lottery.status === 'pending' && (
                    <Badge variant="secondary">
                      <Timer className="h-4 w-4 mr-1" />
                      Pendente
                    </Badge>
                  )}
                  {lottery.status === 'completed' && (
                    <Badge variant="outline">
                      <Circle className="h-4 w-4 mr-1" />
                      Finalizado
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground group-hover:text-foreground">
                    <CalendarIcon className="h-3 w-3 mr-1 inline-block" />
                    {format(parseISO(lottery.startDate), 'dd/MM/yyyy', { locale: ptBR })}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default LotteryList;
