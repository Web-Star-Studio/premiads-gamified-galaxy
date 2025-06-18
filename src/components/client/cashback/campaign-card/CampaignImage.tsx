
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { defaultImage } from './utils';

interface CampaignImageProps {
  image?: string | null;
  discountPercentage: number;
}

const CampaignImage: React.FC<CampaignImageProps> = ({ image, discountPercentage }) => (
    <div 
      className="relative card-image transition-transform duration-500 hover:scale-105"
      style={{
        backgroundImage: `url(${image || defaultImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay para melhor contraste */}
      <div className="absolute inset-0 bg-gradient-to-br from-galaxy-dark/20 via-transparent to-galaxy-dark/40" />
      
      <div className="absolute top-3 right-3 z-10">
        <Badge className="bg-neon-cyan text-galaxy-dark font-bold text-sm px-3 py-1 shadow-lg">
          {discountPercentage}% CASHBACK
        </Badge>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-galaxy-dark to-transparent z-10" />
    </div>
  );

export default CampaignImage;
