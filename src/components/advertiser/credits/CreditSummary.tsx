
import { Clock, Sparkles, Zap } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { CreditSummaryProps } from "./types";

const CreditSummary = ({ selectedPackage }: CreditSummaryProps) => {
  return (
    <div className="p-4 border border-gray-700 rounded-md bg-gray-800/30">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">Resumo</span>
        <span className="text-sm text-neon-pink font-bold">
          {formatCurrency(selectedPackage.price / 10)}
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
            {formatCurrency((selectedPackage.price / 10) / (selectedPackage.credits + selectedPackage.bonus))}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CreditSummary;
