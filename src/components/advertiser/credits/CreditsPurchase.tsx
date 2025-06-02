import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CreditCard, Info, Sparkles, ArrowLeft, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useSounds } from "@/hooks/use-sounds";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CreditPackage, CreditPurchaseProps } from "./types";
import ConfirmationScreen from "./ConfirmationScreen";

// Componente de pacote de crédito
const CreditPackageCard = ({ 
  pack, 
  isSelected, 
  onSelect 
}: { 
  pack: CreditPackage; 
  isSelected: boolean; 
  onSelect: () => void; 
}) => {
  const bonusPercentage = pack.bonus > 0 ? Math.round((pack.bonus / pack.credits) * 100) : 0;
  
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
      className="h-full"
    >
      <Card 
        className={`relative cursor-pointer border-2 transition-all duration-200 p-4 h-full flex flex-col items-center justify-between ${
          isSelected 
            ? "border-neon-pink shadow-[0_0_15px_rgba(255,0,200,0.3)] bg-galaxy-deepPurple/40" 
            : "border-galaxy-purple/30 hover:border-neon-pink/50 bg-galaxy-deepPurple/20"
        }`}
      >
        {bonusPercentage > 0 && (
          <div className="absolute -top-3 -right-3 bg-neon-pink text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">
            +{bonusPercentage}% BÔNUS
          </div>
        )}
        
        {isSelected && (
          <div className="absolute top-2 left-2">
            <Sparkles className="w-4 h-4 text-neon-pink" />
          </div>
        )}
        
        <div className="text-center mb-3 mt-2">
          <div className="text-2xl font-bold">{pack.credits.toLocaleString()}</div>
          <div className="text-sm text-gray-400">rifas</div>
        </div>
        
        {pack.bonus > 0 && (
          <div className="bg-neon-pink/20 rounded-md px-3 py-1.5 mb-3 text-center flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-neon-pink" />
            <div className="text-sm font-medium text-neon-pink">+{pack.bonus.toLocaleString()} bônus</div>
          </div>
        )}
        
        <div className="text-center mt-auto w-full">
          <div className="text-lg font-bold">R$ {pack.price.toFixed(2).replace(".", ",")}</div>
          <div className="text-xs text-gray-400 mt-1">
            {(pack.credits + pack.bonus).toLocaleString()} rifas no total
          </div>
          <div className="text-xs text-gray-500 mt-1">
            R$ {(pack.price / (pack.credits + pack.bonus)).toFixed(3).replace(".", ",")} por rifa
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Componente de resumo
const CreditSummary = ({ selectedPackage }: { selectedPackage: CreditPackage }) => {
  const totalCredits = selectedPackage.credits + selectedPackage.bonus;
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-base font-medium">Resumo</span>
        <div className="text-right">
          <span className="text-lg font-bold text-neon-pink">R$ {selectedPackage.price.toFixed(2).replace(".", ",")}</span>
          <p className="text-xs text-gray-400">Valor total</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300 flex items-center">
            <CreditCard className="w-4 h-4 mr-2 text-purple-400" />
            Rifas base
          </span>
          <span className="font-medium">{selectedPackage.credits.toLocaleString()}</span>
        </div>

        {selectedPackage.bonus > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-neon-pink flex items-center">
              <Sparkles className="w-4 h-4 mr-2" />
              Bônus
            </span>
            <span className="font-medium text-neon-pink">+{selectedPackage.bonus.toLocaleString()}</span>
          </div>
        )}

        <div className="flex justify-between items-center pt-1 border-t border-gray-700">
          <span className="text-sm text-gray-300">Total de rifas</span>
          <span className="font-medium">{totalCredits.toLocaleString()}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-700">
        <div className="text-xs text-gray-400">
          As rifas serão adicionadas à sua conta imediatamente após a confirmação do pagamento.
        </div>
      </div>
    </div>
  );
};

