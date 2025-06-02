
import { motion } from "framer-motion";
import MissionsCarousel from "@/components/dashboard/MissionsCarousel";
import ActiveMissions from "@/components/dashboard/ActiveMissions";

const MissionsSection = () => (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-2"
      >
        <MissionsCarousel />
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

export default MissionsSection;
