
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Verificar se o usuário já aceitou os cookies
    const hasConsent = localStorage.getItem("cookieConsent");
    
    if (!hasConsent) {
      // Mostrar o banner após um pequeno delay para melhor UX
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const acceptAll = () => {
    localStorage.setItem("cookieConsent", "all");
    setShowConsent(false);
  };
  
  const acceptEssential = () => {
    localStorage.setItem("cookieConsent", "essential");
    setShowConsent(false);
  };

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-galaxy-deepPurple backdrop-blur-md border-t border-galaxy-purple/40"
        >
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0 md:mr-6">
              <p className="text-gray-200 max-w-2xl">
                Utilizamos cookies para melhorar sua experiência em nosso site. Ao continuar navegando, você concorda com nossa 
                <Link to="/politica-de-privacidade" className="text-neon-cyan mx-1 hover:underline">
                  Política de Privacidade
                </Link>
                e
                <Link to="/cookies" className="text-neon-cyan mx-1 hover:underline">
                  Política de Cookies
                </Link>.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={acceptEssential}
                variant="outline"
                className="border-galaxy-purple hover:bg-galaxy-purple/20"
              >
                Apenas Essenciais
              </Button>
              <Button
                onClick={acceptAll}
                className="bg-neon-cyan text-galaxy-dark hover:bg-neon-cyan/80"
              >
                Aceitar Todos
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
