
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface NotificationBannerProps {
  pendingSubmissions: number;
  onViewClick: () => void;
}

const NotificationBanner = ({ pendingSubmissions, onViewClick }: NotificationBannerProps) => {
  if (pendingSubmissions <= 0) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 p-3 border border-amber-500/30 bg-amber-500/10 rounded-md"
    >
      <p className="text-amber-300 flex items-center text-sm">
        <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-2"></span>
        Você tem {pendingSubmissions} {pendingSubmissions === 1 ? 'submissão' : 'submissões'} pendente{pendingSubmissions === 1 ? '' : 's'} de aprovação.
        <Button 
          variant="link" 
          className="text-amber-300 hover:text-amber-200 p-0 h-auto text-sm ml-2"
          onClick={onViewClick}
        >
          Ver agora
        </Button>
      </p>
    </motion.div>
  );
};

export default NotificationBanner;
