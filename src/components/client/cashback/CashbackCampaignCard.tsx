
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter,
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Percent, 
  Tag, 
  Calendar, 
  ShoppingBag, 
  Info, 
  CreditCard,
  ExternalLink
} from 'lucide-react';
import { CashbackCampaign } from '@/types/cashback';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from '@/components/ui/separator';

interface CashbackCampaignCardProps {
  campaign: CashbackCampaign;
  userCashback: number;
  onRedeem: (campaignId: string, amount: number) => Promise<any>;
}

export const CashbackCampaignCard: React.FC<CashbackCampaignCardProps> = ({ 
  campaign, 
  userCashback,
  onRedeem 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  
  const handleRedeem = async () => {
    setIsRedeeming(true);
    try {
      await onRedeem(campaign.id, userCashback);
      setIsOpen(false);
    } finally {
      setIsRedeeming(false);
    }
  };

  // Format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Default logo and image for campaigns without them
  const defaultLogo = "https://via.placeholder.com/80x80?text=Logo";
  const defaultImage = "https://via.placeholder.com/500x200?text=Cashback+Offer";

  // Random placeholder images for demo purposes
  const placeholderImages = [
    "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=500&h=200&fit=crop&q=80",
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=500&h=200&fit=crop&q=80",
    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&h=200&fit=crop&q=80",
    "https://images.unsplash.com/photo-1572584642822-6f8de0243c93?w=500&h=200&fit=crop&q=80"
  ];

  // Get a deterministic image based on campaign id
  const getImage = () => {
    const index = campaign.id.charCodeAt(0) % placeholderImages.length;
    return campaign.advertiser_image || placeholderImages[index];
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
      >
        <Card className="h-full overflow-hidden glass-panel-hover border-neon-cyan/20 hover:shadow-[0_0_15px_rgba(0,255,231,0.2)]">
          <div className="relative h-48 overflow-hidden">
            <img 
              src={getImage()} 
              alt={campaign.title} 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
            <div className="absolute top-3 right-3">
              <Badge className="bg-neon-cyan text-galaxy-dark font-bold text-sm px-3 py-1">
                {campaign.discount_percentage}% OFF
              </Badge>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-galaxy-dark to-transparent" />
          </div>
          
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full overflow-hidden bg-galaxy-deepPurple/50 flex items-center justify-center">
                <img 
                  src={campaign.advertiser_logo || defaultLogo} 
                  alt="Logo" 
                  className="h-8 w-8 object-contain"
                />
              </div>
              <div>
                <CardTitle className="text-lg line-clamp-1">{campaign.title}</CardTitle>
                <CardDescription className="text-xs">
                  {campaign.advertiser_name || "Anunciante Parceiro"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pb-2">
            <p className="text-sm line-clamp-2 text-gray-300 min-h-[40px]">
              {campaign.description}
            </p>
            
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-neon-pink" />
                <span>Até: {formatDate(campaign.end_date)}</span>
              </div>
              
              {campaign.minimum_purchase && (
                <div className="flex items-center gap-1">
                  <ShoppingBag className="h-3 w-3 text-neon-pink" />
                  <span>Min: R$ {campaign.minimum_purchase.toFixed(2)}</span>
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              className="w-full bg-gradient-to-r from-neon-cyan to-neon-pink text-galaxy-dark font-medium hover:opacity-90 transition-opacity"
              onClick={() => setIsOpen(true)}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Resgatar Cashback
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="glass-panel border-neon-cyan/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Confirmar Resgate</DialogTitle>
            <DialogDescription>
              Confirme os detalhes do resgate de cashback
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full overflow-hidden bg-galaxy-deepPurple/50 flex items-center justify-center">
                <img 
                  src={campaign.advertiser_logo || defaultLogo} 
                  alt="Logo" 
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div>
                <h3 className="font-semibold">{campaign.title}</h3>
                <p className="text-sm text-gray-400">{campaign.advertiser_name || "Anunciante Parceiro"}</p>
              </div>
            </div>

            <Separator className="bg-galaxy-purple/30" />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Desconto:</span>
                <span className="font-semibold text-neon-cyan">{campaign.discount_percentage}%</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Validade:</span>
                <span>{formatDate(campaign.end_date)}</span>
              </div>
              
              {campaign.minimum_purchase && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Compra mínima:</span>
                  <span>R$ {campaign.minimum_purchase.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-400">Seu saldo:</span>
                <span className="font-bold">R$ {userCashback.toFixed(2)}</span>
              </div>
            </div>

            {campaign.conditions && (
              <>
                <Separator className="bg-galaxy-purple/30" />
                <div className="space-y-1">
                  <h4 className="text-sm font-medium flex items-center">
                    <Info className="h-4 w-4 mr-1 text-neon-pink" />
                    Condições
                  </h4>
                  <p className="text-xs text-gray-400">{campaign.conditions}</p>
                </div>
              </>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              className="w-full sm:w-auto"
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              className="w-full sm:w-auto bg-gradient-to-r from-neon-cyan to-neon-pink text-galaxy-dark font-medium"
              onClick={handleRedeem}
              disabled={isRedeeming || userCashback === 0}
            >
              {isRedeeming ? (
                <>Processando...</>
              ) : (
                <>Confirmar Resgate</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CashbackCampaignCard;
