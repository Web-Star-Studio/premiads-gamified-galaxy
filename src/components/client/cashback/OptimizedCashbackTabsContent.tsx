
import React, { useMemo, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CashbackCampaign } from '@/types/cashback';
import CashbackCampaignCard from './CashbackCampaignCard';
import { CampaignCardSkeleton } from './campaign-card';

interface OptimizedCashbackTabsContentProps {
  currentTab: string;
  setCurrentTab: (value: string) => void;
  filteredCampaigns: CashbackCampaign[];
  userCashback: number;
  onRedeem: (campaignId: string, amount: number) => Promise<any>;
  clearFilters: () => void;
  searchTerm: string;
  selectedCategory: string;
  discountRange: [number, number];
  isLoading?: boolean;
}

// Memoized campaign card wrapper
const MemoizedCampaignCard = React.memo<{
  campaign: CashbackCampaign;
  userCashback: number;
  onRedeem: (campaignId: string, amount: number) => Promise<any>;
}>(({ campaign, userCashback, onRedeem }) => (
  <CashbackCampaignCard
    campaign={campaign}
    userCashback={userCashback}
    onRedeem={onRedeem}
  />
));

MemoizedCampaignCard.displayName = 'MemoizedCampaignCard';

// Memoized skeleton loader
const SkeletonGrid = React.memo(() => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: 8 }).map((_, index) => (
      <CampaignCardSkeleton key={index} />
    ))}
  </div>
));

SkeletonGrid.displayName = 'SkeletonGrid';

// Memoized empty state
const EmptyState = React.memo<{
  searchTerm: string;
  selectedCategory: string;
  discountRange: [number, number];
  clearFilters: () => void;
}>(({ searchTerm, selectedCategory, discountRange, clearFilters }) => {
  const hasFilters = useMemo(() => 
    searchTerm || selectedCategory || discountRange[0] > 0 || discountRange[1] < 100,
    [searchTerm, selectedCategory, discountRange]
  );

  return (
    <div className="text-center py-20">
      <ShoppingCart className="mx-auto w-20 h-20 text-gray-500 mb-4" />
      <h3 className="text-xl font-semibold mb-2">Nenhum cupom encontrado</h3>
      <p className="text-gray-400 max-w-md mx-auto mb-6">
        {hasFilters ? 
          "Tente ajustar seus filtros ou buscar por termos diferentes." : 
          "Não há cupons de cashback disponíveis no momento. Volte mais tarde para novas ofertas."}
      </p>
      {hasFilters && (
        <Button variant="outline" onClick={clearFilters}>
          Limpar Filtros
        </Button>
      )}
    </div>
  );
});

EmptyState.displayName = 'EmptyState';

const OptimizedCashbackTabsContent = React.memo<OptimizedCashbackTabsContentProps>(({
  currentTab,
  setCurrentTab,
  filteredCampaigns,
  userCashback,
  onRedeem,
  clearFilters,
  searchTerm,
  selectedCategory,
  discountRange,
  isLoading = false
}) => {
  // Memoize tab change handler
  const handleTabChange = useCallback((value: string) => {
    setCurrentTab(value);
  }, [setCurrentTab]);

  // Memoize campaign grid
  const campaignGrid = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredCampaigns.map((campaign) => (
        <MemoizedCampaignCard
          key={campaign.id}
          campaign={campaign}
          userCashback={userCashback}
          onRedeem={onRedeem}
        />
      ))}
    </div>
  ), [filteredCampaigns, userCashback, onRedeem]);

  return (
    <Tabs 
      defaultValue="all" 
      value={currentTab} 
      onValueChange={handleTabChange}
      className="mt-8"
    >
      <TabsList className="bg-galaxy-deepPurple/50 border border-galaxy-purple/30 p-1">
        <TabsTrigger 
          value="all"
          className="data-[state=active]:bg-neon-cyan data-[state=active]:text-galaxy-dark"
        >
          Todos os Cupons
        </TabsTrigger>
        <TabsTrigger 
          value="featured"
          className="data-[state=active]:bg-neon-cyan data-[state=active]:text-galaxy-dark"
        >
          Destaques
        </TabsTrigger>
      </TabsList>

      <div className="mt-6">
        {isLoading ? (
          <SkeletonGrid />
        ) : filteredCampaigns.length > 0 ? (
          campaignGrid
        ) : (
          <EmptyState
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            discountRange={discountRange}
            clearFilters={clearFilters}
          />
        )}
      </div>
    </Tabs>
  );
});

OptimizedCashbackTabsContent.displayName = 'OptimizedCashbackTabsContent';

export default OptimizedCashbackTabsContent;
