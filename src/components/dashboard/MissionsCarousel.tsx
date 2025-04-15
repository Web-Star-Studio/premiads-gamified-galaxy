
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { useNavigate } from "react-router-dom";
import { useMissions } from "@/hooks/useMissions";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import MissionCard from "./missions/MissionCard";
import MissionsEmptyState from "./missions/MissionsEmptyState";
import MissionsHeader from "./missions/MissionsHeader";
import MissionsLoading from "./missions/MissionsLoading";

const MissionsCarousel = () => {
  const { toast } = useToast();
  const { playSound } = useSounds();
  const [acceptedMissions, setAcceptedMissions] = useState<string[]>([]);
  const navigate = useNavigate();

  const { 
    loading, 
    allMissions,
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
      <MissionsHeader onViewAllMissions={handleViewAllMissions} />
      
      {loading ? (
        <MissionsLoading />
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
                  <MissionCard 
                    mission={mission}
                    isAccepted={acceptedMissions.includes(mission.id)}
                    onAcceptMission={handleAcceptMission}
                    getMissionTypeLabel={getMissionTypeLabel}
                  />
                </CarouselItem>
              ))
            ) : (
              <MissionsEmptyState />
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
