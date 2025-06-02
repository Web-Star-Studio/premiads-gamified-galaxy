
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, ChevronRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClientDashboard } from "@/hooks/useClientDashboard";

const ProfileCompletionBanner = () => {
  const navigate = useNavigate();
  const { isProfileCompleted } = useClientDashboard();
  const [dismissed, setDismissed] = useState(false);

  // Check if the banner was previously dismissed in this session
  const isDismissed = localStorage.getItem("profileBannerDismissed") === "true" || dismissed;

  if (isProfileCompleted || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    localStorage.setItem("profileBannerDismissed", "true");
    setDismissed(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-galaxy-deepPurple/60 border border-galaxy-purple/30 rounded-lg p-4 mt-4"
    >
      <div className="flex items-center gap-3">
        <div className="bg-indigo-800/50 rounded-full p-2">
          <User className="text-indigo-300 w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-lg text-white">Complete seu perfil</h3>
          <p className="text-gray-300 text-sm">
            Preencha seu perfil e ganhe 100 tickets de bônus!
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost" 
            size="sm" 
            className="text-gray-400 hover:text-white"
            onClick={handleDismiss}
          >
            Ignorar
          </Button>
          <Button 
            className="bg-indigo-700 hover:bg-indigo-600 text-white"
            onClick={() => navigate("/cliente/perfil")}
          >
            Completar
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCompletionBanner;
