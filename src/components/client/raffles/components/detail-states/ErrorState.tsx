
import React from "react";
import { AlertCircle } from "lucide-react";

const ErrorState = () => {
  return (
    <div className="glass-panel p-6 h-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 text-red-500 mx-auto flex items-center justify-center">
          <AlertCircle size={32} />
        </div>
        <p className="mt-4 text-gray-400">Sorteio não encontrado ou indisponível.</p>
        <p className="mt-2 text-sm text-gray-500">Por favor, selecione outro sorteio ou tente novamente mais tarde.</p>
      </div>
    </div>
  );
};

export default ErrorState;
