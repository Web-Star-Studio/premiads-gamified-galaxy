
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import PointsCard from "@/components/dashboard/PointsCard";
import MissionsCarousel from "@/components/dashboard/MissionsCarousel";
import ActiveMissions from "@/components/dashboard/ActiveMissions";
import DailyChallenge from "@/components/dashboard/DailyChallenge";
import LootBoxes from "@/components/dashboard/LootBoxes";
import { useSounds } from "@/hooks/use-sounds";

const ClientDashboard = () => {
  const { userName, userType } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { playSound } = useSounds();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if user is not a participant
    if (userType !== "participante") {
      toast({
        title: "Acesso restrito",
        description: "Você não tem permissão para acessar esta página",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    // Simulate loading
    const loadTimer = setTimeout(() => {
      setLoading(false);
      // Play welcome sound when dashboard loads
      playSound("chime");
      
      // Check if user has been inactive
      const lastActivity = localStorage.getItem("lastActivity");
      if (lastActivity && Date.now() - parseInt(lastActivity) > 86400000) {
        toast({
          title: "Streak em risco!",
          description: "Você está há mais de 24h sem atividade. Complete uma missão hoje!",
        });
      }
      
      // Update last activity
      localStorage.setItem("lastActivity", Date.now().toString());
    }, 1500);

    return () => clearTimeout(loadTimer);
  }, [userType, navigate, toast, playSound]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-galaxy-dark">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-t-neon-cyan border-galaxy-purple rounded-full animate-spin"></div>
          <h2 className="text-xl font-heading neon-text-cyan">Carregando seu universo...</h2>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-galaxy-dark pb-20">
      <div className="container px-4 py-8 mx-auto">
        <DashboardHeader userName={userName} streak={3} />
        
        <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <PointsCard points={750} level={4} progress={65} />
          </motion.div>
          
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
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="grid gap-6">
              <DailyChallenge />
              <LootBoxes count={3} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
