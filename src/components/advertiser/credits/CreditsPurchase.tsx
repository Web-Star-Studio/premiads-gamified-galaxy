
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CreditCard, Info } from "lucide-react";
import { useSounds } from "@/hooks/use-sounds";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CreditPackage, CreditPurchaseProps } from "./types";
import ConfirmationScreen from "./ConfirmationScreen";
import CreditsPurchaseForm from "./CreditsPurchaseForm";

const CreditsPurchase = ({ currentCredits = 0 }: CreditPurchaseProps) => {
  const [selectedAmount, setSelectedAmount] = useState<number[]>([2]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { playSound } = useSounds();
  const { toast } = useToast();
  
  // Credit packages with the new conversion rate (10 credits = R$1.00)
  const creditPackages: CreditPackage[] = [
    { value: 1, credits: 500, price: 50, bonus: 0 },
    { value: 2, credits: 1000, price: 100, bonus: 100 },
    { value: 3, credits: 2500, price: 250, bonus: 350 },
    { value: 4, credits: 5000, price: 500, bonus: 1000 },
    { value: 5, credits: 10000, price: 1000, bonus: 2500 },
  ];
  
  const selectedPackage = creditPackages[selectedAmount[0] - 1];
  
  const handleSliderChange = (value: number[]) => {
    playSound("pop");
    setSelectedAmount(value);
  };
  
  const handlePurchase = async () => {
    setProcessing(true);
    playSound("pop");
    
    try {
      // Simulating payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setShowConfirmation(true);
      
      // Update credit balance in database
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
      
      if (userId) {
        const totalCredits = selectedPackage.credits + selectedPackage.bonus;
        
        // Update the user's credits in the database
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
      
      // Reset after 3 seconds
      setTimeout(() => {
        setShowConfirmation(false);
        toast({
          title: "Créditos adquiridos",
          description: `${selectedPackage.credits + selectedPackage.bonus} créditos foram adicionados à sua conta.`,
        });
        
        // Reload page to show updated credit balance
        window.location.reload();
      }, 3000);
    } catch (error: any) {
      console.error("Error purchasing credits:", error);
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
          Comprar Créditos
        </CardTitle>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 cursor-help">
                <CardDescription>
                  Créditos para criar e gerenciar campanhas
                </CardDescription>
                <Info className="w-3.5 h-3.5 text-gray-500" />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-galaxy-darkPurple border-galaxy-purple p-3">
              <div className="space-y-1 text-xs">
                <p className="font-medium text-sm">Conversão de valores</p>
                <p>10 créditos = R$1,00</p>
                <p>Cada crédito vale R$0,10</p>
                <p className="text-gray-400 mt-1">Créditos são usados para impulsionar campanhas, alcançar mais usuários e desbloquear recursos premium.</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent>
        {showConfirmation ? (
          <ConfirmationScreen selectedPackage={selectedPackage} />
        ) : (
          <CreditsPurchaseForm
            currentCredits={currentCredits}
            creditPackages={creditPackages}
            selectedAmount={selectedAmount}
            selectedPackage={selectedPackage}
            processing={processing}
            onSliderChange={handleSliderChange}
            onPurchase={handlePurchase}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default CreditsPurchase;
