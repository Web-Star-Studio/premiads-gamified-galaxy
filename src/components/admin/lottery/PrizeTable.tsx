
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';
import { Trash, Plus, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Prize {
  id: number;
  name: string;
  rarity: string;
  probability: number;
}

interface PrizeTableProps {
  prizes: Prize[];
  isCompleted: boolean;
  // Add lottery prize data directly from database
  lotteryPrize?: {
    prize_type: string;
    prize_value: number | string;
    image_url?: string;
  };
}

const PrizeTable: React.FC<PrizeTableProps> = ({ prizes, isCompleted, lotteryPrize }) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500/80';
      case 'uncommon': return 'bg-green-600/80';
      case 'rare': return 'bg-blue-600/80';
      case 'epic': return 'bg-purple-600/80';
      case 'legendary': return 'bg-orange-600/80';
      default: return 'bg-gray-500/80';
    }
  };

  const formatPrizeValue = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return `R$ ${numValue.toFixed(2).replace('.', ',')}`; 
  };

  // Check if we have lottery prize data from database
  const hasLotteryPrize = lotteryPrize && 
    (lotteryPrize.prize_type || '').trim() !== '' && 
    lotteryPrize.prize_value && 
    parseFloat(lotteryPrize.prize_value.toString()) > 0;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium flex items-center">
          <Gift className="h-5 w-5 mr-2 text-neon-lime" />
          Prêmios
        </h3>
        {!isCompleted && (
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <Button variant="outline" size="sm" className="text-neon-lime border-neon-lime hover:bg-neon-lime/20">
              <Plus className="h-4 w-4 mr-1" />
              Adicionar Prêmio
            </Button>
          </motion.div>
        )}
      </div>
      
      {!hasLotteryPrize && prizes.length === 0 ? (
        <div className="text-center py-8 bg-galaxy-dark/50 rounded-md border border-galaxy-purple/20">
          <p className="text-muted-foreground">Nenhum prêmio adicionado</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Show lottery prize from database if available */}
          {hasLotteryPrize && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-r from-neon-pink/20 to-neon-cyan/20 rounded-lg p-4 border border-neon-pink/30"
            >
              <div className="flex items-center gap-4">
                {lotteryPrize.image_url && (
                  <div className="flex-shrink-0">
                    <img 
                      src={lotteryPrize.image_url} 
                      alt={lotteryPrize.prize_type}
                      className="w-16 h-16 rounded-lg object-cover border border-galaxy-purple/30"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-medium text-white text-lg">{lotteryPrize.prize_type || 'Prêmio'}</h4>
                  <p className="text-neon-lime font-bold text-xl">{formatPrizeValue(lotteryPrize.prize_value)}</p>
                  <div className="mt-2">
                    <Badge className="bg-gradient-to-r from-neon-pink to-neon-cyan text-white">
                      Prêmio Principal
                    </Badge>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
                     {/* Show additional prizes table if any */}
           {prizes.length > 0 && (
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>Prêmio</TableHead>
                   <TableHead>Raridade</TableHead>
                   <TableHead className="text-right">Chance</TableHead>
                   {!isCompleted && <TableHead className="w-[50px]"></TableHead>}
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {prizes.map((prize) => (
                   <TableRow key={prize.id}>
                     <TableCell>{prize.name}</TableCell>
                     <TableCell>
                       <Badge className={`${getRarityColor(prize.rarity)} text-white capitalize`}>
                         {prize.rarity}
                       </Badge>
                     </TableCell>
                     <TableCell className="text-right">{prize.probability}%</TableCell>
                     {!isCompleted && (
                       <TableCell>
                         <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-red-500">
                           <Trash className="h-4 w-4" />
                         </Button>
                       </TableCell>
                     )}
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
           )}
         </div>
       )}
    </div>
  );
};

export default PrizeTable;
