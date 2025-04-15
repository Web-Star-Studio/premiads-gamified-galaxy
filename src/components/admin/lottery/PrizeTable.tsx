
import React from 'react';
import { Dices, Plus, ChevronsUpDown } from 'lucide-react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
      case 'common': return 'bg-slate-400 text-black';
      case 'uncommon': return 'bg-neon-cyan text-black';
      case 'rare': return 'bg-neon-lime text-black';
      case 'epic': return 'bg-purple-500 text-white';
      case 'legendary': return 'bg-neon-pink text-white';
      default: return 'bg-slate-400 text-black';
    }
  };

  return (
    <div>
      <h4 className="font-medium mb-3 flex items-center">
        <Dices className="h-4 w-4 mr-2 text-neon-pink" />
        Prêmios e Probabilidades
      </h4>
      
      <div className="bg-galaxy-dark rounded-md border border-galaxy-purple/30 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prêmio</TableHead>
              <TableHead>Raridade</TableHead>
              <TableHead>Chance</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prizes.map((prize: any) => (
              <TableRow key={prize.id}>
                <TableCell className="font-medium">{prize.name}</TableCell>
                <TableCell>
                  <Badge className={getRarityColor(prize.rarity)}>
                    {prize.rarity}
                  </Badge>
                </TableCell>
                <TableCell>{prize.probability}%</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ChevronsUpDown className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {!isCompleted && (
        <Button
          className="w-full mt-3 bg-neon-cyan text-galaxy-dark hover:bg-neon-cyan/80"
        >
          <Plus className="h-4 w-4 mr-1" />
          Adicionar Prêmio
        </Button>
      )}
    </div>
  );
};

export default PrizeTable;
