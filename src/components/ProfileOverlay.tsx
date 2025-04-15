
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Particles from "./Particles";
import { motion } from "framer-motion";

const ProfileOverlay = () => {
  const { userType, setUserType, setUserName, setIsOverlayOpen } = useUser();
  const [step, setStep] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleTypeSelection = (type: "participante" | "anunciante") => {
    setUserType(type);
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) {
      setError(userType === "participante" 
        ? "Por favor, digite seu nome" 
        : "Por favor, digite o nome da sua empresa");
      return;
    }
    
    setUserName(inputValue);
    
    // Transition effect
    setTimeout(() => {
      setIsOverlayOpen(false);
      
      // Navigate to dashboard if user is a participant
      if (userType === "participante") {
        navigate("/cliente");
      } else {
        navigate("/anunciante");
      }
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-galaxy-dark"
    >
      <Particles count={50} />
      
      <div className="absolute top-0 left-0 w-full h-full bg-purple-glow opacity-30"></div>
      
      <div className="glass-panel p-8 max-w-md w-full mx-4 relative z-10">
        <motion.div
          key={`step-${step}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {step === 1 ? (
            <>
              <h1 className="text-3xl font-bold mb-8 text-center neon-text-cyan">
                Bem-vindo à <span className="neon-text-pink">PremiAds</span>
              </h1>
              
              <div className="space-y-6">
                <motion.div 
                  onClick={() => handleTypeSelection("participante")} 
                  className="glass-panel p-6 hover:neon-border transition-all duration-300 cursor-pointer relative overflow-hidden group"
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <h3 className="text-xl font-semibold mb-2">Você quer concorrer a prêmios?</h3>
                  <p className="text-gray-300">Participe de missões e ganhe recompensas incríveis!</p>
                  <Button className="neon-button mt-4 w-full">
                    Sim, quero participar!
                  </Button>
                </motion.div>
                
                <motion.div 
                  onClick={() => handleTypeSelection("anunciante")}
                  className="glass-panel p-6 hover:neon-border transition-all duration-300 cursor-pointer relative overflow-hidden group"
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <h3 className="text-xl font-semibold mb-2">Você quer alavancar sua marca?</h3>
                  <p className="text-gray-300">Crie campanhas gamificadas e engaje seu público!</p>
                  <Button className="neon-button mt-4 w-full">
                    Sim, quero anunciar!
                  </Button>
                </motion.div>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 className="text-2xl font-bold mb-6 text-center">
                {userType === "participante" 
                  ? "Como podemos chamar você?" 
                  : "Qual o nome da sua empresa?"}
              </h2>
              
              <div className="space-y-4">
                <Input
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setError("");
                  }}
                  placeholder={userType === "participante" ? "Seu nome" : "Nome da empresa"}
                  className="bg-galaxy-deepPurple/50 border-galaxy-purple/30 h-12"
                />
                
                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}
                
                <div className="flex space-x-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                  
                  <Button 
                    type="submit" 
                    className="neon-button flex-1"
                  >
                    Continuar
                  </Button>
                </div>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfileOverlay;
