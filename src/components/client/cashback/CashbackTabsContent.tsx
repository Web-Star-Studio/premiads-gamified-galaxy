
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CashbackCampaign } from '@/types/cashback';
import CashbackCampaignCard from './CashbackCampaignCard';
import { CampaignCardSkeleton } from './campaign-card';

interface CashbackTabsContentProps {
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

const CashbackTabsContent: React.FC<CashbackTabsContentProps> = ({
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
  return (
    <Tabs 
      defaultValue="all" 
      value={currentTab} 
      onValueChange={setCurrentTab}
      className="mt-8"
    >
      <TabsList className="bg-galaxy-deepPurple/50 border border-galaxy-purple/30 p-1 flex flex-row w-full max-w-[350px] mx-auto sm:mx-0">
        <TabsTrigger 
          value="all"
          className="data-[state=active]:bg-neon-cyan data-[state=active]:text-galaxy-dark flex-1"
        >
          Todos os Cupons
        </TabsTrigger>
        <TabsTrigger 
          value="featured"
          className="data-[state=active]:bg-neon-cyan data-[state=active]:text-galaxy-dark flex-1"
        >
          Destaques
        </TabsTrigger>
      </TabsList>

      <div className="mt-6">
        {isLoading ? (
          // Display skeleton cards while loading
          <div className="
            grid 
            grid-cols-1 
            xs:grid-cols-2 
            sm:grid-cols-2 
            md:grid-cols-3 
            lg:grid-cols-4 
            gap-4 sm:gap-6
          ">
            {Array.from({ length: 8 }).map((_, index) => (
              <CampaignCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredCampaigns.length > 0 ? (
          <div className="
            grid 
            grid-cols-1 
            xs:grid-cols-2 
            sm:grid-cols-2 
            md:grid-cols-3 
            lg:grid-cols-4 
            gap-4 sm:gap-6
          ">
            {filteredCampaigns.map((campaign) => (
              <CashbackCampaignCard
                key={campaign.id}
                campaign={campaign}
                userCashback={userCashback}
                onRedeem={onRedeem}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <ShoppingCart className="mx-auto w-14 h-14 sm:w-20 sm:h-20 text-gray-500 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Nenhum cupom encontrado</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6 text-sm sm:text-base">
              {searchTerm || selectedCategory || discountRange[0] > 0 || discountRange[1] < 100 ? 
                "Tente ajustar seus filtros ou buscar por termos diferentes." : 
                "Não há cupons de cashback disponíveis no momento. Volte mais tarde para novas ofertas."}
            </p>
            {(searchTerm || selectedCategory || discountRange[0] > 0 || discountRange[1] < 100) && (
              <Button variant="outline" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            )}
          </div>
        )}
      </div>
    </Tabs>
  );
};

export default CashbackTabsContent;

