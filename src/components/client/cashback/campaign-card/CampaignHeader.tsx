
import React from 'react';
import { CardTitle, CardDescription, CardHeader } from '@/components/ui/card';

interface CampaignHeaderProps {
  title: string;
  advertiserName: string;
  advertiserLogo: string;
}

const CampaignHeader: React.FC<CampaignHeaderProps> = ({ 
  title, 
  advertiserName, 
  advertiserLogo 
}) => {
  return (
    <CardHeader className="pb-2">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full overflow-hidden bg-galaxy-deepPurple/50 flex items-center justify-center">
          <img 
            src={advertiserLogo} 
            alt="Logo" 
            className="h-8 w-8 object-contain"
          />
        </div>
        <div>
          <CardTitle className="text-lg line-clamp-1">{title}</CardTitle>
          <CardDescription className="text-xs">
            {advertiserName || "Anunciante Parceiro"}
          </CardDescription>
        </div>
      </div>
    </CardHeader>
  );
};

export default CampaignHeader;
