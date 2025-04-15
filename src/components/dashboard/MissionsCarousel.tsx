
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Gift, Sparkles, Star, Trophy, Target, Camera, FileText, Upload, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { MissionType } from "@/hooks/useMissionsTypes";

// Component to display mission icon based on type
const MissionTypeIcon = ({ type }: { type: MissionType }) => {
  switch (type) {
    case "survey":
      return <FileText className="w-5 h-5 text-neon-lime" />;
    case "photo":
      return <Camera className="w-5 h-5 text-neon-cyan" />;
    case "video":
      return <Sparkles className="w-5 h-5 text-neon-pink" />;
    case "social_share":
      return <Upload className="w-5 h-5 text-yellow-400" />;
    case "visit":
      return <MapPin className="w-5 h-5 text-neon-lime" />;
    default:
      return <Star className="w-5 h-5 text-neon-lime" />;
  }
};

interface RecommendedMission {
  id: string;
  title: string;
  description: string;
  points: number;
  type: MissionType;
  difficulty: string;
  estimatedTime: string;
  business_type?: string;
}

const MissionsCarousel = () => {
  const { toast } = useToast();
  const { playSound } = useSounds();
  const [acceptedMissions, setAcceptedMissions] = useState<string[]>([]);
  const [recommendedMissions, setRecommendedMissions] = useState<RecommendedMission[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setLoading(true);
        
        // Get session to check if user is logged in
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData?.session?.user?.id;
        
        if (!userId) {
          console.log("User not authenticated, using mock data");
          // Use mock data
          setRecommendedMissions(MOCK_RECOMMENDED_MISSIONS);
          setLoading(false);
          return;
        }
        
        // Fetch real missions from the database
        const { data: missionsData, error } = await supabase
          .from("missions")
          .select("id, title, description, points, type, business_type")
          .eq("is_active", true)
          .limit(8);
        
        if (error) throw error;
        
        if (missionsData && missionsData.length > 0) {
          // Map missions to our format
          const mapped = missionsData.map(mission => ({
            id: mission.id,
            title: mission.title,
            description: mission.description,
            points: mission.points,
            type: mission.type as MissionType,
            difficulty: getDifficultyFromPoints(mission.points),
            estimatedTime: getEstimatedTimeFromType(mission.type as MissionType),
            business_type: mission.business_type
          }));
          
          setRecommendedMissions(mapped);
        } else {
          // Fallback to mock data if no missions found
          setRecommendedMissions(MOCK_RECOMMENDED_MISSIONS);
        }
      } catch (error) {
        console.error("Error fetching missions:", error);
        // Fallback to mock data
        setRecommendedMissions(MOCK_RECOMMENDED_MISSIONS);
      } finally {
        setLoading(false);
        
        const timer = setTimeout(() => {
          playSound("chime");
        }, 600);
        
        return () => clearTimeout(timer);
      }
    };
    
    fetchMissions();
  }, [playSound]);

  // Helper functions to derive mission properties
  const getDifficultyFromPoints = (points: number): string => {
    if (points <= 50) return "Fácil";
    if (points <= 150) return "Médio";
    return "Difícil";
  };
  
  const getEstimatedTimeFromType = (type: MissionType): string => {
    switch (type) {
      case "survey":
        return "10 min";
      case "photo":
        return "15 min";
      case "video":
        return "30 min";
      case "social_share":
        return "5 min";
      case "visit":
        return "1 hora";
      default:
        return "20 min";
    }
  };
  
  const handleAcceptMission = (missionId: string) => {
    if (acceptedMissions.includes(missionId)) {
      toast({
        title: "Missão já aceita",
        description: "Você já aceitou essa missão antes",
      });
      return;
    }
    
    // Play coin sound
    playSound("pop");
    
    // Update accepted missions
    setAcceptedMissions(prev => [...prev, missionId]);
    
    toast({
      title: "Missão aceita!",
      description: "Verifique suas missões em andamento",
    });
  };

  // Mock data for fallback
  const MOCK_RECOMMENDED_MISSIONS: RecommendedMission[] = [
    {
      id: "mock-1",
      title: "Visite 3 Lojas Parceiras",
      description: "Confira nossas lojas parceiras e ganhe pontos extras",
      points: 120,
      type: "visit",
      difficulty: "Fácil",
      estimatedTime: "30 min"
    },
    {
      id: "mock-2",
      title: "Compartilhe nas Redes Sociais",
      description: "Compartilhe sua experiência e ganhe recompensas exclusivas",
      points: 150,
      type: "social_share",
      difficulty: "Fácil",
      estimatedTime: "5 min"
    },
    {
      id: "mock-3",
      title: "Complete o Quiz Semanal",
      description: "Teste seus conhecimentos e ganhe pontos extras",
      points: 200,
      type: "survey",
      difficulty: "Médio",
      estimatedTime: "15 min"
    },
    {
      id: "mock-4",
      title: "Participe do Evento Especial",
      description: "Eventos com recompensas raras e exclusivas",
      points: 300,
      type: "photo",
      difficulty: "Difícil",
      estimatedTime: "1 hora"
    }
  ];

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
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-10 h-10 border-4 border-t-neon-cyan border-galaxy-purple rounded-full animate-spin"></div>
        </div>
      ) : (
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {recommendedMissions.map((mission) => (
              <CarouselItem key={mission.id} className="md:basis-1/2 lg:basis-1/3">
                <Card className="bg-galaxy-deepPurple/30 border-galaxy-purple/20">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <MissionTypeIcon type={mission.type} />
                      <span className="text-xs px-2 py-0.5 bg-galaxy-deepPurple/50 rounded-full">
                        {mission.difficulty}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{mission.title}</CardTitle>
                    <CardDescription>{mission.description}</CardDescription>
                    {mission.business_type && (
                      <div className="text-xs text-gray-400 mt-1">
                        {mission.business_type}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-400">Recompensa</div>
                      <div className="flex items-center">
                        <span className="font-semibold text-neon-cyan">{mission.points}</span>
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
      )}
    </motion.div>
  );
};

export default MissionsCarousel;
