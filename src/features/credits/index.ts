
import useCreditPurchase from "./useCreditPurchase.hook"; // Fixed import

// Export components and hooks
export { default as CreditPackageCard } from "./components/CreditPackageCard";
export { default as CreditSlider } from "./components/CreditSlider";
export { default as CreditSummary } from "./components/CreditSummary";
export { default as PaymentMethodSelector } from "./components/PaymentMethodSelector";
export { default as PaymentModal } from "./components/PaymentModal";
export { default as CreditsPurchasePage } from "./CreditsPurchasePage";
export { default as PaymentSuccessHandler } from "./PaymentSuccessHandler";

// Export the hook
export { useCreditPurchase };

// Export types
export type { CreditPackage, PurchaseOptions } from "./useCreditPurchase.hook";
