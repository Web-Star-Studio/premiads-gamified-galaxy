
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface RaffleProgressProps {
  progress: number;
  soldTickets: number;
  totalTickets: number;
}

const RaffleProgress = ({ progress, soldTickets, totalTickets }: RaffleProgressProps) => (
    <div className="mb-4">
      <div className="flex justify-between text-sm text-gray-400 mb-1">
        <span>Progresso do sorteio</span>
        <span>{progress}% ({soldTickets}/{totalTickets})</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );

export default RaffleProgress;
