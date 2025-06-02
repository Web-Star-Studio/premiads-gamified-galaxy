import { Clock, CreditCard, SparklesIcon, Zap } from "lucide-react";
import { CreditPackage } from "../useCreditPurchase.hook";

interface CreditSummaryProps {
  selectedPackage: CreditPackage | null;
  paymentMethod?: "stripe" | "paypal";
}

export function CreditSummary({ selectedPackage, paymentMethod }: CreditSummaryProps) {
  if (!selectedPackage) return null;

  const { base, bonus, price } = selectedPackage;
  const totalCredits = base + bonus;
  const pricePerCredit = price / totalCredits;
  const formattedPrice = (price / 10).toFixed(2).replace(".", ",");
  const formattedPricePerCredit = (price / 10 / totalCredits).toFixed(3).replace(".", ",");

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-base font-medium">Resumo</span>
        <div className="text-right">
          <span className="text-lg font-bold text-neon-pink">R$ {formattedPrice}</span>
          <p className="text-xs text-gray-400">Valor total</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300 flex items-center">
            <CreditCard className="w-4 h-4 mr-2 text-purple-400" />
            Rifas base
          </span>
          <span className="font-medium">{base.toLocaleString()}</span>
        </div>

        {bonus > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-neon-pink flex items-center">
              <SparklesIcon className="w-4 h-4 mr-2" />
              Bônus
            </span>
            <span className="font-medium text-neon-pink">+{bonus.toLocaleString()}</span>
          </div>
        )}

        <div className="flex justify-between items-center pt-1 border-t border-gray-700">
          <span className="text-sm text-gray-300">Total de rifas</span>
          <span className="font-medium">{totalCredits.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1 text-gray-400">
            <Zap className="w-3 h-3" />
            Preço por rifa
          </span>
          <span className="text-sm">R$ {formattedPricePerCredit}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300 flex items-center">
            <Clock className="w-4 h-4 mr-2 text-blue-400" />
            Validade
          </span>
          <span className="text-sm">12 meses</span>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-700">
        <div className="text-xs text-gray-400">
          As rifas serão adicionadas à sua conta imediatamente após a confirmação do pagamento.
        </div>
      </div>
    </div>
  );
}
