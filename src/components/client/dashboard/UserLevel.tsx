
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Gift, Zap } from 'lucide-react';
import { UserLevelInfo } from '@/types/levels';

interface UserLevelProps {
  levelInfo: UserLevelInfo;
}

const UserLevel: React.FC<UserLevelProps> = ({ levelInfo }) => {
  const { currentLevel, nextLevel, progress, pointsToNext } = levelInfo;

  const getLevelIcon = (level: number) => {
    switch (level) {
      case 1: return "🌱";
      case 2: return "🔍";
      case 3: return "⚡";
      case 4: return "🏆";
      case 5: return "👑";
      case 6: return "🌟";
      default: return "⭐";
    }
  };

  const getMultiplierText = (multiplier?: number) => {
    if (!multiplier || multiplier === 1) return "";
    return `${multiplier}x`;
  };

  const getBenefitIcon = (benefit: string) => {
    if (benefit.includes('cashback') || benefit.includes('Cashback')) return <Gift className="w-3 h-3" />;
    if (benefit.includes('streak') || benefit.includes('Streak')) return <Zap className="w-3 h-3" />;
    if (benefit.includes('premium') || benefit.includes('Premium')) return <Star className="w-3 h-3" />;
    return <Trophy className="w-3 h-3" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="glass-panel border-galaxy-purple/30 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
                style={{ 
                  backgroundColor: `${currentLevel.color}20`,
                  border: `2px solid ${currentLevel.color}`,
                  color: currentLevel.color
                }}
              >
                {getLevelIcon(currentLevel.level)}
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">{currentLevel.name}</h3>
                <p className="text-xs text-gray-400">
                  Nível {currentLevel.level}
                  {currentLevel.points_multiplier && currentLevel.points_multiplier > 1 && (
                    <span className="ml-1 text-neon-cyan">
                      • {getMultiplierText(currentLevel.points_multiplier)} multiplicador
                    </span>
                  )}
                </p>
              </div>
            </div>
            
            <Badge 
              variant="secondary"
              className="text-xs"
              style={{ 
                backgroundColor: `${currentLevel.color}20`,
                color: currentLevel.color,
                borderColor: currentLevel.color
              }}
            >
              Ativo
            </Badge>
          </div>

          {currentLevel.description && (
            <p className="text-xs text-gray-300 mb-3 leading-relaxed">
              {currentLevel.description}
            </p>
          )}

          {nextLevel ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">
                  Progresso para {nextLevel.name}
                </span>
                <span className="font-medium text-neon-cyan">
                  {pointsToNext} pontos restantes
                </span>
              </div>
              
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Progress 
                  value={progress} 
                  className="h-2 bg-galaxy-deepPurple/50"
                  indicatorClassName="bg-gradient-to-r from-[#8A2387] via-[#E94057] to-[#F27121]"
                />
              </motion.div>
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>{currentLevel.name}</span>
                <span>{nextLevel.name}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-2 px-3 bg-galaxy-deepPurple/50 rounded-md border border-neon-pink/30">
              <span className="text-sm text-neon-pink font-medium">🎉 Nível máximo atingido!</span>
            </div>
          )}

          {/* Benefits Section */}
          {currentLevel.benefits && currentLevel.benefits.length > 0 && (
            <div className="mt-4 pt-3 border-t border-galaxy-purple/30">
              <h4 className="text-xs font-medium text-gray-300 mb-2 flex items-center">
                <Gift className="w-3 h-3 mr-1" />
                Benefícios Ativos
              </h4>
              <div className="space-y-1">
                {currentLevel.benefits.slice(0, 2).map((benefit, index) => (
                  <div key={index} className="flex items-center text-xs text-gray-400">
                    {getBenefitIcon(benefit)}
                    <span className="ml-2">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Level Preview */}
          {nextLevel && nextLevel.benefits && nextLevel.benefits.length > 0 && (
            <div className="mt-3 pt-3 border-t border-galaxy-purple/20">
              <h4 className="text-xs font-medium text-gray-400 mb-2 flex items-center">
                <Star className="w-3 h-3 mr-1" />
                Próximos Benefícios
              </h4>
              <div className="space-y-1">
                {nextLevel.benefits.slice(0, 2).map((benefit, index) => (
                  <div key={index} className="flex items-center text-xs text-gray-500">
                    {getBenefitIcon(benefit)}
                    <span className="ml-2">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UserLevel;