// Componente de método de pagamento
const PaymentMethods = ({ onSelect, selected }: { onSelect: (method: string) => void; selected: string }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Escolha a forma de pagamento</h3>
      
      <Tabs defaultValue="mercado-pago" value={selected} onValueChange={onSelect} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mercado-pago">Mercado Pago</TabsTrigger>
          <TabsTrigger value="stripe">Stripe</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mercado-pago" className="mt-4">
          <div className="grid grid-cols-2 gap-3">
            <PaymentMethodCard
              title="Pix"
              description="Pagamento instantâneo"
              isSelected={selected === "mercado-pago"}
              onClick={() => onSelect("mercado-pago")}
              icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 3L14.7123 6.61871L18.5 7L15.5 9.61871L16.2123 13.5L13 11.5L9.78769 13.5L10.5 9.61871L7.5 7L11.2877 6.61871L13.5 3Z" fill="currentColor"/>
                <path d="M5 15L5.70615 17.4373L8.4 17.8L6.6 19.4373L7.05385 22L5 20.8L2.94615 22L3.4 19.4373L1.6 17.8L4.29385 17.4373L5 15Z" fill="currentColor"/>
                <path d="M19 15L19.7062 17.4373L22.4 17.8L20.6 19.4373L21.0538 22L19 20.8L16.9462 22L17.4 19.4373L15.6 17.8L18.2938 17.4373L19 15Z" fill="currentColor"/>
              </svg>}
            />
            <PaymentMethodCard
              title="Cartão de Crédito"
              description="Visa, Mastercard, etc."
              isSelected={false}
              onClick={() => {}}
              icon={<CreditCard className="w-5 h-5" />}
            />
            <PaymentMethodCard
              title="Boleto"
              description="Prazo de 3 dias úteis"
              isSelected={false}
              onClick={() => {}}
              icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6V18H21V6H3ZM5 8H19V16H5V8Z" fill="currentColor"/>
                <path d="M7 10V14H9V10H7Z" fill="currentColor"/>
                <path d="M11 10V14H13V10H11Z" fill="currentColor"/>
                <path d="M15 10V14H17V10H15Z" fill="currentColor"/>
              </svg>}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="stripe" className="mt-4">
          <div className="grid grid-cols-2 gap-3">
            <PaymentMethodCard
              title="Cartão de Crédito"
              description="Visa, Mastercard, etc."
              isSelected={selected === "stripe"}
              onClick={() => onSelect("stripe")}
              icon={<CreditCard className="w-5 h-5" />}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Componente de cartão de método de pagamento
