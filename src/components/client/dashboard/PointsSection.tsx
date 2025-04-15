
import { motion } from "framer-motion";
import PointsCard from "@/components/dashboard/PointsCard";
import TicketsButton from "@/components/client/dashboard/TicketsButton";

interface PointsSectionProps {
  totalPoints?: number;
}

const PointsSection = ({ totalPoints = 0 }: PointsSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="flex flex-col gap-4"
    >
      <PointsCard points={totalPoints} />
      <TicketsButton tickets={Math.floor(totalPoints / 100)} />
    </motion.div>
  );
};

export default PointsSection;
