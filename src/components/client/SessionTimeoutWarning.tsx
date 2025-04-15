
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Clock, RefreshCw } from "lucide-react";
import { useSounds } from "@/hooks/use-sounds";

interface SessionTimeoutWarningProps {
  timeoutDuration?: number; // in milliseconds, default 30 minutes
  warningTime?: number; // in milliseconds, when to show warning before timeout, default 5 minutes
  onExtend: () => void;
  onTimeout: () => void;
}

const SessionTimeoutWarning = ({
  timeoutDuration = 30 * 60 * 1000, // 30 minutes
  warningTime = 5 * 60 * 1000, // 5 minutes
  onExtend,
  onTimeout,
}: SessionTimeoutWarningProps) => {
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const { playSound } = useSounds();

  useEffect(() => {
    // Update last activity on user interaction
    const updateActivity = () => {
      setLastActivity(Date.now());
      setShowWarning(false);
    };

    // Track user activity
    const events = ["mousedown", "keydown", "touchstart", "scroll"];
    events.forEach(event => {
      window.addEventListener(event, updateActivity);
    });

    // Check for inactivity
    const interval = setInterval(() => {
      const now = Date.now();
      const inactiveTime = now - lastActivity;
      
      // Show warning when approaching timeout
      if (inactiveTime >= timeoutDuration - warningTime && !showWarning) {
        setShowWarning(true);
        playSound("error");
      }
      
      // Calculate time left before timeout
      if (showWarning) {
        const remaining = Math.max(0, timeoutDuration - inactiveTime);
        setTimeLeft(Math.floor(remaining / 1000));
        
        // Timeout
        if (remaining <= 0) {
          onTimeout();
        }
      }
    }, 1000);

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
      clearInterval(interval);
    };
  }, [lastActivity, showWarning, timeoutDuration, warningTime, onTimeout, playSound]);

  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleExtendSession = () => {
    setLastActivity(Date.now());
    setShowWarning(false);
    onExtend();
    playSound("pop");
  };

  return (
    <AnimatePresence>
      {showWarning && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-panel p-4 rounded-lg shadow-glow z-50 max-w-md"
        >
          <div className="flex items-start gap-4">
            <div className="bg-yellow-500/20 p-2 rounded-full">
              <Clock className="h-6 w-6 text-yellow-500" />
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-heading mb-1">Sessão prestes a expirar</h3>
              <p className="text-sm text-gray-400 mb-3">
                Sua sessão expirará em {formatTimeLeft()} devido à inatividade.
              </p>
              
              <Button 
                onClick={handleExtendSession}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Estender sessão
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SessionTimeoutWarning;
