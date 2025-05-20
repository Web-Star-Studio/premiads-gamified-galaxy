
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Calendar, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSounds } from "@/hooks/use-sounds";
import { Player } from "@lottiefiles/react-lottie-player";
import { isLottieAnimation, isImageFile, getFallbackBadgeUrl } from "@/utils/getBadgeAnimation";

interface Badge {
  id: string;
  badge_name: string;
  badge_description: string | null;
  badge_image_url: string | null;
  earned_at: string;
  mission_id: string;
  missions: {
    title: string;
    type?: string;
  };
}

interface BadgeListProps {
  badges: Badge[];
}

const BadgeList: React.FC<BadgeListProps> = ({ badges }) => {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [previousBadgeCount, setPreviousBadgeCount] = useState(0);
  const [newBadgeIds, setNewBadgeIds] = useState<string[]>([]);
  const { playSound } = useSounds();

  // Track new badges when the list updates
  useEffect(() => {
    // If we have more badges than before, highlight the new ones
    if (badges.length > previousBadgeCount) {
      const currentIds = badges.map(badge => badge.id);
      const previousIds = newBadgeIds;
      
      // Find new badge IDs
      const newIds = currentIds.filter(id => !previousIds.includes(id));
      
      if (newIds.length > 0) {
        // Play award sound
        playSound('success');
        
        // Set new badge IDs for animation
        setNewBadgeIds([...previousIds, ...newIds]);
      }
    }
    
    // Update previous count
    setPreviousBadgeCount(badges.length);
  }, [badges, previousBadgeCount, newBadgeIds, playSound]);

  const handleOpenBadge = (badge: Badge) => {
    setSelectedBadge(badge);
    playSound("success");
  };

  // Check if a badge is new
  const isNewBadge = (badge: Badge): boolean => {
    return newBadgeIds.includes(badge.id);
  };

  // Handle badge image rendering based on URL type
  const renderBadgeImage = (badge: Badge, large = false) => {
    const url = badge.badge_image_url;
    const size = large ? "h-40 w-40" : "h-16 w-16";
    
    if (!url) {
      return <Award className={large ? "w-20 h-20 text-neon-pink" : "w-10 h-10 text-neon-pink"} />;
    }
    
    if (isLottieAnimation(url)) {
      // Render Lottie animation
      return (
        <Player 
          src={url}
          className={`w-full h-full object-contain`}
          autoplay
          loop
          rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
        />
      );
    } else if (isImageFile(url)) {
      // Render static image (SVG/PNG/JPG)
      return (
        <img 
          src={url}
          alt={badge.badge_name}
          className="w-full h-full object-contain transition-transform hover:scale-110"
          onError={(e) => {
            // If image fails to load, fallback to Award icon
            console.log(`Failed to load image: ${url}, falling back to default`);
            const target = e.target as HTMLImageElement;
            const fallbackUrl = getFallbackBadgeUrl(badge.missions?.type);
            
            // Only try fallback once to avoid loops
            if (!target.src.includes(fallbackUrl)) {
              target.src = fallbackUrl;
            } else {
              // If fallback also fails, use null to trigger Award icon
              target.src = "";
              target.style.display = "none";
              target.parentElement?.classList.add("fallback-badge");
            }
          }}
        />
      );
    }
    
    // Default icon if URL is invalid or not recognized
    return <Award className={large ? "w-20 h-20 text-neon-pink" : "w-10 h-10 text-neon-pink"} />;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {badges.map((badge) => (
            <motion.div 
              key={badge.id}
              initial={{ opacity: 0, y: 20, scale: isNewBadge(badge) ? 0.5 : 1 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                boxShadow: isNewBadge(badge) ? "0 0 15px 5px rgba(156, 39, 176, 0.7)" : "none"
              }}
              transition={{ 
                duration: isNewBadge(badge) ? 0.8 : 0.3,
                type: isNewBadge(badge) ? "spring" : "tween",
                bounce: isNewBadge(badge) ? 0.5 : 0
              }}
              onClick={() => handleOpenBadge(badge)}
              className="cursor-pointer relative"
            >
              {isNewBadge(badge) && (
                <motion.div 
                  className="absolute -top-2 -right-2 z-10 bg-neon-pink text-white text-xs rounded-full px-2 py-1 font-bold"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  NOVO!
                </motion.div>
              )}
              <Card className={`border-galaxy-purple/30 ${
                isNewBadge(badge) 
                  ? 'bg-galaxy-deepPurple/40 border-neon-pink/70' 
                  : 'bg-galaxy-deepPurple/20'
              } hover:bg-galaxy-deepPurple/40 transition-all duration-300 overflow-hidden`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 flex-shrink-0 p-1 bg-galaxy-purple/20 rounded-full flex items-center justify-center fallback-badge-container">
                      {renderBadgeImage(badge)}
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
        </AnimatePresence>
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
              <div className="h-40 w-40 mb-6 flex items-center justify-center bg-galaxy-purple/20 rounded-full p-4 fallback-badge-container">
                {renderBadgeImage(selectedBadge, true)}
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
