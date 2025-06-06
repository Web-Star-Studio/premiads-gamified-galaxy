
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { defaultImage } from './utils';

interface CampaignImageProps {
  image?: string | null;
  discountPercentage: number;
}

const CampaignImage: React.FC<CampaignImageProps> = ({ image, discountPercentage }) => (
    <div className="relative card-image">
      <img 
        src={image || defaultImage} 
        alt="Campaign" 
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
      />
      <div className="absolute top-3 right-3">
        <Badge className="bg-neon-cyan text-galaxy-dark font-bold text-sm px-3 py-1">
          {discountPercentage}% CASHBACK
        </Badge>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-galaxy-dark to-transparent" />
    </div>
  );

export default CampaignImage;
