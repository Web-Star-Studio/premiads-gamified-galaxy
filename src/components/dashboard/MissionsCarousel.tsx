import React, { memo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useSounds } from "@/hooks/use-sounds";
import { Mission } from "@/types/mission-unified";

interface MissionsCarouselProps {
  missions: Mission[];
  onSelectMission: (mission: Mission) => void;
}

const MissionsCarousel = memo<MissionsCarouselProps>(({ missions, onSelectMission }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const { playSound } = useSounds();

  const nextSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % missions.length);
    playSound("pop");
  }, [missions.length, playSound]);

  const prevSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + missions.length) % missions.length);
    playSound("pop");
  }, [missions.length, playSound]);

  const handleMissionClick = React.useCallback((mission: Mission) => {
    playSound("chime");
    onSelectMission(mission);
  }, [onSelectMission, playSound]);

  if (!missions || missions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Nenhuma missão disponível no momento.</p>
      </div>
    );
  }

  const visibleMissions = missions.slice(currentIndex, currentIndex + 3);
  
  // Fill remaining slots if we don't have 3 missions to show
  while (visibleMissions.length < 3 && missions.length > 0) {
    visibleMissions.push(missions[(currentIndex + visibleMissions.length) % missions.length]);
  }

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Missões Disponíveis</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            disabled={missions.length <= 3}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            disabled={missions.length <= 3}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {visibleMissions.map((mission, index) => (
          <motion.div
            key={`${mission.id}-${index}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 glass-panel border-galaxy-purple/30"
              onClick={() => handleMissionClick(mission)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-white line-clamp-1">{mission.title}</h4>
                    <p className="text-sm text-gray-400">{mission.advertiser_id ? `Anunciante #${mission.advertiser_id}` : "PremiAds"}</p>
                  </div>
                  <Badge 
                    variant="secondary"
                    className="flex items-center gap-1 bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30"
                  >
                    <Trophy className="w-3 h-3" />
                    <span>{mission.tickets_reward} pts</span>
                  </Badge>
                </div>

                <p className="text-sm text-gray-300 line-clamp-2 mb-3">
                  {mission.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {mission.deadline 
                        ? new Date(mission.deadline).toLocaleDateString('pt-BR')
                        : "Sem prazo"
                      }
                    </span>
                  </div>
                  
                  {mission.has_badge && (
                    <Badge variant="outline" className="text-xs bg-neon-pink/20 text-neon-pink border-neon-pink/30">
                      Badge
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

MissionsCarousel.displayName = "MissionsCarousel";

export default MissionsCarousel;
