
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Timer, AlertCircle } from "lucide-react";

interface ClosedBadgeProps {
  timeRemaining: string;
}

const ClosedBadge = ({ timeRemaining }: ClosedBadgeProps) => (
    <Badge className="absolute top-4 right-4 bg-red-600/90 text-white border border-red-500/50 flex items-center gap-1 px-3 py-1 text-sm animate-pulse">
      <AlertCircle className="w-3.5 h-3.5" />
      <div className="flex flex-col items-start">
        <span className="font-semibold">Participação encerrada</span>
        <span className="text-xs">Sorteio {timeRemaining}</span>
      </div>
    </Badge>
  );

export default ClosedBadge;
