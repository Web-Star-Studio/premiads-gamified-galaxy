
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';
import { Trash, Plus } from 'lucide-react';
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
}

const PrizeTable: React.FC<PrizeTableProps> = ({ prizes, isCompleted }) => {
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
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Prêmios</h3>
        {!isCompleted && (
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <Button variant="outline" size="sm" className="text-neon-lime border-neon-lime hover:bg-neon-lime/20">
              <Plus className="h-4 w-4 mr-1" />
              Adicionar Prêmio
            </Button>
          </motion.div>
        )}
      </div>
      
      {prizes.length === 0 ? (
        <div className="text-center py-8 bg-galaxy-dark/50 rounded-md border border-galaxy-purple/20">
          <p className="text-muted-foreground">Nenhum prêmio adicionado</p>
        </div>
      ) : (
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
  );
};

export default PrizeTable;
