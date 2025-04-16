
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { CashbackCampaign } from '@/types/cashback';
import {
  CampaignImage,
  CampaignHeader,
  CampaignContent,
  CampaignFooter,
  RedemptionDialog,
  formatDate,
  getImage,
  defaultLogo
} from './campaign-card';
import CampaignCardSkeleton from './campaign-card/CampaignCardSkeleton';

interface CashbackCampaignCardProps {
  campaign: CashbackCampaign;
  userCashback: number;
  onRedeem: (campaignId: string, amount: number) => Promise<any>;
  isLoading?: boolean;
}

export const CashbackCampaignCard: React.FC<CashbackCampaignCardProps> = ({ 
  campaign, 
  userCashback,
  onRedeem,
  isLoading = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  
  const handleRedeem = async () => {
    setIsRedeeming(true);
    try {
      await onRedeem(campaign.id, userCashback);
      setIsOpen(false);
    } finally {
      setIsRedeeming(false);
    }
  };

  // If loading, show the skeleton
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <CampaignCardSkeleton />
      </motion.div>
    );
  }

  const imageUrl = getImage(campaign.id, campaign.advertiser_image);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
      >
        <Card className="h-full overflow-hidden glass-panel-hover border-neon-cyan/20 hover:shadow-[0_0_15px_rgba(0,255,231,0.2)]">
          <CampaignImage
            image={imageUrl}
            discountPercentage={campaign.discount_percentage}
          />
          
          <CampaignHeader
            title={campaign.title}
            advertiserName={campaign.advertiser_name || "Anunciante Parceiro"}
            advertiserLogo={campaign.advertiser_logo || defaultLogo}
          />
          
          <CampaignContent
            description={campaign.description}
            endDate={campaign.end_date}
            minimumPurchase={campaign.minimum_purchase}
            formatDate={formatDate}
          />
          
          <CampaignFooter onClick={() => setIsOpen(true)} />
        </Card>
      </motion.div>

      <RedemptionDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isRedeeming={isRedeeming}
        campaign={campaign}
        userCashback={userCashback}
        formatDate={formatDate}
        onRedeem={handleRedeem}
      />
    </>
  );
};

export default CashbackCampaignCard;
