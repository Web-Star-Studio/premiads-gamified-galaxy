
import { motion } from "framer-motion";
import DailyChallenge from "@/components/dashboard/DailyChallenge";
import SorteDoDia from "@/components/dashboard/SorteDoDia";
import ReferralProgram from "@/components/client/ReferralProgram";

const SidePanel = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="lg:col-span-1"
    >
      <div className="grid gap-6">
        <DailyChallenge />
        <SorteDoDia />
        <ReferralProgram />
      </div>
    </motion.div>
  );

export default SidePanel;
