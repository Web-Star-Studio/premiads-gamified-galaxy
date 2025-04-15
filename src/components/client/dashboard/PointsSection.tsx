
import { motion } from "framer-motion";
import PointsCard from "@/components/dashboard/PointsCard";
import LifetimePoints from "@/components/client/LifetimePoints";
import TicketsButton from "./TicketsButton";

const PointsSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="lg:col-span-1"
    >
      <PointsCard points={750} level={4} progress={65} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6"
      >
        <LifetimePoints totalPoints={1950} rank={42} totalUsers={1250} />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6"
      >
        <TicketsButton />
      </motion.div>
    </motion.div>
  );
};

export default PointsSection;
