
import React from 'react';
import { CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';

interface CampaignFooterProps {
  onClick: () => void;
}

const CampaignFooter: React.FC<CampaignFooterProps> = ({ onClick }) => {
  return (
    <CardFooter>
      <Button 
        className="w-full bg-gradient-to-r from-neon-cyan to-neon-pink text-galaxy-dark font-medium hover:opacity-90 transition-opacity"
        onClick={onClick}
      >
        <CreditCard className="w-4 h-4 mr-2" />
        Resgatar Cashback
      </Button>
    </CardFooter>
  );
};

export default CampaignFooter;
