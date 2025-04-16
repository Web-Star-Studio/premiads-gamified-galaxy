
import React from 'react';
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";

interface PurchaseButtonProps {
  isDisabled: boolean;
  isParticipating: boolean;
  purchaseMode: 'tickets' | 'points';
  purchaseAmount: number;
  pointsNeeded: number;
  onClick: () => void;
}

const PurchaseButton = ({
  isDisabled,
  isParticipating,
  purchaseMode,
  purchaseAmount,
  pointsNeeded,
  onClick
}: PurchaseButtonProps) => {
  return (
    <Button 
      className="neon-button"
      disabled={isDisabled}
      onClick={onClick}
    >
      {isParticipating ? (
        <>
          <div className="w-4 h-4 border-2 border-t-white/20 border-white rounded-full animate-spin mr-2"></div>
          Processando...
        </>
      ) : (
        <>
          <Gift className="w-4 h-4 mr-2" />
          {purchaseMode === 'tickets' 
            ? `Participar com ${purchaseAmount} ticket${purchaseAmount > 1 ? 's' : ''}` 
            : `Comprar com ${pointsNeeded} pontos`}
        </>
      )}
    </Button>
  );
};

export default PurchaseButton;
