
import React from "react";
import { motion } from "framer-motion";
import { Player } from "@lottiefiles/react-lottie-player";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Badge } from "@/hooks/cliente/useBadges";

interface BadgeListProps {
  badges: Badge[];
}

export const BadgeList: React.FC<BadgeListProps> = ({ badges }) => {
  // Check if a URL is a Lottie JSON animation
  const isLottieAnimation = (url?: string): boolean => {
    if (!url) return false;
    return url.includes('.json') || url.includes('lottiefiles.com');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {badges.map((badge) => (
        <motion.div 
          key={badge.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-galaxy-purple/30 bg-galaxy-deepPurple/20 hover:bg-galaxy-deepPurple/40 transition-all duration-300 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 flex-shrink-0 rounded-full bg-galaxy-purple/20 flex items-center justify-center overflow-hidden">
                  {badge.badge_image_url ? (
                    isLottieAnimation(badge.badge_image_url) ? (
                      <Player
                        src={badge.badge_image_url}
                        className="h-full w-full"
                        autoplay
                        loop
                      />
                    ) : (
                      <img 
                        src={badge.badge_image_url} 
                        alt={badge.badge_name} 
                        className="h-10 w-10 object-contain"
                      />
                    )
                  ) : (
                    <div className="h-10 w-10 bg-gradient-to-br from-neon-pink to-neon-cyan rounded-full" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-white truncate">
                    {badge.badge_name}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                    {badge.badge_description || ""}
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
  );
};

export default BadgeList;
