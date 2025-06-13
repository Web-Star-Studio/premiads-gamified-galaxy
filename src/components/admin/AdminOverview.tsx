import React from "react";
import { motion } from "framer-motion";
import SystemMetrics from "./dashboard/SystemMetrics";
import AdminActions from "./dashboard/SystemStatus";
import RecentActivities from "./dashboard/RecentActivities";

// Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const AdminOverview = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* KPI Dashboard */}
      <SystemMetrics />

      {/* Admin Actions and Recent Activities Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Admin Actions */}
        <div className="lg:col-span-2">
          <AdminActions />
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-3">
          <RecentActivities />
        </div>
      </div>
    </motion.div>
  );

export default AdminOverview;
