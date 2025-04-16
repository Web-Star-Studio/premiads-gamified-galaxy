
import React from "react";
import { motion } from "framer-motion";
import { UserLevelInfo } from "@/types/levels";
import { Award, ChevronRight, Gift, Star, Clock, Diamond, Crown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface UserLevelProps {
  levelInfo: UserLevelInfo;
}

const LevelIcon = ({ iconName, color }: { iconName: string; color: string }) => {
  const iconStyle = { color };
  
  switch (iconName) {
    case 'award':
      return <Award className="w-5 h-5" style={iconStyle} />;
    case 'award-trophy':
      return <Award className="w-5 h-5" style={iconStyle} />;
    case 'crown':
      return <Crown className="w-5 h-5" style={iconStyle} />;
    case 'diamond':
      return <Diamond className="w-5 h-5" style={iconStyle} />;
    case 'crown-jewel':
      return <Crown className="w-5 h-5" style={iconStyle} />;
    default:
      return <Star className="w-5 h-5" style={iconStyle} />;
  }
};

const BenefitIcon = ({ type, active }: { type: string; active: boolean }) => {
  const iconColor = active ? "text-neon-lime" : "text-gray-500";
  
  switch (type) {
    case "ticket_discount":
      return <Gift className={`w-4 h-4 ${iconColor}`} />;
    case "priority_support":
      return <Award className={`w-4 h-4 ${iconColor}`} />;
    case "early_access":
      return <Clock className={`w-4 h-4 ${iconColor}`} />;
    case "access_to_exclusive_raffles":
      return <Star className={`w-4 h-4 ${iconColor}`} />;
    default:
      return <Star className={`w-4 h-4 ${iconColor}`} />;
  }
};

const UserLevel = ({ levelInfo }: UserLevelProps) => {
  const { currentLevel, nextLevel, progress, pointsToNextLevel } = levelInfo;
  
  return (
    <motion.div
      className="glass-panel p-4 overflow-hidden relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-purple-glow opacity-20 -z-10 animate-float"></div>
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <LevelIcon iconName={currentLevel.icon} color={currentLevel.color} />
          <h3 className="font-bold text-lg" style={{ color: currentLevel.color }}>
            {currentLevel.name}
          </h3>
        </div>
        <div className="text-sm text-neon-cyan">
          {currentLevel.points_multiplier}x pontos
        </div>
      </div>
      
      <p className="text-sm text-gray-400 mb-3">
        {currentLevel.description}
      </p>
      
      {nextLevel && (
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Progresso para {nextLevel.name}</span>
            <span className="text-neon-cyan">{progress}%</span>
          </div>
          <div className="bg-galaxy-deepPurple/50 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full" 
              style={{ 
                width: `${progress}%`,
                backgroundColor: nextLevel.color,
                boxShadow: `0 0 8px ${nextLevel.color}`
              }}
            ></div>
          </div>
          <div className="text-right text-xs text-gray-500 mt-1">
            Faltam {pointsToNextLevel} pontos
          </div>
        </div>
      )}
      
      <div className="border-t border-galaxy-purple/20 pt-3 mt-2">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Benefícios do nível:</h4>
        <div className="grid grid-cols-2 gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <BenefitIcon 
                    type="ticket_discount" 
                    active={currentLevel.benefits.ticket_discount > 0}
                  />
                  <span className="text-xs">
                    {currentLevel.benefits.ticket_discount}% desconto
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Desconto na compra de tickets</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <BenefitIcon 
                    type="access_to_exclusive_raffles" 
                    active={currentLevel.benefits.access_to_exclusive_raffles}
                  />
                  <span className="text-xs">
                    Sorteios exclusivos
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Acesso a sorteios exclusivos para seu nível</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <BenefitIcon 
                    type="priority_support" 
                    active={currentLevel.benefits.priority_support}
                  />
                  <span className="text-xs">
                    Suporte prioritário
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Atendimento prioritário da equipe de suporte</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <BenefitIcon 
                    type="early_access" 
                    active={currentLevel.benefits.early_access}
                  />
                  <span className="text-xs">
                    Acesso antecipado
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Acesso antecipado a novos recursos e promoções</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </motion.div>
  );
};

export default UserLevel;
