
import { useState } from "react";
import { motion } from "framer-motion";
import KnowledgeLayout from "@/components/client/knowledge/KnowledgeLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, X, Award, Rocket, Target, Coins, Users } from "lucide-react";
import { useSounds } from "@/hooks/use-sounds";
import { Card, CardContent } from "@/components/ui/card";

const Tour = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { playSound } = useSounds();
  
  const steps = [
    {
      title: "Bem-vindo à PremiAds",
      description: "Uma plataforma que conecta marcas e usuários através de missões interativas e recompensas",
      icon: Rocket,
      color: "text-neon-cyan",
      bgColor: "bg-neon-cyan/10"
    },
    {
      title: "Missões",
      description: "Complete missões das suas marcas favoritas e ganhe pontos. As missões podem ser vídeos, fotos, pesquisas e muito mais.",
      icon: Target,
      color: "text-neon-pink",
      bgColor: "bg-neon-pink/10"
    },
    {
      title: "Pontos e Recompensas",
      description: "Acumule pontos e troque por prêmios, descontos, cashback ou use em sorteios exclusivos",
      icon: Coins,
      color: "text-neon-lime",
      bgColor: "bg-neon-lime/10"
    },
    {
      title: "Badges e Níveis",
      description: "Desbloqueie badges e suba de nível conforme participa. Níveis mais altos oferecem benefícios exclusivos.",
      icon: Award,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10"
    },
    {
      title: "Programa de Indicação",
      description: "Indique amigos e ganhe pontos extras quando eles se cadastrarem e completarem suas primeiras missões",
      icon: Users,
      color: "text-neon-cyan",
      bgColor: "bg-neon-cyan/10"
    }
  ];
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      playSound("pop");
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      playSound("pop");
    }
  };
  
  const handleSkip = () => {
    setCurrentStep(steps.length - 1);
    playSound("pop");
  };

  return (
    <KnowledgeLayout
      title="Tour Guiado"
      subtitle="Conheça os principais recursos da plataforma"
    >
      <div className="relative">
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-1 items-center">
            {steps.map((_, index) => (
              <motion.button
                key={index}
                className={`h-2 rounded-full ${
                  index === currentStep ? "w-8 bg-neon-cyan" : "w-2 bg-gray-600"
                }`}
                initial={{ width: index === currentStep ? "2rem" : "0.5rem" }}
                animate={{ width: index === currentStep ? "2rem" : "0.5rem" }}
                onClick={() => setCurrentStep(index)}
              />
            ))}
          </div>
          
          <Button variant="ghost" size="sm" onClick={handleSkip}>
            Pular tour
            <X className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <Card variant="glass" className="mb-8 border-neon-cyan/30">
          <CardContent className="p-8">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col md:flex-row items-center gap-6"
            >
              <div className={`p-6 rounded-full ${steps[currentStep].bgColor}`}>
                <steps[currentStep].icon className={`h-16 w-16 ${steps[currentStep].color}`} />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-4">{steps[currentStep].title}</h3>
                <p className="text-lg text-gray-300">{steps[currentStep].description}</p>
              </div>
            </motion.div>
          </CardContent>
        </Card>
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>
          
          <Button 
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
          >
            Próximo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </KnowledgeLayout>
  );
};

export default Tour;
