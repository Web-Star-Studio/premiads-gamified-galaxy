
import { CreditPackagesGridProps } from "./types";
import { formatCurrency } from "@/utils/formatCurrency";

const CreditPackagesGrid = ({ creditPackages, selectedAmount, onPackageSelect }: CreditPackagesGridProps) => {
  const getDiscountPercentage = (packageIndex: number) => {
    const pkg = creditPackages[packageIndex];
    const standardRate = 0.1; // R$0.10 per credit
    const packageRate = pkg.price / (pkg.credits + pkg.bonus);
    const discount = ((standardRate - packageRate / 10) / standardRate) * 100;
    return Math.round(discount);
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      {creditPackages.map((pkg) => (
        <div
          key={pkg.value}
          className={`relative p-3 border rounded-md text-center cursor-pointer transition-all ${
            selectedAmount[0] === pkg.value
              ? "border-neon-pink bg-neon-pink/10 text-white"
              : "border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-500"
          }`}
          onClick={() => onPackageSelect([pkg.value])}
        >
          <p className="text-sm font-medium">{pkg.credits.toLocaleString()}</p>
          <p className="text-xs text-gray-400">créditos</p>
          <p className="text-xs mt-1">{formatCurrency(pkg.price / 10)}</p>
          
          {pkg.bonus > 0 && (
            <div className="absolute -top-2 -right-2 bg-neon-pink text-white text-xs px-2 py-0.5 rounded-full">
              +{getDiscountPercentage(pkg.value - 1)}%
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CreditPackagesGrid;
