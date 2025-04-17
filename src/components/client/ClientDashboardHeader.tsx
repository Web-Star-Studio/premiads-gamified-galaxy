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
  return <motion.div initial={{
    opacity: 0,
    y: -20
  }} animate={{
    opacity: 1,
    y: 0
  }} className={`relative ${className}`}>
      <div className="absolute top-0 left-0 w-full h-40 bg-purple-glow opacity-10 blur-3xl -z-10"></div>
      
      <div className="flex items-center justify-between">
        
        
        <div className="text-right hidden md:block">
          
          
        </div>
      </div>
    </motion.div>;
};
export default ClientDashboardHeader;