
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const LoadingState = () => {
  const [showSecondaryMessage, setShowSecondaryMessage] = useState(false);
  const [showTryAgain, setShowTryAgain] = useState(false);
  
  useEffect(() => {
    // Show secondary message after 5 seconds
    const messageTimer = setTimeout(() => {
      setShowSecondaryMessage(true);
    }, 5000);
    
    // Show try again button after 10 seconds
    const buttonTimer = setTimeout(() => {
      setShowTryAgain(true);
    }, 10000);
    
    return () => {
      clearTimeout(messageTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-galaxy-dark">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md px-4"
      >
        <div className="w-16 h-16 mx-auto mb-4 border-4 border-t-neon-cyan border-galaxy-purple rounded-full animate-spin"></div>
        <h2 className="text-xl font-heading neon-text-cyan mb-2">Carregando seu universo...</h2>
        
        {showSecondaryMessage && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-400 text-sm mb-4"
          >
            Isto está demorando mais que o esperado. Verificando sua conexão...
          </motion.p>
        )}
        
        {showTryAgain && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-neon-cyan text-galaxy-dark rounded-md hover:bg-neon-cyan/80 transition-colors"
          >
            Tentar novamente
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default LoadingState;
