
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface LastHourBadgeProps {
  timeRemaining: string;
}

const LastHourBadge = ({ timeRemaining }: LastHourBadgeProps) => {
  return (
    <Badge className="absolute top-4 right-4 bg-amber-500 text-black border border-amber-400/50 flex items-center gap-1 px-3 py-1 text-sm animate-pulse">
      <Clock className="w-3.5 h-3.5" />
      <div className="flex flex-col items-start">
        <span className="font-semibold">Última hora!</span>
        <span className="text-xs">Sorteio {timeRemaining}</span>
      </div>
    </Badge>
  );
};

export default LastHourBadge;
