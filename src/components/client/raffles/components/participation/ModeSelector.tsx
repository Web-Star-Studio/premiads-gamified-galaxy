
import React from 'react';
import { Button } from "@/components/ui/button";
import { Ticket, CreditCard } from "lucide-react";

interface ModeSelectorProps {
  purchaseMode: 'tickets' | 'points';
  setPurchaseMode: (mode: 'tickets' | 'points') => void;
  disabled: boolean;
}

const ModeSelector = ({ purchaseMode, setPurchaseMode, disabled }: ModeSelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={purchaseMode === 'tickets' ? "secondary" : "outline"}
        size="sm"
        onClick={() => setPurchaseMode('tickets')}
        disabled={disabled}
        className={purchaseMode === 'tickets' ? "bg-neon-cyan/20 text-neon-cyan" : "bg-galaxy-deepPurple/30"}
      >
        <Ticket className="w-3 h-3 mr-1" />
        Tickets
      </Button>
      <Button
        variant={purchaseMode === 'points' ? "secondary" : "outline"}
        size="sm"
        onClick={() => setPurchaseMode('points')}
        disabled={disabled}
        className={purchaseMode === 'points' ? "bg-neon-pink/20 text-neon-pink" : "bg-galaxy-deepPurple/30"}
      >
        <CreditCard className="w-3 h-3 mr-1" />
        Pontos
      </Button>
    </div>
  );
};

export default ModeSelector;
