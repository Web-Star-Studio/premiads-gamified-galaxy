import React, { useState } from 'react';
import { useCashbackMarketplace } from '@/hooks/cashback';
import { useMediaQuery } from "@/hooks/use-mobile";
import { useUser } from '@/context/UserContext';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import ClientSidebar from "@/components/client/dashboard/ClientSidebar";
import ClientHeader from "@/components/client/ClientHeader";

// Import our new modular components
import CashbackHeader from '@/components/client/cashback/CashbackHeader';
import CashbackSearch from '@/components/client/cashback/CashbackSearch';
import CashbackFilters from '@/components/client/cashback/CashbackFilters';
import CashbackTabsContent from '@/components/client/cashback/CashbackTabsContent';
import CashbackHelpBanner from '@/components/client/cashback/CashbackHelpBanner';
import CashbackLoading from '@/components/client/cashback/CashbackLoading';

const CashbackMarketplace: React.FC = () => {
  const { campaigns, userCashback, loading, redeemCashback } = useCashbackMarketplace();
  const { userName } = useUser();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  const [discountRange, setDiscountRange] = useState<[number, number]>([0, 100]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Mock categories for the demo
  const categories = [
    "Restaurantes",
    "Varejo",
    "Tecnologia",
    "Saúde",
    "Beleza",
    "Serviços"
  ];

  // Filter campaigns based on search, tab, and filters
  const getFilteredCampaigns = () => {
    return campaigns.filter(campaign => {
      // Search filter
      const matchesSearch = 
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (campaign.description && campaign.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (campaign.advertiser_name && campaign.advertiser_name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Tab filter (featured or all)
      const matchesTab = 
        currentTab === 'all' || 
        (currentTab === 'featured' && campaign.discount_percentage >= 25);
      
      // Discount range filter
      const matchesDiscount = 
        campaign.discount_percentage >= discountRange[0] && 
        campaign.discount_percentage <= discountRange[1];
      
      // Category filter
      const matchesCategory = 
        !selectedCategory || 
        (campaign.advertiser_name && categories.indexOf(campaign.advertiser_name) % categories.length === categories.indexOf(selectedCategory) % categories.length);
      
      return matchesSearch && matchesTab && matchesDiscount && matchesCategory;
    });
  };

  const filteredCampaigns = getFilteredCampaigns();

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setCurrentTab('all');
    setDiscountRange([0, 100]);
    setSelectedCategory('');
  };

  if (loading) {
    return <CashbackLoading userName={userName} />;
  }

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <ClientSidebar />
        <SidebarInset className="overflow-y-auto pb-20">
          <ClientHeader />
          
          <div className="container px-2 sm:px-4 pt-20 py-4 sm:py-8 mx-auto">
            {/* Header with user cashback balance */}
            <CashbackHeader 
              userName={userName} 
              userCashback={userCashback} 
            />
            
            {/* Search and filters section */}
            <div className={`mt-6 flex flex-col sm:flex-row flex-wrap sm:justify-between items-center gap-2 sm:gap-4`}>
              <div className="w-full flex flex-col sm:flex-row gap-2 sm:gap-3">
                <CashbackSearch 
                  searchTerm={searchTerm} 
                  setSearchTerm={setSearchTerm} 
                />
                
                <CashbackFilters 
                  categories={categories}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  discountRange={discountRange}
                  setDiscountRange={setDiscountRange}
                  clearFilters={clearFilters}
                />
              </div>
            </div>

            {/* Campaign listings with tabs */}
            <CashbackTabsContent 
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              filteredCampaigns={filteredCampaigns}
              userCashback={userCashback}
              onRedeem={redeemCashback}
              clearFilters={clearFilters}
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              discountRange={discountRange}
              isLoading={loading}
            />

            {/* Help banner */}
            <CashbackHelpBanner />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default CashbackMarketplace;
