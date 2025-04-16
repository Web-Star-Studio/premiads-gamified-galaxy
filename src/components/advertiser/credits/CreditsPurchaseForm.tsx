
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { getMoneyValue } from "@/utils/formatCurrency";
import { CreditPackage } from "./types";
import CreditSlider from "./CreditSlider";
import CreditPackagesGrid from "./CreditPackagesGrid";
import CreditSummary from "./CreditSummary";
import { useSounds } from "@/hooks/use-sounds";

interface CreditsPurchaseFormProps {
  currentCredits: number;
  creditPackages: CreditPackage[];
  selectedAmount: number[];
  selectedPackage: CreditPackage;
  processing: boolean;
  onSliderChange: (value: number[]) => void;
  onPurchase: () => void;
}

const CreditsPurchaseForm = ({
  currentCredits,
  creditPackages,
  selectedAmount,
  selectedPackage,
  processing,
  onSliderChange,
  onPurchase
}: CreditsPurchaseFormProps) => {
  return (
    <div className="space-y-6">
      <CreditSlider 
        selectedAmount={selectedAmount}
        creditPackages={creditPackages}
        onSliderChange={onSliderChange}
      />
      
      <CreditPackagesGrid 
        creditPackages={creditPackages}
        selectedAmount={selectedAmount}
        onPackageSelect={onSliderChange}
      />
      
      <CreditSummary selectedPackage={selectedPackage} />
      
      <Button
        onClick={onPurchase}
        className="w-full bg-gradient-to-r from-purple-600/60 to-pink-500/60 hover:from-purple-600/80 hover:to-pink-500/80"
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
            Comprar Créditos
          </>
        )}
      </Button>
      
      <div className="flex items-center justify-between border-t border-gray-700 pt-4 mt-4">
        <span className="text-sm text-gray-400">Saldo atual</span>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">{currentCredits.toLocaleString()} créditos</span>
          <span className="text-xs text-gray-400">~{getMoneyValue(currentCredits)}</span>
        </div>
      </div>
      
      <p className="text-xs text-center text-gray-400">
        Os créditos serão adicionados imediatamente após a confirmação do pagamento
      </p>
    </div>
  );
};

export default CreditsPurchaseForm;
