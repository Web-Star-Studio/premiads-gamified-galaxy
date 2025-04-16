
export interface CreditPackage {
  value: number;
  credits: number;
  price: number;
  bonus: number;
}

export interface CreditPurchaseProps {
  currentCredits?: number;
}

export interface ConfirmationScreenProps {
  selectedPackage: CreditPackage;
}

export interface CreditSliderProps {
  selectedAmount: number[];
  creditPackages: CreditPackage[];
  onSliderChange: (value: number[]) => void;
}

export interface CreditPackagesGridProps {
  creditPackages: CreditPackage[];
  selectedAmount: number[];
  onPackageSelect: (value: number[]) => void;
}

export interface CreditSummaryProps {
  selectedPackage: CreditPackage;
}
