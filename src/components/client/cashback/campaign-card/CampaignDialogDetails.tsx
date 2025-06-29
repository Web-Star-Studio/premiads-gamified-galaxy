import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CashbackCampaign } from '@/types/cashback';

interface CampaignDialogDetailsProps {
  campaign: CashbackCampaign;
  userCashback: number;
  formatDate: (dateString: string) => string;
  customAmount?: number;
  onAmountChange?: (amount: number) => void;
}

const CampaignDialogDetails: React.FC<CampaignDialogDetailsProps> = ({ 
  campaign, 
  userCashback,
  formatDate,
  customAmount,
  onAmountChange
}) => {
  const [inputValue, setInputValue] = useState(customAmount?.toString() || '');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Parse and validate the value
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= userCashback && onAmountChange) {
      onAmountChange(numericValue);
    }
  };

  const calculateDiscountAmount = (amount: number) => {
    return (amount * campaign.cashback_percentage) / 100;
  };

  const currentAmount = customAmount || userCashback;
  const discountAmount = calculateDiscountAmount(currentAmount);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full overflow-hidden bg-galaxy-deepPurple/50 flex items-center justify-center">
          <img 
            src={campaign.advertiser_logo || "https://via.placeholder.com/80x80?text=Logo"} 
            alt="Logo" 
            className="h-10 w-10 object-contain"
          />
        </div>
        <div>
          <h3 className="font-semibold">{campaign.title}</h3>
          <p className="text-sm text-gray-400">{campaign.advertiser_name || "Anunciante Parceiro"}</p>
        </div>
      </div>

      <Separator className="bg-galaxy-purple/30" />

      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-400">Desconto:</span>
          <span className="font-semibold text-neon-cyan">{campaign.cashback_percentage}%</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Validade:</span>
          <span>{formatDate(campaign.end_date)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Seu saldo:</span>
          <span className="font-bold">R$ {userCashback.toFixed(2)}</span>
        </div>

        <Separator className="bg-galaxy-purple/30" />

        {/* Custom amount input */}
        <div className="space-y-2">
          <Label htmlFor="cashback-amount" className="text-sm font-medium">
            Valor a resgatar (R$)
          </Label>
          <Input
            id="cashback-amount"
            type="number"
            placeholder="Digite o valor"
            value={inputValue}
            onChange={handleInputChange}
            min="0"
            max={userCashback}
            step="0.01"
            className="bg-galaxy-deepPurple/50 border-galaxy-purple/30 focus:border-neon-cyan"
          />
          <p className="text-xs text-gray-400">
            Máximo: R$ {userCashback.toFixed(2)}
          </p>
        </div>

        {/* Discount calculation */}
        {currentAmount > 0 && (
          <div className="bg-galaxy-deepPurple/30 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Valor do resgate:</span>
              <span>R$ {currentAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Desconto ({campaign.cashback_percentage}%):</span>
              <span className="text-neon-lime font-semibold">R$ {discountAmount.toFixed(2)}</span>
            </div>
            <Separator className="bg-galaxy-purple/30" />
            <div className="flex justify-between font-semibold">
              <span>Economia total:</span>
              <span className="text-neon-lime">R$ {discountAmount.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignDialogDetails;
