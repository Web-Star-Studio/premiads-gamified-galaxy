import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface CampaignContentProps {
  description: string | null;
  endDate: string;
  formatDate: (dateString: string) => string;
}

const CampaignContent: React.FC<CampaignContentProps> = ({
  description,
  endDate,
  formatDate
}) => (
    <CardContent className="pb-2">
      <p className="text-sm line-clamp-2 text-gray-300 min-h-[40px]">
        {description}
      </p>
      
      <div className="mt-3 text-xs">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3 text-neon-pink" />
          <span>Até: {formatDate(endDate)}</span>
        </div>
      </div>
    </CardContent>
  );

export default CampaignContent;
