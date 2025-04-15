
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { getRarityColor, getRarityBorderColor } from "./raffleData";
import type { Prize } from "./raffleData";

interface RafflePrizesProps {
  prizes: Prize[];
}

const RafflePrizes = ({ prizes }: RafflePrizesProps) => {
  return (
    <Card className="bg-galaxy-deepPurple/30 border-galaxy-purple/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="w-4 h-4 text-neon-pink" />
          Prêmios
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {prizes.map((prize) => (
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
  );
};

export default RafflePrizes;