const PaymentMethodCard = ({ 
  title, 
  description, 
  icon, 
  isSelected, 
  onClick 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
  isSelected: boolean; 
  onClick: () => void; 
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
    >
      <Card 
        className={`cursor-pointer border transition-all duration-200 ${
          isSelected 
            ? "border-neon-pink shadow-[0_0_10px_rgba(255,0,200,0.2)] bg-galaxy-deepPurple/40" 
            : "border-galaxy-purple/30 hover:border-neon-pink/50 bg-galaxy-deepPurple/20"
        }`}
      >
        <CardContent className="p-4 flex items-center gap-3">
          <div className={`p-2 rounded-full ${
            isSelected ? "bg-neon-pink/20 text-neon-pink" : "bg-galaxy-purple/20 text-galaxy-purple"
          }`}>
            {icon}
          </div>
          <div>
            <h4 className="font-medium">{title}</h4>
            <p className="text-xs text-gray-400">{description}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const CreditsPurchase = ({ currentCredits = 0 }: CreditPurchaseProps) => {
  const [useCustomAmount, setUseCustomAmount] = useState(false);
  const [customCredits, setCustomCredits] = useState(500);
  const [selectedPackageIndex, setSelectedPackageIndex] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("mercado-pago");
  const { playSound } = useSounds();
  const { toast } = useToast();
  
  // Definindo os pacotes de créditos sem duplicações
  const creditPackages: CreditPackage[] = [
    { value: 1, credits: 500, price: 50, bonus: 0 },
    { value: 2, credits: 1000, price: 100, bonus: 100 },
    { value: 3, credits: 2500, price: 250, bonus: 350 },
    { value: 4, credits: 5000, price: 500, bonus: 1000 },
    { value: 5, credits: 10000, price: 1000, bonus: 2500 },
  ];
  
  // Pacote selecionado atual
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage>(creditPackages[0]);
  
  // Atualiza o pacote selecionado quando o índice muda
  useEffect(() => {
    if (!useCustomAmount) {
      setSelectedPackage(creditPackages[selectedPackageIndex]);
    }
  }, [selectedPackageIndex, useCustomAmount]);
  
  // Atualiza o pacote personalizado quando o valor personalizado muda
  useEffect(() => {
    if (useCustomAmount) {
      // Calcula o preço baseado no valor por crédito do pacote menor
      const basePrice = (customCredits * 0.1);
      setSelectedPackage({
        value: 0,
        credits: customCredits,
        price: basePrice,
        bonus: 0
      });
    }
  }, [customCredits, useCustomAmount]);
  
  const handleSliderChange = (value: number[]) => {
    playSound("pop");
    setCustomCredits(value[0]);
  };
  
  const toggleCustomAmount = () => {
    playSound("pop");
    setUseCustomAmount(!useCustomAmount);
  };
  
  const handlePurchase = async () => {
    setProcessing(true);
    playSound("pop");
    
    try {
      // Simula processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setShowConfirmation(true);
      
      // Atualiza o saldo de créditos no banco de dados
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
      
      if (userId) {
        const totalCredits = selectedPackage.credits + selectedPackage.bonus;
        
        // Atualiza os créditos do usuário no banco de dados
        const { error } = await supabase
          .from("profiles")
          .update({
            credits: (currentCredits || 0) + totalCredits,
            updated_at: new Date().toISOString()
          })
          .eq("id", userId);
          
        if (error) throw error;
      }
      
      playSound("reward");
      
      // Resetar após 3 segundos
      setTimeout(() => {
        setShowConfirmation(false);
        toast({
          title: "Rifas adquiridas",
          description: `${selectedPackage.credits + selectedPackage.bonus} rifas foram adicionadas à sua conta.`,
        });
        
        // Recarrega a página para mostrar o saldo atualizado
        window.location.reload();
      }, 3000);
    } catch (error: any) {
      console.error("Erro ao comprar rifas:", error);
      toast({
        title: "Erro na compra",
        description: error.message || "Ocorreu um erro ao processar sua compra.",
        variant: "destructive",
      });
      setShowConfirmation(false);
    } finally {
      setProcessing(false);
    }
  };
  
  return (
    <Card className="border-neon-pink/20 shadow-[0_0_20px_rgba(255,0,200,0.1)]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-neon-pink" />
          Comprar Rifas
        </CardTitle>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 cursor-help">
                <CardDescription>
                  Rifas para criar e gerenciar campanhas
                </CardDescription>
                <Info className="w-3.5 h-3.5 text-gray-500" />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-galaxy-darkPurple border-galaxy-purple p-3 max-w-xs">
              <div className="space-y-1 text-xs">
                <p className="font-medium text-sm">Conversão de valores</p>
                <p>10 rifas = R$1,00</p>
                <p>Cada rifa vale R$0,10</p>
                <p className="text-gray-400 mt-1">Rifas são usadas para impulsionar campanhas, alcançar mais usuários e desbloquear recursos premium.</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent>
        {showConfirmation ? (
          <ConfirmationScreen selectedPackage={selectedPackage} />
        ) : (
          <div className="space-y-6">
            <Button 
              variant="outline" 
              onClick={toggleCustomAmount}
              className="w-full flex items-center justify-center gap-2 border-neon-pink/50 text-neon-pink hover:bg-neon-pink/10"
            >
              {useCustomAmount ? (
                <>
                  <ArrowLeft className="w-4 h-4" />
                  Ver pacotes predefinidos
                </>
              ) : (
                <>
                  Definir quantidade personalizada
                  <PlusCircle className="w-4 h-4" />
                </>
              )}
            </Button>
            
            {useCustomAmount ? (
              <div className="space-y-4">
                <h3 className="text-md font-medium">Quantidade personalizada</h3>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Input
                      type="number"
                      value={customCredits}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value >= 100) {
                          setCustomCredits(value);
                          playSound("pop");
                        }
                      }}
                      min={100}
                      step={100}
                      className="bg-galaxy-darkPurple border-galaxy-purple/50"
                    />
                  </div>
                  <span className="text-sm text-gray-400 whitespace-nowrap">rifas</span>
                </div>
                <div className="space-y-3">
                  <Slider
                    value={[customCredits]}
                    min={100}
                    max={10000}
                    step={100}
                    onValueChange={handleSliderChange}
                    className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5"
                    style={{
                      background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${(customCredits - 100) / 9900 * 100}%, rgba(124, 58, 237, 0.2) ${(customCredits - 100) / 9900 * 100}%, rgba(124, 58, 237, 0.2) 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>100</span>
                    <span>10.000</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Selecione um pacote:</span>
                  <span className="text-sm font-medium">{selectedPackage.credits.toLocaleString()} rifas</span>
                </div>
                
                <div className="px-1">
                  <Slider
                    value={[selectedPackageIndex + 1]}
                    min={1}
                    max={creditPackages.length}
                    step={1}
                    onValueChange={(value) => {
                      setSelectedPackageIndex(value[0] - 1);
                      playSound("pop");
                    }}
                    className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5"
                    style={{
                      background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${selectedPackageIndex / (creditPackages.length - 1) * 100}%, rgba(124, 58, 237, 0.2) ${selectedPackageIndex / (creditPackages.length - 1) * 100}%, rgba(124, 58, 237, 0.2) 100%)`
                    }}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {creditPackages.map((pack, index) => (
                    <CreditPackageCard
                      key={pack.value}
                      pack={pack}
                      isSelected={selectedPackageIndex === index}
                      onSelect={() => {
                        setSelectedPackageIndex(index);
                        playSound("pop");
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            
            <div className="bg-galaxy-deepPurple/30 border border-galaxy-purple/30 rounded-lg p-4">
              <CreditSummary selectedPackage={selectedPackage} />
            </div>
            
            <div className="bg-galaxy-deepPurple/30 border border-galaxy-purple/30 rounded-lg p-4">
              <PaymentMethods 
                selected={paymentMethod} 
                onSelect={(method) => {
                  setPaymentMethod(method);
                  playSound("pop");
                }} 
              />
            </div>
            
            <Button
              onClick={handlePurchase}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
              disabled={processing}
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                  Processando...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Confirmar Pagamento
                </>
              )}
            </Button>
            
            <div className="flex items-center justify-between border-t border-gray-700 pt-4 mt-4">
              <span className="text-sm text-gray-400">Saldo atual</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">{currentCredits.toLocaleString()} rifas</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CreditsPurchase;
