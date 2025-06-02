
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

interface AmountSelectorProps {
  purchaseAmount: number;
  onDecrease: () => void;
  onIncrease: () => void;
  disabled: boolean;
  min?: number;
  max?: number;
}

const AmountSelector = ({
  purchaseAmount,
  onDecrease,
  onIncrease,
  disabled,
  min = 1,
  max = Infinity
}: AmountSelectorProps) => (
    <div className="flex items-center gap-2">
      <div className="flex items-center p-1 bg-galaxy-deepPurple/50 rounded-md border border-galaxy-purple/30">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-8 h-8 p-0"
          onClick={onDecrease}
          disabled={disabled || purchaseAmount <= min}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center">{purchaseAmount}</span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-8 h-8 p-0"
          onClick={onIncrease}
          disabled={disabled || purchaseAmount >= max}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <span className="text-sm text-gray-400">participações</span>
    </div>
  );

export default AmountSelector;
