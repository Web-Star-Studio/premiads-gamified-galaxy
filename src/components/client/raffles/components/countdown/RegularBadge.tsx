
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface RegularBadgeProps {
  timeRemaining: string;
}

const RegularBadge = ({ timeRemaining }: RegularBadgeProps) => (
    <Badge className="absolute top-4 right-4 bg-neon-cyan text-black border border-neon-cyan/50 flex items-center gap-1 px-3 py-1 text-sm">
      <Clock className="w-3.5 h-3.5" />
      <div className="flex flex-col items-start">
        <span className="font-semibold">Contagem regressiva</span>
        <span className="text-xs">Sorteio {timeRemaining}</span>
      </div>
    </Badge>
  );

export default RegularBadge;
