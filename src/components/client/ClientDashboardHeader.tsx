
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export interface ClientDashboardHeaderProps {
  title: string;
  description?: string;
  userName: string;
  showBackButton?: boolean;
  backTo?: string;
  onBackClick?: () => void;
  className?: string;
  titleClassName?: string;
}

export const ClientDashboardHeader: FC<ClientDashboardHeaderProps> = ({
  title,
  description,
  userName,
  showBackButton = false,
  backTo = "/",
  onBackClick,
  className = "",
  titleClassName = ""
}) => {
  const navigate = useNavigate();
  
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(backTo);
    }
  };
  
  return (
    <motion.div 
      initial={{
        opacity: 0,
        y: -20
      }} 
      animate={{
        opacity: 1,
        y: 0
      }} 
      className={`relative mb-6 ${className}`}
    >
      <div className="absolute top-0 left-0 w-full h-40 bg-purple-glow opacity-10 blur-3xl -z-10"></div>
      
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {showBackButton && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleBackClick}
              className="mb-4 hover:bg-white/5"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          
          <h1 className={`text-2xl font-bold font-heading ${titleClassName}`}>
            {title}
          </h1>
          
          {description && (
            <p className="text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
        
        <div className="text-right hidden md:block">
          <p className="text-sm text-muted-foreground">
            Bem-vindo(a),
          </p>
          <p className="font-medium">
            {userName}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ClientDashboardHeader;
