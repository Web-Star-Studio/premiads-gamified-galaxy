
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Gift, Sparkles, Star, Trophy, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for recommended missions
const RECOMMENDED_MISSIONS = [
  {
    id: 1,
    title: "Visite 3 Lojas Parceiras",
    description: "Confira nossas lojas parceiras e ganhe pontos extras",
    reward: 120,
    icon: <Star className="w-5 h-5 text-neon-lime" />,
    difficulty: "Fácil",
    estimatedTime: "30 min"
  },
  {
    id: 2,
    title: "Compartilhe nas Redes Sociais",
    description: "Compartilhe sua experiência e ganhe recompensas exclusivas",
    reward: 150,
    icon: <Gift className="w-5 h-5 text-neon-cyan" />,
    difficulty: "Fácil",
    estimatedTime: "5 min"
  },
  {
    id: 3,
    title: "Complete o Quiz Semanal",
    description: "Teste seus conhecimentos e ganhe pontos extras",
    reward: 200,
    icon: <Trophy className="w-5 h-5 text-neon-pink" />,
    difficulty: "Médio",
    estimatedTime: "15 min"
  },
  {
    id: 4,
    title: "Participe do Evento Especial",
    description: "Eventos com recompensas raras e exclusivas",
    reward: 300,
    icon: <Sparkles className="w-5 h-5 text-yellow-400" />,
    difficulty: "Difícil",
    estimatedTime: "1 hora"
  }
];

const MissionsCarousel = () => {
  const { toast } = useToast();
  const { playSound } = useSounds();
  const [acceptedMissions, setAcceptedMissions] = useState<number[]>([]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      playSound("chime");
    }, 600);
    
    return () => clearTimeout(timer);
  }, [playSound]);
  
  const handleAcceptMission = (missionId: number) => {
    if (acceptedMissions.includes(missionId)) {
      toast({
        title: "Missão já aceita",
        description: "Você já aceitou essa missão antes",
      });
      return;
    }
    
    // Play coin sound
    playSound("pop");
    
    // Animate coins falling (visual cue)
    // In a real app, this would trigger a canvas animation
    
    // Update accepted missions
    setAcceptedMissions(prev => [...prev, missionId]);
    
    toast({
      title: "Missão aceita!",
      description: "Verifique suas missões em andamento",
    });
  };

  return (
    <motion.div
      className="glass-panel p-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold font-heading">Missões Recomendadas</h2>
        <Target className="w-5 h-5 text-neon-cyan" />
      </div>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {RECOMMENDED_MISSIONS.map((mission) => (
            <CarouselItem key={mission.id} className="md:basis-1/2 lg:basis-1/3">
              <Card className="bg-galaxy-deepPurple/30 border-galaxy-purple/20">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    {mission.icon}
                    <span className="text-xs px-2 py-0.5 bg-galaxy-deepPurple/50 rounded-full">
                      {mission.difficulty}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{mission.title}</CardTitle>
                  <CardDescription>{mission.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">Recompensa</div>
                    <div className="flex items-center">
                      <span className="font-semibold text-neon-cyan">{mission.reward}</span>
                      <span className="ml-1 text-xs text-gray-400">pontos</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="text-sm text-gray-400">Duração estimada</div>
                    <div className="text-sm">{mission.estimatedTime}</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full neon-button"
                    onClick={() => handleAcceptMission(mission.id)}
                    disabled={acceptedMissions.includes(mission.id)}
                  >
                    {acceptedMissions.includes(mission.id) ? "Aceita" : "Aceitar Missão"}
                  </Button>
                </CardFooter>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center mt-4 gap-2">
          <CarouselPrevious className="static translate-y-0 bg-galaxy-deepPurple/50 border-galaxy-purple/20" />
          <CarouselNext className="static translate-y-0 bg-galaxy-deepPurple/50 border-galaxy-purple/20" />
        </div>
      </Carousel>
    </motion.div>
  );
};

export default MissionsCarousel;
