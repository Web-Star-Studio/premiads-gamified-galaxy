
import React from "react";

const LoadingState = () => {
  return (
    <div className="glass-panel p-6 h-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-t-neon-cyan border-galaxy-purple rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-400">Carregando detalhes do sorteio...</p>
      </div>
    </div>
  );
};

export default LoadingState;
