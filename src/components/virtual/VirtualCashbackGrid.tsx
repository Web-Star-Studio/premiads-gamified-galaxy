import React, { useMemo } from 'react';
import { useVirtualScrolling } from '@/utils/performance';
import { CashbackCampaign } from '@/types/cashback';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Calendar } from 'lucide-react';

interface VirtualCashbackGridProps {
  campaigns: CashbackCampaign[];
  onRedeem: (campaignId: string, amount: number) => Promise<any>;
  containerHeight?: number;
  itemHeight?: number;
}

const ITEM_HEIGHT = 200;
const CONTAINER_HEIGHT = 600;

const VirtualCashbackGrid = React.memo<VirtualCashbackGridProps>(({
  campaigns,
  onRedeem,
  containerHeight = CONTAINER_HEIGHT,
  itemHeight = ITEM_HEIGHT
}) => {
  const {
    items: visibleCampaigns,
    startIndex,
    totalHeight,
    offsetY,
    onScroll
  } = useVirtualScrolling(campaigns, itemHeight, containerHeight);

  const campaignCards = useMemo(() => 
    visibleCampaigns.map((campaign) => (
      <div
        key={campaign.id}
        className="bg-galaxy-deepPurple/40 p-4 rounded-lg border border-galaxy-purple/20"
        style={{ height: itemHeight - 16, marginBottom: 16 }}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-sm line-clamp-2">{campaign.title}</h3>
              <Badge variant="secondary" className="text-xs">
                {campaign.cashback_percentage}% OFF
              </Badge>
            </div>
            
            {campaign.description && (
              <p className="text-xs text-gray-400 line-clamp-2 mb-2">
                {campaign.description}
              </p>
            )}
            
            <div className="flex items-center text-xs text-gray-500 mb-3">
              <Calendar className="w-3 h-3 mr-1" />
              <span>Até {new Date(campaign.end_date).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
          
          <Button
            size="sm"
            className="w-full bg-neon-cyan text-galaxy-dark hover:bg-neon-cyan/90"
            onClick={() => onRedeem(campaign.id, 0)}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Resgatar
          </Button>
        </div>
      </div>
    )),
    [visibleCampaigns, itemHeight, onRedeem]
  );

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-8">
        <ShoppingCart className="mx-auto w-16 h-16 text-gray-500 mb-4" />
        <p className="text-gray-400">Nenhum cupom disponível</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-heading">Cupons Disponíveis ({campaigns.length})</h3>
      </div>
      
      <div 
        className="relative overflow-auto"
        style={{ height: containerHeight }}
        onScroll={onScroll}
      >
        <div style={{ height: totalHeight }}>
          <div 
            style={{ transform: `translateY(${offsetY}px)` }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {campaignCards}
          </div>
        </div>
      </div>
    </div>
  );
});

VirtualCashbackGrid.displayName = 'VirtualCashbackGrid';

export default VirtualCashbackGrid;
