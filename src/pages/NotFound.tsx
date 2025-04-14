
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Particles from "@/components/Particles";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: Usuário tentou acessar rota inexistente:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-galaxy-dark">
      <Particles count={30} />
      
      <div className="text-center z-10 glass-panel p-10 max-w-md">
        <h1 className="text-6xl font-bold mb-4 neon-text-pink">404</h1>
        <p className="text-xl text-gray-300 mb-8">Oops! Página não encontrada</p>
        <Button asChild className="neon-button">
          <a href="/">Voltar para o Início</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
