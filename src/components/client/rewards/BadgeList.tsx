
import { useState } from "react";
import { motion } from "framer-motion";
import { Award, Calendar, Info } from "lucide-react";
import { Player } from "@lottiefiles/react-lottie-player";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSounds } from "@/hooks/use-sounds";

// Badge Lottie animations mapped to mission types
const BADGE_ANIMATIONS: Record<string, string> = {
  default: "https://assets7.lottiefiles.com/private_files/lf30_bfzkfm07.json", // Generic badge
  form: "https://assets1.lottiefiles.com/packages/lf20_fnjha2ed.json", // Form
  photo: "https://assets10.lottiefiles.com/packages/lf20_qm8eqtyw.json", // Camera/Photo
  social: "https://assets9.lottiefiles.com/packages/lf20_wloxwm9w.json", // Social
  checkin: "https://assets3.lottiefiles.com/packages/lf20_9yi1lpr7.json", // Location
  video: "https://assets3.lottiefiles.com/packages/lf20_2cwdcjsd.json", // Video
  survey: "https://assets7.lottiefiles.com/packages/lf20_kw2yp2rh.json", // Survey
  review: "https://assets3.lottiefiles.com/packages/lf20_bnfvh5kf.json", // Stars/Review
  coupon: "https://assets10.lottiefiles.com/packages/lf20_uomoou11.json", // Coupon/Ticket
};

interface Badge {
  id: string;
  badge_name: string;
  badge_description: string | null;
  badge_image_url: string | null;
  earned_at: string;
  mission_id: string;
  missions: {
    title: string;
  };
}

interface BadgeListProps {
  badges: Badge[];
}

const BadgeList: React.FC<BadgeListProps> = ({ badges }) => {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const { playSound } = useSounds();

  const handleOpenBadge = (badge: Badge) => {
    setSelectedBadge(badge);
    playSound("success");
  };

  const getBadgeAnimation = (badge: Badge): string => {
    // Logic to determine which animation to use based on badge info or mission type
    // For now, just returning a default animation
    
    // Try to extract mission type from badge name or description
    const missionType = 
      badge.badge_description?.toLowerCase().includes("photo") ? "photo" :
      badge.badge_description?.toLowerCase().includes("form") ? "form" :
      badge.badge_description?.toLowerCase().includes("video") ? "video" :
      badge.badge_description?.toLowerCase().includes("survey") ? "survey" :
      badge.badge_description?.toLowerCase().includes("review") ? "review" :
      badge.badge_description?.toLowerCase().includes("coupon") ? "coupon" :
      badge.badge_description?.toLowerCase().includes("social") ? "social" :
      badge.badge_description?.toLowerCase().includes("check-in") ? "checkin" :
      "default";
    
    return BADGE_ANIMATIONS[missionType] || BADGE_ANIMATIONS.default;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((badge) => (
          <motion.div 
            key={badge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => handleOpenBadge(badge)}
            className="cursor-pointer"
          >
            <Card className="border-galaxy-purple/30 bg-galaxy-deepPurple/20 hover:bg-galaxy-deepPurple/40 transition-all duration-300 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 flex-shrink-0">
                    <Player
                      src={badge.badge_image_url || getBadgeAnimation(badge)}
                      className="absolute inset-0"
                      autoplay
                      loop
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-white truncate">{badge.badge_name}</h3>
                    <p className="text-sm text-gray-400 mt-1 truncate">
                      {badge.badge_description || `Conquista pela missão "${badge.missions?.title || 'Desconhecida'}"`}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(badge.earned_at).toLocaleDateString('pt-BR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* Badge Details Dialog */}
      <Dialog open={!!selectedBadge} onOpenChange={(open) => !open && setSelectedBadge(null)}>
        {selectedBadge && (
          <DialogContent className="bg-galaxy-deepPurple/95 border-galaxy-purple/30 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl text-center">{selectedBadge.badge_name}</DialogTitle>
              <DialogDescription className="text-gray-400 text-center">
                Conquista desbloqueada
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex flex-col items-center py-6">
              <div className="h-40 w-40 mb-6">
                <Player
                  src={selectedBadge.badge_image_url || getBadgeAnimation(selectedBadge)}
                  className="h-full w-full"
                  autoplay
                  loop
                />
              </div>
              
              <div className="text-center max-w-sm">
                <p className="text-white">{selectedBadge.badge_description || `Parabéns por completar a missão "${selectedBadge.missions?.title || 'Desconhecida'}" e desbloquear esta conquista!`}</p>
                
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-400">
                  <Info className="h-4 w-4" />
                  <span>Conquista obtida em {new Date(selectedBadge.earned_at).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default BadgeList;
