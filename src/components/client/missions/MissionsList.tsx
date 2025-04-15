
import { motion } from "framer-motion";
import { Mission } from "@/hooks/useMissions";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MissionsListProps {
  missions: Mission[];
  selectedMission: Mission | null;
  onMissionClick: (mission: Mission) => void;
  emptyMessage?: string;
}

const MissionsList = ({
  missions,
  selectedMission,
  onMissionClick,
  emptyMessage = "Nenhuma missão disponível."
}: MissionsListProps) => {
  const staggerChildren = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (missions.length === 0) {
    return (
      <div className="glass-panel p-8 text-center h-full flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-galaxy-deepPurple/50 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-medium-contrast">
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M7 3v18" />
            <path d="M3 7h18" />
          </svg>
        </div>
        <h3 className="text-xl font-heading">Sem Missões</h3>
        <p className="text-medium-contrast mt-2">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-4 md:p-6 h-full overflow-y-auto max-h-[600px] fancy-scrollbar">
      <h3 className="text-lg md:text-xl font-heading mb-4">
        {missions.length} {missions.length === 1 ? 'Missão' : 'Missões'} 
        {missions.length > 0 && ' Disponíveis'}
      </h3>
      
      <motion.div
        className="space-y-2 md:space-y-3"
        variants={staggerChildren}
        initial="hidden"
        animate="show"
      >
        {missions.map((mission) => (
          <motion.div
            key={mission.id}
            variants={childVariants}
            className={cn(
              "p-3 md:p-4 rounded-lg transition-all cursor-pointer flex items-center justify-between",
              selectedMission?.id === mission.id
                ? "bg-galaxy-purple/30 border border-neon-cyan/50"
                : "bg-galaxy-deepPurple/50 hover:bg-galaxy-deepPurple/80 border border-galaxy-purple/20"
            )}
            onClick={() => onMissionClick(mission)}
          >
            <div className="pr-2 flex-1 min-w-0">
              <h4 className="font-medium text-sm md:text-base truncate">{mission.title}</h4>
              <div className="flex items-center mt-1">
                <span className="text-sm md:text-base text-medium-contrast truncate">
                  {mission.brand || 'PremiAds'} • {mission.points} pts
                </span>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-medium-contrast flex-shrink-0" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default MissionsList;
