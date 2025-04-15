
import React, { useState } from 'react';
import { useCashbackMarketplace } from '@/hooks/useCashbackMarketplace';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wallet, 
  Search, 
  ShoppingCart, 
  SlidersHorizontal,
  Tag,
  X,
  ChevronLeft,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ClientDashboardHeader from '@/components/client/ClientDashboardHeader';
import { useUser } from '@/context/UserContext';
import CashbackCampaignCard from '@/components/client/cashback/CashbackCampaignCard';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CashbackCampaign } from '@/types/cashback';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from '@/components/ui/slider';

const CashbackMarketplace: React.FC = () => {
  const { campaigns, userCashback, loading, redeemCashback } = useCashbackMarketplace();
  const navigate = useNavigate();
  const { userName } = useUser();
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
    return (
      <div className="container mx-auto px-4 py-8">
        <ClientDashboardHeader 
          title="Marketplace de Cashback" 
          userName={userName} 
          showBackButton
          backTo="/cliente"
        />
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-700 rounded-full mb-4"></div>
            <div className="h-6 w-32 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 w-48 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ClientDashboardHeader 
        title="Marketplace de Cashback" 
        userName={userName} 
        showBackButton
        backTo="/cliente"
      />
      
      <div className="mt-6 flex flex-wrap justify-between items-center gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center bg-galaxy-deepPurple/50 px-4 py-3 rounded-lg border border-galaxy-purple/30"
        >
          <Wallet className="w-8 h-8 text-neon-lime mr-3" />
          <div>
            <p className="text-sm text-gray-400">Saldo Disponível</p>
            <p className="text-2xl font-semibold">
              R$ {userCashback.toFixed(2)}
            </p>
          </div>
        </motion.div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar cupons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-galaxy-deepPurple/50 border-galaxy-purple/30"
            />
            {searchTerm && (
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="border-galaxy-purple/30">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="glass-panel">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
                <SheetDescription>
                  Filtre os cupons de cashback por diferentes critérios
                </SheetDescription>
              </SheetHeader>
              
              <div className="py-6 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Categoria</h3>
                  <Select 
                    value={selectedCategory} 
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="bg-galaxy-deepPurple/50 border-galaxy-purple/30">
                      <SelectValue placeholder="Todas as categorias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas as categorias</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Valor do Desconto (%)</h3>
                    <span className="text-sm text-gray-400">
                      {discountRange[0]} - {discountRange[1]}%
                    </span>
                  </div>
                  <Slider
                    defaultValue={[0, 100]}
                    value={discountRange}
                    onValueChange={(value) => setDiscountRange(value as [number, number])}
                    min={0}
                    max={100}
                    step={5}
                    className="my-4"
                  />
                </div>
              </div>
              
              <SheetFooter className="flex flex-col sm:flex-row gap-2">
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="w-full"
                >
                  Limpar Filtros
                </Button>
                <SheetClose asChild>
                  <Button className="w-full">Aplicar Filtros</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <Tabs 
        defaultValue="all" 
        value={currentTab} 
        onValueChange={setCurrentTab}
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
          {filteredCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCampaigns.map((campaign) => (
                <CashbackCampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  userCashback={userCashback}
                  onRedeem={redeemCashback}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <ShoppingCart className="mx-auto w-20 h-20 text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhum cupom encontrado</h3>
              <p className="text-gray-400 max-w-md mx-auto mb-6">
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

      {/* Help banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12 p-4 sm:p-6 rounded-lg border border-galaxy-purple/30 bg-galaxy-deepPurple/30"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-3 rounded-full bg-neon-pink/10">
            <Info className="h-6 w-6 text-neon-pink" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium mb-1">Como funciona o resgate de cashback?</h3>
            <p className="text-gray-400">Escolha um cupom, resgate seu cashback e receba um código promocional para usar na loja do anunciante.</p>
          </div>
          <Button 
            variant="outline" 
            className="whitespace-nowrap mt-3 sm:mt-0"
            onClick={() => navigate("/faq")}
          >
            Saiba Mais
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default CashbackMarketplace;
