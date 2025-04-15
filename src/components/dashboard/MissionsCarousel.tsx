
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { 
  Gift, Sparkles, Star, Trophy, Target, Camera, FileText, 
  Upload, MapPin, Image, ChevronRight, Clock
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useMissions } from "@/hooks/useMissions";
import { MissionType, getEstimatedTime, getMissionDifficulty } from "@/hooks/useMissionsTypes";
import { useNavigate } from "react-router-dom";

// Component to display mission icon based on type
const MissionTypeIcon = ({ type }: { type: MissionType }) => {
  switch (type) {
    case "survey":
      return <FileText className="w-5 h-5 text-neon-lime" />;
    case "photo":
      return <Image className="w-5 h-5 text-neon-cyan" />;
    case "video":
      return <Camera className="w-5 h-5 text-neon-pink" />;
    case "social_share":
      return <Upload className="w-5 h-5 text-yellow-400" />;
    case "visit":
      return <MapPin className="w-5 h-5 text-neon-lime" />;
    default:
      return <Star className="w-5 h-5 text-neon-lime" />;
  }
};

const MissionsCarousel = () => {
  const { toast } = useToast();
  const { playSound } = useSounds();
  const [acceptedMissions, setAcceptedMissions] = useState<string[]>([]);
  const navigate = useNavigate();

  const { 
    loading, 
    missions, 
    allMissions,
    findMissionsByBusinessType, 
    getMissionTypeLabel 
  } = useMissions();
  
  // Effect to initialize from localStorage
  useEffect(() => {
    const savedAccepted = localStorage.getItem('acceptedMissions');
    if (savedAccepted) {
      setAcceptedMissions(JSON.parse(savedAccepted));
    }
  }, []);
  
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
    
    // Update accepted missions and save to localStorage
    const updatedAccepted = [...acceptedMissions, missionId];
    setAcceptedMissions(updatedAccepted);
    localStorage.setItem('acceptedMissions', JSON.stringify(updatedAccepted));
    
    toast({
      title: "Missão aceita!",
      description: "Verifique suas missões em andamento",
    });
  };

  const handleViewAllMissions = () => {
    navigate('/cliente/missoes');
  };

  // Get only available missions for the carousel
  const availableMissions = allMissions.filter(m => m.status === "available").slice(0, 8);

  return (
    <motion.div
      className="glass-panel p-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold font-heading">Missões Recomendadas</h2>
          <p className="text-sm text-gray-400">Descubra missões de anunciantes de Recife</p>
        </div>
        <div className="flex items-center">
          <Button 
            variant="link" 
            className="text-neon-cyan flex items-center p-0"
            onClick={handleViewAllMissions}
          >
            Ver todas <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
          <Target className="w-5 h-5 text-neon-cyan ml-2" />
        </div>
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
            {availableMissions.length > 0 ? (
              availableMissions.map((mission) => (
                <CarouselItem key={mission.id} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="bg-galaxy-deepPurple/30 border-galaxy-purple/20 h-full flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <MissionTypeIcon type={mission.type} />
                          <span className="text-xs ml-2">{getMissionTypeLabel(mission.type)}</span>
                        </div>
                        <span className="text-xs px-2 py-0.5 bg-galaxy-deepPurple/50 rounded-full">
                          {getMissionDifficulty(mission.points)}
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
                    <CardContent className="flex-grow">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-400">Recompensa</div>
                        <div className="flex items-center">
                          <span className="font-semibold text-neon-cyan">{mission.points}</span>
                          <span className="ml-1 text-xs text-gray-400">pontos</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-sm text-gray-400">Duração estimada</div>
                        <div className="text-sm flex items-center">
                          <Clock className="w-3 h-3 mr-1 text-gray-400" />
                          {getEstimatedTime(mission.type)}
                        </div>
                      </div>
                      {mission.target_audience_gender && mission.target_audience_gender !== 'all' && (
                        <div className="text-xs text-gray-400 mt-2">
                          Público: {mission.target_audience_gender === 'male' ? 'Masculino' : 
                                   mission.target_audience_gender === 'female' ? 'Feminino' : 'Todos'}
                        </div>
                      )}
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
              ))
            ) : (
              <CarouselItem className="md:basis-full">
                <Card className="bg-galaxy-deepPurple/30 border-galaxy-purple/20 p-8 text-center">
                  <CardContent className="pt-6">
                    <Target className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-lg font-medium">Nenhuma missão disponível no momento</p>
                    <p className="text-sm text-gray-400 mt-2">Volte mais tarde para novas missões</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            )}
          </CarouselContent>
          {availableMissions.length > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              <CarouselPrevious className="static translate-y-0 bg-galaxy-deepPurple/50 border-galaxy-purple/20" />
              <CarouselNext className="static translate-y-0 bg-galaxy-deepPurple/50 border-galaxy-purple/20" />
            </div>
          )}
        </Carousel>
      )}
    </motion.div>
  );
};

export default MissionsCarousel;
