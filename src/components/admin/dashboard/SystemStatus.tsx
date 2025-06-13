import React from "react";
import { motion } from "framer-motion";
import { Activity, Clock, Users, BarChart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";

// Animation variants
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100 }
  }
};

const AdminActions = () => {
  const { data: metrics, isLoading, error } = useDashboardMetrics();

  if (isLoading) {
    return (
      <Card className="border-galaxy-purple/30 bg-galaxy-deepPurple/40 backdrop-blur-sm h-full">
        <CardContent className="pt-6">
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-32 bg-galaxy-purple/20 rounded animate-pulse" />
                  <div className="h-6 w-24 bg-galaxy-purple/30 rounded-full animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <motion.section variants={itemVariants}>
        <h2 className="text-xl font-heading mb-4 neon-text-pink">Ações Administrativas</h2>
        <Card className="border-galaxy-purple/30 bg-galaxy-deepPurple/40 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="p-4 text-center text-red-400">
              <p>Erro ao carregar métricas administrativas.</p>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    );
  }

  // Get current date
  const today = new Date();
  const day = today.getDate().toString().padStart(2, '0');
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const year = today.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  return (
    <motion.section variants={itemVariants}>
      <h2 className="text-xl font-heading mb-4 neon-text-pink">Ações Administrativas</h2>
      
      <Card className="border-galaxy-purple/30 bg-galaxy-deepPurple/40 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">Data atual</p>
            <p className="text-sm font-medium">{formattedDate}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <Card className="border-galaxy-purple/30 bg-galaxy-deepPurple/40 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Activity className="h-6 w-6 mb-2 text-neon-cyan" />
                  <p className="text-2xl font-bold neon-text-cyan">{metrics.adminActionsToday}</p>
                  <p className="text-sm mt-1">Ações hoje</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-galaxy-purple/30 bg-galaxy-deepPurple/40 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Clock className="h-6 w-6 mb-2 text-neon-pink" />
                  <p className="text-2xl font-bold neon-text-pink">
                    {metrics.missionCompletionRate}%
                  </p>
                  <p className="text-sm mt-1">Taxa de conclusão</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-galaxy-purple/30 bg-galaxy-deepPurple/40 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <BarChart className="h-6 w-6 mb-2 text-neon-lime" />
                  <p className="text-2xl font-bold neon-text-lime">
                    {metrics.userGrowthRate}%
                  </p>
                  <p className="text-sm mt-1">Crescimento mensal</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
};

export default AdminActions;
