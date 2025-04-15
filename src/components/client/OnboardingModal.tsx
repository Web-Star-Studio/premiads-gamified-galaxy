
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Award, 
  Target, 
  Gift, 
  Users, 
  HelpCircle, 
  X, 
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { useSounds } from "@/hooks/use-sounds";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OnboardingModal = ({ isOpen, onClose }: OnboardingModalProps) => {
  const [step, setStep] = useState(1);
  const { playSound } = useSounds();
  const totalSteps = 5;
  
  useEffect(() => {
    if (isOpen) {
      playSound("chime");
    }
  }, [isOpen, playSound]);
  
  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      playSound("pop");
    } else {
      handleClose();
    }
  };
  
  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
      playSound("pop");
    }
  };
  
  const handleClose = () => {
    // Store in localStorage that the user has seen the onboarding
    localStorage.setItem("onboardingComplete", "true");
    onClose();
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neon-cyan/20 flex items-center justify-center">
              <Award className="w-8 h-8 text-neon-cyan" />
            </div>
            <h3 className="text-xl font-heading mb-2">Bem-vindo ao PremiAds!</h3>
            <p className="text-gray-400 mb-6">
              Estamos felizes em ter você conosco. Vamos dar uma olhada rápida em como você pode aproveitar ao máximo nossa plataforma.
            </p>
          </div>
        );
      case 2:
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neon-lime/20 flex items-center justify-center">
              <Target className="w-8 h-8 text-neon-lime" />
            </div>
            <h3 className="text-xl font-heading mb-2">Complete Missões</h3>
            <p className="text-gray-400 mb-6">
              Participe de missões e desafios para ganhar pontos. Quanto mais missões você completar, mais rápido subirá de nível!
            </p>
          </div>
        );
      case 3:
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neon-pink/20 flex items-center justify-center">
              <Gift className="w-8 h-8 text-neon-pink" />
            </div>
            <h3 className="text-xl font-heading mb-2">Ganhe Prêmios</h3>
            <p className="text-gray-400 mb-6">
              Converta seus pontos em tickets para participar de sorteios exclusivos e ganhar prêmios incríveis!
            </p>
          </div>
        );
      case 4:
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-glow/30 flex items-center justify-center">
              <Users className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-heading mb-2">Convide Amigos</h3>
            <p className="text-gray-400 mb-6">
              Ganhe pontos extras ao convidar seus amigos para se juntar à plataforma. Cada amigo que se registrar usando seu código de referência dará a você 200 pontos!
            </p>
          </div>
        );
      case 5:
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-400/20 flex items-center justify-center">
              <HelpCircle className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-heading mb-2">Precisando de Ajuda?</h3>
            <p className="text-gray-400 mb-6">
              Use o botão de ajuda ou chat ao vivo para obter suporte a qualquer momento. Estamos sempre aqui para ajudar!
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative bg-galaxy-dark glass-panel rounded-lg w-full max-w-md p-6"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 text-gray-400 hover:text-white"
              onClick={handleClose}
            >
              <X className="w-5 h-5" />
            </Button>
            
            <div className="py-4">
              {renderStepContent()}
              
              <div className="flex items-center justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={step === 1}
                  className="border-galaxy-purple/30"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>
                
                <div className="flex items-center">
                  {Array.from({ length: totalSteps }).map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full mx-1 ${
                        index + 1 === step ? "bg-neon-cyan" : "bg-galaxy-purple/30"
                      }`}
                    />
                  ))}
                </div>
                
                <Button
                  onClick={handleNext}
                  className="bg-neon-cyan text-galaxy-dark hover:bg-neon-cyan/80"
                >
                  {step === totalSteps ? "Começar" : "Próximo"}
                  {step !== totalSteps && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingModal;
