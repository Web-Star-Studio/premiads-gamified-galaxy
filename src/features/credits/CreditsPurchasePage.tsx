import React from "react";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CreditPackageCard from "./components/CreditPackageCard";
import CreditSlider from "./components/CreditSlider";
import CreditSummary from "./components/CreditSummary";
import PaymentMethodSelector from "./components/PaymentMethodSelector";
import PaymentModal from "./components/PaymentModal";
import useCreditPurchase from "./useCreditPurchase.hook"; // Fixed import

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
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    handlePayment,
    isLoading,
    paymentError,
    resetState,
  } = useCreditPurchase();

  const handleClose = () => {
    navigate("/perfil");
    resetState();
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
            <h1 className="text-2xl font-bold">Comprar Créditos</h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Escolha um pacote</h2>
                <CreditSlider
                  packages={packages}
                  selectedPackage={selectedPackage}
                  setSelectedPackage={setSelectedPackage}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {packages.map((pack) => (
                    <CreditPackageCard
                      key={pack.id}
                      pack={pack}
                      selected={selectedPackage?.id === pack.id}
                      onClick={() => setSelectedPackage(pack)}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Resumo da compra</h2>
                <CreditSummary
                  selectedPackage={selectedPackage}
                  paymentMethod={paymentMethod}
                />
                <Separator className="my-4" />
                <PaymentMethodSelector
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                />
                {paymentError && (
                  <p className="text-red-500 text-sm">{paymentError}</p>
                )}
                <Button
                  className="w-full"
                  onClick={() => setIsPaymentModalOpen(true)}
                  disabled={!selectedPackage || isLoading}
                  isLoading={isLoading}
                >
                  {isLoading ? "Processando..." : "Confirmar Pagamento"}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        selectedPackage={selectedPackage}
        paymentMethod={paymentMethod}
        handlePayment={handlePayment}
        isLoading={isLoading}
      />
    </div>
  );
};

export default CreditsPurchasePage;
