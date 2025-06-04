import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info, PlusCircle, CreditCard, Zap } from "lucide-react";
import { 
  CreditPackageCard, 
  CreditSlider, 
  CreditSummary, 
  PaymentMethodSelector, 
  PaymentModal 
} from "./index";
import useCreditPurchase from "./useCreditPurchase.hook";
import { useAuthSession } from "@/hooks/useAuthSession";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const CreditsPurchasePage = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  const { userName = "Desenvolvedor" } = useUser();
  const {
    packages,
    selectedPackage,
    setSelectedPackage,
    paymentMethod,
    setPaymentMethod,
    handlePayment,
    isLoading: isPurchasing,
    paymentError,
    resetState,
  } = useCreditPurchase();
  const { user: authUser } = useAuthSession();

  const [customCredits, setCustomCredits] = useState<number>(500);
  const [useCustomAmount, setUseCustomAmount] = useState(false);

  // Find custom package when user inputs custom amount
  useEffect(() => {
    if (useCustomAmount && packages.length > 0) {
      // Find the best package based on value/credit ratio
      const bestPackage = [...packages].sort((a, b) => {
        const aRatio = a.price / (a.base + a.bonus);
        const bRatio = b.price / (b.base + b.bonus);
        return aRatio - bRatio;
      })[0];
      
      // Calculate price based on the best package rate
      const pricePerCredit = bestPackage.price / (bestPackage.base + bestPackage.bonus);
      const customPrice = Math.round(customCredits * pricePerCredit);
      
      // Create custom package
      const customPackage = {
        ...bestPackage,
        id: 'custom',
        base: customCredits,
        bonus: 0,
        price: customPrice,
        credit: customCredits
      };
      
      setSelectedPackage(customPackage);
    }
  }, [useCustomAmount, customCredits, packages]);

  const handleClose = () => {
    navigate("/anunciante");
    resetState();
  };

  const handleCustomCreditsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 100) {
      setCustomCredits(value);
    }
  };

  const toggleCustomAmount = () => {
    setUseCustomAmount(!useCustomAmount);
    if (!useCustomAmount) {
      setCustomCredits(500);
    } else if (packages.length > 0) {
      setSelectedPackage(packages[0]);
    }
  };

  const handlePurchaseClick = () => {
    if (selectedPackage && authUser) {
      // Use the method from useCreditPurchase hook
      handlePayment('stripe', 'credit_card');
    }
  };

  return (
    <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
      <div className="flex flex-col w-full">
        <div className="container px-4 py-8 mx-auto">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="mr-2 text-muted-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Comprar Rifas</h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Escolha um pacote</h2>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 text-sm text-gray-400 cursor-help">
                          <Info className="w-4 h-4" />
                          <span>Sobre as rifas</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-galaxy-darkPurple border-galaxy-purple p-3 max-w-xs">
                        <div className="space-y-1 text-xs">
                          <p className="font-medium text-sm">Conversão de valores</p>
                          <p>100 rifas = R$5,00</p>
                          <p>Cada rifa vale R$0,05</p>
                          <p className="text-gray-400 mt-1">Rifas são usadas para impulsionar campanhas, alcançar mais usuários e desbloquear recursos premium.</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <Button 
                  variant="outline" 
                  onClick={toggleCustomAmount}
                  className="w-full flex items-center justify-center gap-2 mb-4 border-neon-pink/50 text-neon-pink hover:bg-neon-pink/10"
                >
                  {useCustomAmount ? (
                    <>Ver pacotes predefinidos</>
                  ) : (
                    <>Definir quantidade personalizada<PlusCircle className="w-4 h-4 ml-2" /></>
                  )}
                </Button>

                {useCustomAmount ? (
                  <div className="p-4 border border-galaxy-purple/30 rounded-lg bg-galaxy-deepPurple/20 space-y-4">
                    <h3 className="text-md font-medium">Quantidade personalizada</h3>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <Input
                          type="number"
                          value={customCredits}
                          onChange={handleCustomCreditsChange}
                          min={100}
                          step={100}
                          className="bg-galaxy-darkPurple border-galaxy-purple/50 text-white"
                        />
                      </div>
                      <span className="text-sm text-gray-400 whitespace-nowrap">rifas</span>
                    </div>
                    <CreditSlider
                      min={100}
                      max={10000}
                      step={100}
                      value={customCredits}
                      onChange={(value) => setCustomCredits(value)}
                      packages={[]}
                    />
                  </div>
                ) : (
                  <>
                    <CreditSlider
                      min={100}
                      max={10000}
                      step={100}
                      value={selectedPackage ? selectedPackage.base + selectedPackage.bonus : 1000}
                      onChange={() => {}}
                      packages={packages}
                      selectedPackage={selectedPackage}
                      setSelectedPackage={setSelectedPackage}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      {packages.map((pack) => (
                        <CreditPackageCard
                          key={pack.id}
                          pkg={pack}
                          isSelected={selectedPackage?.id === pack.id}
                          onSelect={() => setSelectedPackage(pack)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-6">
                <h2 className="text-lg font-semibold flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-neon-pink" />
                  Resumo da compra
                </h2>
                
                <div className="bg-galaxy-deepPurple/30 border border-galaxy-purple/30 rounded-lg p-4">
                  <CreditSummary
                    selectedPackage={selectedPackage}
                    paymentMethod={paymentMethod}
                  />
                </div>
                
                <Separator className="my-2" />
                
                <div className="bg-galaxy-deepPurple/30 border border-galaxy-purple/30 rounded-lg p-4">
                  <PaymentMethodSelector
                    selectedProvider={paymentMethod === "stripe" ? "stripe" : "mercado_pago"}
                    selectedMethod={paymentMethod === "stripe" ? "credit_card" : "pix"}
                    onSelectProvider={(provider) => setPaymentMethod(provider === "stripe" ? "stripe" : "paypal")}
                    onSelectMethod={() => {}}
                  />
                </div>
                
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                  onClick={handlePurchaseClick}
                  disabled={!selectedPackage || isPurchasing}
                >
                  {isPurchasing ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                      Processando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Comprar Rifas
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CreditsPurchasePage;
