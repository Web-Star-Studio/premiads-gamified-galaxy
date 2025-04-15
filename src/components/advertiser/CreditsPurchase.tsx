
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { CreditCard, Sparkles, Clock, Zap, CheckCircle } from "lucide-react";
import { useSounds } from "@/hooks/use-sounds";
import { useToast } from "@/hooks/use-toast";

const CreditsPurchase = () => {
  const [selectedAmount, setSelectedAmount] = useState<number[]>([2]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { playSound } = useSounds();
  const { toast } = useToast();
  
  const creditPackages = [
    { value: 1, credits: 500, price: 250, bonus: 0 },
    { value: 2, credits: 1000, price: 450, bonus: 100 },
    { value: 3, credits: 2500, price: 1000, bonus: 350 },
    { value: 4, credits: 5000, price: 1800, bonus: 1000 },
    { value: 5, credits: 10000, price: 3200, bonus: 2500 },
  ];
  
  const selectedPackage = creditPackages[selectedAmount[0] - 1];
  
  const handleSliderChange = (value: number[]) => {
    playSound("pop");
    setSelectedAmount(value);
  };
  
  const handlePurchase = () => {
    playSound("reward");
    setShowConfirmation(true);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setShowConfirmation(false);
      toast({
        title: "Créditos adquiridos",
        description: `${selectedPackage.credits + selectedPackage.bonus} créditos foram adicionados à sua conta.`,
      });
    }, 3000);
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  const getDiscountPercentage = (pkg: typeof selectedPackage) => {
    const standardRate = creditPackages[0].price / creditPackages[0].credits;
    const packageRate = pkg.price / (pkg.credits + pkg.bonus);
    const discount = ((standardRate - packageRate) / standardRate) * 100;
    return Math.round(discount);
  };
  
  return (
    <Card className="border-neon-pink/20 shadow-[0_0_20px_rgba(255,0,200,0.1)]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-neon-pink" />
          Comprar Créditos
        </CardTitle>
        <CardDescription>
          Créditos para criar e gerenciar campanhas
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showConfirmation ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Compra Confirmada!</h3>
            <p className="text-gray-400 mb-4">
              Seu pagamento de {formatCurrency(selectedPackage.price)} foi aprovado.
            </p>
            <div className="p-3 bg-gray-800/50 rounded-md mb-4">
              <p className="font-medium">
                +{selectedPackage.credits + selectedPackage.bonus} créditos
              </p>
              <p className="text-xs text-neon-pink">Créditos disponíveis em instantes</p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Selecione um pacote:</label>
                <span className="text-sm text-neon-pink">
                  {selectedPackage.credits.toLocaleString()} créditos
                  {selectedPackage.bonus > 0 && ` (+${selectedPackage.bonus.toLocaleString()} bônus)`}
                </span>
              </div>
              
              <Slider
                value={selectedAmount}
                min={1}
                max={5}
                step={1}
                onValueChange={handleSliderChange}
                className="py-4"
              />
              
              <div className="flex justify-between text-xs text-gray-400">
                <span>500</span>
                <span>10.000</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {creditPackages.map((pkg) => (
                <div
                  key={pkg.value}
                  className={`relative p-3 border rounded-md text-center cursor-pointer transition-all ${
                    selectedAmount[0] === pkg.value
                      ? "border-neon-pink bg-neon-pink/10 text-white"
                      : "border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-500"
                  }`}
                  onClick={() => handleSliderChange([pkg.value])}
                >
                  <p className="text-sm font-medium">{pkg.credits.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">créditos</p>
                  
                  {pkg.bonus > 0 && (
                    <div className="absolute -top-2 -right-2 bg-neon-pink text-white text-xs px-2 py-0.5 rounded-full">
                      +{getDiscountPercentage(pkg)}%
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="p-4 border border-gray-700 rounded-md bg-gray-800/30">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Resumo</span>
                <span className="text-sm text-neon-pink font-bold">
                  {formatCurrency(selectedPackage.price)}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Créditos base</span>
                  <span>{selectedPackage.credits.toLocaleString()}</span>
                </div>
                
                {selectedPackage.bonus > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center gap-1 text-neon-pink">
                      <Sparkles className="w-3 h-3" />
                      Bônus
                    </span>
                    <span className="text-neon-pink">+{selectedPackage.bonus.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-xs">
                  <span className="flex items-center gap-1 text-gray-400">
                    <Clock className="w-3 h-3" />
                    Validade
                  </span>
                  <span>12 meses</span>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="flex items-center gap-1 text-gray-400">
                    <Zap className="w-3 h-3" />
                    Preço por crédito
                  </span>
                  <span>
                    {formatCurrency(selectedPackage.price / (selectedPackage.credits + selectedPackage.bonus))}
                  </span>
                </div>
              </div>
            </div>
            
            <Button
              onClick={handlePurchase}
              className="w-full bg-gradient-to-r from-purple-600/60 to-pink-500/60 hover:from-purple-600/80 hover:to-pink-500/80"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Comprar Créditos
            </Button>
            
            <p className="text-xs text-center text-gray-400">
              Os créditos serão adicionados imediatamente após a confirmação do pagamento
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CreditsPurchase;
