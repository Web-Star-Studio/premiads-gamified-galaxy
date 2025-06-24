import React from 'react';
import { Separator } from '@/components/ui/separator';
import { CashbackCampaign } from '@/types/cashback';

interface CampaignDialogDetailsProps {
  campaign: CashbackCampaign;
  userCashback: number;
  formatDate: (dateString: string) => string;
}

const CampaignDialogDetails: React.FC<CampaignDialogDetailsProps> = ({ 
  campaign, 
  userCashback,
  formatDate 
}) => (
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

      <div className="space-y-2">
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
      </div>
    </div>
  );

export default CampaignDialogDetails;
