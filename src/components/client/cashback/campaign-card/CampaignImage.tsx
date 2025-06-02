
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface CampaignImageProps {
  image: string;
  discountPercentage: number;
}

const CampaignImage: React.FC<CampaignImageProps> = ({ image, discountPercentage }) => (
    <div className="relative h-48 overflow-hidden">
      <img 
        src={image} 
        alt="Campaign" 
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
      />
      <div className="absolute top-3 right-3">
        <Badge className="bg-neon-cyan text-galaxy-dark font-bold text-sm px-3 py-1">
          {discountPercentage}% OFF
        </Badge>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-galaxy-dark to-transparent" />
    </div>
  );

export default CampaignImage;
