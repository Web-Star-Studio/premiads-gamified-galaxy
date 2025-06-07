
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Info } from 'lucide-react';
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
          <span>{formatDate(campaign.expires_at)}</span>
        </div>
        
        {campaign.min_purchase && (
          <div className="flex justify-between">
            <span className="text-gray-400">Compra mínima:</span>
            <span>R$ {campaign.min_purchase.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span className="text-gray-400">Seu saldo:</span>
          <span className="font-bold">R$ {userCashback.toFixed(2)}</span>
        </div>
      </div>

      {campaign.conditions && (
        <>
          <Separator className="bg-galaxy-purple/30" />
          <div className="space-y-1">
            <h4 className="text-sm font-medium flex items-center">
              <Info className="h-4 w-4 mr-1 text-neon-pink" />
              Condições
            </h4>
            <p className="text-xs text-gray-400">{campaign.conditions}</p>
          </div>
        </>
      )}
    </div>
  );

export default CampaignDialogDetails;
