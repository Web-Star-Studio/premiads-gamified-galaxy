import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, MapPin, Calendar, Star, Heart, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import ClientSidebar from "@/components/client/dashboard/ClientSidebar";
import ClientHeader from "@/components/client/ClientHeader";
import ClientDashboardHeader from "@/components/client/ClientDashboardHeader";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { supabase } from "@/integrations/supabase/client";
import { useMediaQuery } from "@/hooks/use-mobile";

interface CashbackCampaign {
  id: string;
  title: string;
  description: string;
  cashback_percentage: number;
  min_purchase: number;
  advertiser_name: string;
  advertiser_logo?: string;
  category: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

const CashbackMarketplace = () => {
  const [campaigns, setCampaigns] = useState<CashbackCampaign[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const { userName } = useUser();
  const { toast } = useToast();
  const { playSound } = useSounds();
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("cashback_campaigns")
        .select("*")
        .eq("is_active", true);

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error: any) {
      console.error("Error fetching cashback campaigns:", error);
      toast({
        title: "Erro ao carregar campanhas",
        description: "Não foi possível carregar as campanhas de cashback",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || campaign.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCampaignClick = (campaign: CashbackCampaign) => {
    playSound("pop");
    toast({
      title: `Cashback de ${campaign.cashback_percentage}%`,
      description: `Compre a partir de R$ ${campaign.min_purchase} e ganhe ${campaign.cashback_percentage}% de volta!`,
    });
  };

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <ClientSidebar />
        <SidebarInset className="overflow-y-auto pb-20">
          <ClientHeader />
          
          <div className="container px-4 py-8 mx-auto">
            <ClientDashboardHeader 
              title="Cashback" 
              description="Aproveite as melhores ofertas e ganhe dinheiro de volta nas suas compras!" 
              userName={userName} 
            />
            
            <div className="mt-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Input
                    type="search"
                    placeholder="Buscar ofertas..."
                    className="bg-galaxy-deepPurple/50 border-galaxy-purple/30"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button variant="outline" className="bg-galaxy-deepPurple/50 border-galaxy-purple/30">
                    <Search className="w-4 h-4 mr-2" />
                    Buscar
                  </Button>
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-galaxy-deepPurple/50 border-galaxy-purple/30">
                    <Filter className="w-4 h-4 mr-2" />
                    <span className="hidden md:inline">Filtrar por Categoria</span>
                  </SelectTrigger>
                  <SelectContent className="bg-galaxy-darkPurple border-galaxy-purple">
                    <SelectItem value="all">Todas as Categorias</SelectItem>
                    <SelectItem value="Alimentos">Alimentos</SelectItem>
                    <SelectItem value="Vestuário">Vestuário</SelectItem>
                    <SelectItem value="Eletrônicos">Eletrônicos</SelectItem>
                    <SelectItem value="Serviços">Serviços</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="w-10 h-10 border-4 border-t-neon-cyan border-galaxy-purple rounded-full animate-spin"></div>
                </div>
              ) : filteredCampaigns.length === 0 ? (
                <div className="flex items-center justify-center h-40 text-center">
                  <p className="text-gray-400">Nenhuma oferta encontrada.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCampaigns.map(campaign => (
                    <motion.div
                      key={campaign.id}
                      className="transition-transform duration-300 hover:scale-105 cursor-pointer"
                      onClick={() => handleCampaignClick(campaign)}
                      whileHover={{ y: -5 }}
                    >
                      <Card className="bg-galaxy-deepPurple/60 border-galaxy-purple/30">
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            {campaign.title}
                            <Badge variant="secondary" className="bg-neon-pink/20 text-neon-pink border-none">
                              {campaign.cashback_percentage}%
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p className="text-sm text-gray-400">{campaign.description}</p>
                          <div className="flex items-center gap-2 text-gray-400 text-xs">
                            <MapPin className="w-4 h-4" />
                            {campaign.advertiser_name}
                          </div>
                          <div className="flex items-center gap-2 text-gray-400 text-xs">
                            <Calendar className="w-4 h-4" />
                            {new Date(campaign.start_date).toLocaleDateString()} - {new Date(campaign.end_date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center justify-between">
                            <Button variant="link" className="text-sm">
                              Ver Detalhes
                            </Button>
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-400" />
                              <Heart className="w-4 h-4 text-red-500" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default CashbackMarketplace;
