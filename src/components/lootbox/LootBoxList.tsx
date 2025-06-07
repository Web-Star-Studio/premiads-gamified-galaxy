
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Gift, Star, Zap } from 'lucide-react';

export interface LootBoxReward {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  claimed: boolean;
  claimedAt?: string;
}

export interface LootBoxListProps {
  lootBoxes: LootBoxReward[];
  refreshData: () => Promise<void>;
}

const LootBoxList: React.FC<LootBoxListProps> = ({ lootBoxes, refreshData }) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return <Star className="h-4 w-4" />;
      case 'epic': return <Zap className="h-4 w-4" />;
      default: return <Gift className="h-4 w-4" />;
    }
  };

  if (lootBoxes.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Gift className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 mb-2">Nenhuma loot box disponível</p>
          <p className="text-sm text-gray-400">Complete missões para ganhar loot boxes!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {lootBoxes.map((lootBox) => (
        <Card key={lootBox.id} className={`${lootBox.claimed ? 'opacity-75' : ''}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{lootBox.name}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge className={`${getRarityColor(lootBox.rarity)} text-white`}>
                  {getRarityIcon(lootBox.rarity)}
                  <span className="ml-1 capitalize">{lootBox.rarity}</span>
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">{lootBox.description}</p>
            
            {lootBox.claimed ? (
              <div className="text-center">
                <Badge variant="secondary" className="mb-2">
                  Resgatada
                </Badge>
                {lootBox.claimedAt && (
                  <p className="text-xs text-gray-500">
                    Resgatada em {new Date(lootBox.claimedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            ) : (
              <Button 
                className="w-full" 
                onClick={() => refreshData()}
              >
                <Gift className="h-4 w-4 mr-2" />
                Resgatar
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LootBoxList;
