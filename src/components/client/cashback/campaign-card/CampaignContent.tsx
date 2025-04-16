
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Calendar, ShoppingBag } from 'lucide-react';

interface CampaignContentProps {
  description: string | null;
  endDate: string;
  minimumPurchase: number | null;
  formatDate: (dateString: string) => string;
}

const CampaignContent: React.FC<CampaignContentProps> = ({
  description,
  endDate,
  minimumPurchase,
  formatDate
}) => {
  return (
    <CardContent className="pb-2">
      <p className="text-sm line-clamp-2 text-gray-300 min-h-[40px]">
        {description}
      </p>
      
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3 text-neon-pink" />
          <span>Até: {formatDate(endDate)}</span>
        </div>
        
        {minimumPurchase && (
          <div className="flex items-center gap-1">
            <ShoppingBag className="h-3 w-3 text-neon-pink" />
            <span>Min: R$ {minimumPurchase.toFixed(2)}</span>
          </div>
        )}
      </div>
    </CardContent>
  );
};

export default CampaignContent;
