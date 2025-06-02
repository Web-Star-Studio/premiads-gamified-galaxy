import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { ConfirmationScreenProps } from "./types";

const ConfirmationScreen = ({ selectedPackage }: ConfirmationScreenProps) => {
  return (
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
        Seu pagamento de {formatCurrency(selectedPackage.price / 10)} foi aprovado.
      </p>
      <div className="p-3 bg-gray-800/50 rounded-md mb-4">
        <p className="font-medium">
          +{selectedPackage.credits + selectedPackage.bonus} rifas
        </p>
        <p className="text-xs text-neon-pink">Rifas disponíveis em instantes</p>
      </div>
    </motion.div>
  );
};

export default ConfirmationScreen;
