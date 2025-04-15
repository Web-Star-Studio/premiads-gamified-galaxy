
import { motion } from "framer-motion";
import PointsCard from "@/components/dashboard/PointsCard";
import TicketsButton from "@/components/client/dashboard/TicketsButton";
import { useClientDashboard } from "@/hooks/useClientDashboard";

interface PointsSectionProps {
  totalPoints?: number;
}

const PointsSection = ({ totalPoints = 0 }: PointsSectionProps) => {
  // Calculate level and progress based on total points
  const level = Math.floor(totalPoints / 1000) + 1;
  const pointsInCurrentLevel = totalPoints % 1000;
  const progress = Math.min(Math.round((pointsInCurrentLevel / 1000) * 100), 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="flex flex-col gap-4"
    >
      <PointsCard points={totalPoints} level={level} progress={progress} />
      <TicketsButton />
    </motion.div>
  );
};

export default PointsSection;
