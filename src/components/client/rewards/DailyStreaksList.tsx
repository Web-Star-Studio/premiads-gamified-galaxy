
import { motion } from "framer-motion";
import { Calendar, Clock3, Award, Fire, Gem } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface DailyStreak {
  id: string;
  current_streak: number;
  max_streak: number;
  last_completion_date: string;
  mission_id: string;
  missions: {
    title: string;
    points: number;
    streak_multiplier: number;
  };
}

interface DailyStreaksListProps {
  streaks: DailyStreak[];
}

const DailyStreaksList: React.FC<DailyStreaksListProps> = ({ streaks }) => {
  // Calculate if a streak is active or expired (more than 24 hours since last completion)
  const isStreakActive = (lastCompletion: string): boolean => {
    const lastCompletionDate = new Date(lastCompletion);
    const now = new Date();
    const diffHours = (now.getTime() - lastCompletionDate.getTime()) / (1000 * 60 * 60);
    return diffHours < 48; // Consider active if less than 48 hours
  };

  // Calculate potential bonus for next completion
  const getNextBonus = (streak: DailyStreak): number => {
    const basePoints = streak.missions.points;
    const multiplier = streak.missions.streak_multiplier || 1.2;
    const nextStreak = streak.current_streak + 1;
    return Math.floor(basePoints * (multiplier - 1) * nextStreak);
  };

  // Format date in a readable way, with relative time
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours} hora${diffHours !== 1 ? 's' : ''} atrás`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} dia${diffDays !== 1 ? 's' : ''} atrás`;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {streaks.map((streak) => (
        <motion.div 
          key={streak.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className={`border-galaxy-purple/30 ${
            isStreakActive(streak.last_completion_date) 
              ? 'bg-gradient-to-br from-galaxy-deepPurple/30 to-purple-900/20' 
              : 'bg-galaxy-deepPurple/20'
          }`}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <span>{streak.missions.title}</span>
                    {isStreakActive(streak.last_completion_date) && (
                      <Fire className="h-4 w-4 text-orange-400" />
                    )}
                  </h3>
                  
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex flex-col justify-center items-center bg-galaxy-deepPurple/40 rounded-lg p-3 w-20">
                      <span className="text-2xl font-bold text-white">{streak.current_streak}</span>
                      <span className="text-xs text-gray-400">Atual</span>
                    </div>
                    
                    <div className="flex flex-col justify-center items-center bg-galaxy-deepPurple/40 rounded-lg p-3 w-20">
                      <span className="text-2xl font-bold text-white">{streak.max_streak}</span>
                      <span className="text-xs text-gray-400">Máximo</span>
                    </div>
                    
                    <div className="flex flex-col justify-center items-center bg-galaxy-deepPurple/40 rounded-lg p-3 w-24">
                      <span className="text-xl font-bold text-neon-cyan">+{getNextBonus(streak)}</span>
                      <span className="text-xs text-gray-400">Próximo bônus</span>
                    </div>
                  </div>
                </div>
                
                <div className="h-16 w-16 rounded-full flex items-center justify-center bg-galaxy-deepPurple/40">
                  <Calendar className="h-8 w-8 text-purple-400" />
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Progresso para novo recorde</span>
                  <span className="text-sm text-white">{streak.current_streak}/{streak.max_streak + 1}</span>
                </div>
                <Progress 
                  value={(streak.current_streak / (streak.max_streak + 1)) * 100} 
                  className="h-2 bg-galaxy-deepPurple/40"
                />
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock3 className="h-3 w-3" />
                  <span>Última atividade: {formatDate(streak.last_completion_date)}</span>
                </div>
                
                <div className="flex items-center gap-1 text-xs">
                  <span className={isStreakActive(streak.last_completion_date) ? "text-green-400" : "text-red-400"}>
                    {isStreakActive(streak.last_completion_date) ? "Ativo" : "Inativo"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default DailyStreaksList;
