
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ChevronRight, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const ProfileCompletionBanner = () => {
  const navigate = useNavigate();
  const [isProfileCompleted, setIsProfileCompleted] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProfileCompletion = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const userId = session.user.id;
          
          // Check if user has completed profile
          const { data, error } = await supabase
            .from('profiles')
            .select('profile_completed')
            .eq('id', userId)
            .single();
          
          if (error) throw error;
          
          setIsProfileCompleted(data?.profile_completed || false);
        } else {
          // For testing purposes when not logged in
          console.log("No authenticated session - using test mode");
          setIsProfileCompleted(false); // Assume not completed in test mode
        }
      } catch (error) {
        console.error("Error checking profile completion:", error);
        setIsProfileCompleted(false); // Default to false on error
      } finally {
        setLoading(false);
      }
    };
    
    checkProfileCompletion();
  }, []);

  // Don't show when still loading or if profile is completed
  if (loading || isProfileCompleted) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-panel p-4 sm:p-6 mb-6 border-l-4 border-neon-cyan"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neon-cyan/20 flex items-center justify-center">
            <UserCircle className="w-6 h-6 text-neon-cyan" />
          </div>
          <div>
            <h3 className="font-heading text-base sm:text-lg">Complete seu perfil e ganhe 10 pontos!</h3>
            <p className="text-sm text-gray-400">Responda algumas perguntas para personalizar sua experiência</p>
          </div>
        </div>
        
        <Button 
          onClick={() => navigate("/cliente/perfil")} 
          variant="outline" 
          size="sm"
          className="hidden sm:flex items-center gap-1 border-neon-cyan/30 hover:bg-neon-cyan/10"
        >
          <span>Completar</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      
      <Button 
        onClick={() => navigate("/cliente/perfil")} 
        variant="outline" 
        className="w-full mt-4 sm:hidden border-neon-cyan/30 hover:bg-neon-cyan/10"
      >
        Completar Perfil
      </Button>
    </motion.div>
  );
};

export default ProfileCompletionBanner;
