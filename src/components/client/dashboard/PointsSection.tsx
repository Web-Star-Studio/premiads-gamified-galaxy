
import { motion } from "framer-motion";
import PointsCard from "@/components/dashboard/PointsCard";
import UserLevel from "@/components/client/dashboard/UserLevel";
import TicketsButton from "@/components/client/dashboard/TicketsButton";
import { useNavigate } from "react-router-dom";
import { useClientDashboard } from "@/hooks/useClientDashboard";
import { useUserLevel } from "@/hooks/useUserLevel";

interface PointsSectionProps {
  totalPoints?: number;
}

const PointsSection = ({ totalPoints = 0 }: PointsSectionProps) => {
  const navigate = useNavigate();
  const { points } = useClientDashboard(navigate);
  const effectivePoints = totalPoints || points;
  const { levelInfo, loading } = useUserLevel(effectivePoints);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="flex flex-col gap-4"
    >
      <PointsCard points={effectivePoints} />
      
      {!loading && levelInfo && (
        <UserLevel levelInfo={levelInfo} />
      )}
      
      <TicketsButton />
    </motion.div>
  );
};

export default PointsSection;
