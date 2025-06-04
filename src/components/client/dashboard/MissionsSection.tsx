import { motion } from "framer-motion";
import MissionsCarousel from "@/components/dashboard/MissionsCarousel";
import ActiveMissions from "@/components/dashboard/ActiveMissions";
import { useMissions } from "@/hooks/useMissions";

const MissionsSection = () => {
  const { missions, loading, selectedMission, setSelectedMission } = useMissions();

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Carregando missões...</p>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-2"
      >
        <MissionsCarousel 
          missions={missions} 
          onSelectMission={setSelectedMission}
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="lg:col-span-2"
      >
        <ActiveMissions />
      </motion.div>
    </>
  );
};

export default MissionsSection;
