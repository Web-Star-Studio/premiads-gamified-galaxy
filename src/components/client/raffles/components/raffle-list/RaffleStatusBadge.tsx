
import React from "react";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock } from "lucide-react";

interface RaffleStatusBadgeProps {
  raffle: any;
}

const RaffleStatusBadge = ({ raffle }: RaffleStatusBadgeProps) => {
  if (!raffle.minPointsReachedAt) return null;
  
  const minPointsDate = new Date(raffle.minPointsReachedAt);
  const drawDate = new Date(raffle.drawDate);
  const now = new Date();
  
  // Check if we're in the last hour
  const oneHourBeforeDraw = new Date(drawDate);
  oneHourBeforeDraw.setHours(oneHourBeforeDraw.getHours() - 1);
  
  if (now >= oneHourBeforeDraw && now <= drawDate) {
    return (
      <Badge className="absolute top-2 left-2 bg-amber-500 text-black border border-amber-400/50 flex items-center gap-1 px-2 py-0.5">
        <AlertCircle className="w-3 h-3" />
        Última hora!
      </Badge>
    );
  }
  
  if (now >= minPointsDate && now <= drawDate) {
    return (
      <Badge className="absolute top-2 left-2 bg-blue-500 text-white border border-blue-400/50 flex items-center gap-1 px-2 py-0.5">
        <Clock className="w-3 h-3" />
        Contagem regressiva
      </Badge>
    );
  }
  
  return null;
};

export default RaffleStatusBadge;
