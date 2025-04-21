import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Ticket, Award, TrendingUp, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  variant?: 'blue' | 'purple' | 'pink' | 'green';
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  variant = 'blue',
  delay = 0
}) => {
  const gradients = {
    blue: 'from-neon-cyan to-galaxy-blue',
    purple: 'from-galaxy-purple to-galaxy-blue',
    pink: 'from-neon-pink to-galaxy-purple',
    green: 'from-neon-lime to-neon-cyan'
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card variant="glass" className="relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r" 
          style={{ backgroundImage: `linear-gradient(to right, var(--gradient-start), var(--gradient-end))` }}
        />
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm mb-1">{title}</p>
              <h3 className="text-2xl font-bold font-heading">
                {value}
              </h3>
              {trend !== undefined && (
                <div className={cn(
                  "flex items-center text-xs mt-1",
                  trend >= 0 ? "text-neon-lime" : "text-neon-red"
                )}>
                  <TrendingUp className={cn(
                    "w-3 h-3 mr-1",
                    trend < 0 && "transform rotate-180"
                  )} />
                  <span>{Math.abs(trend)}% em relação ao mês anterior</span>
                </div>
              )}
            </div>
            <div
              className={cn(
                "p-3 rounded-lg bg-gradient-to-br", 
                gradients[variant]
              )}
            >
              {icon}
            </div>
          </div>
        </div>
        
        {/* Animated gradient on hover */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300" 
          style={{ 
            background: `linear-gradient(135deg, var(--gradient-start), var(--gradient-end))`,
            '--gradient-start': variant === 'blue' ? '#2F80ED' : 
                              variant === 'purple' ? '#9B53FF' : 
                              variant === 'pink' ? '#FF4ECD' : 
                              '#00C48C',
            '--gradient-end': variant === 'blue' ? '#2F80ED80' : 
                            variant === 'purple' ? '#9B53FF80' : 
                            variant === 'pink' ? '#FF4ECD80' : 
                            '#00C48C80',
          } as React.CSSProperties}
        />
      </Card>
    </motion.div>
  );
};

interface DashboardStatsProps {
  tickets: number;
  points: number;
  referrals: number;
  level: string;
  ticketsTrend?: number;
  pointsTrend?: number;
  referralsTrend?: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  tickets,
  points,
  referrals,
  level,
  ticketsTrend,
  pointsTrend,
  referralsTrend
}) => {
  const statCards = [
    {
      title: "Tickets",
      value: tickets,
      icon: <Ticket className="w-5 h-5 text-white" />,
      trend: ticketsTrend,
      variant: "blue" as const,
      delay: 0.1,
    },
    {
      title: "Pontos",
      value: points.toLocaleString('pt-BR'),
      icon: <Award className="w-5 h-5 text-white" />,
      trend: pointsTrend,
      variant: "purple" as const,
      delay: 0.2,
    },
    {
      title: "Convites",
      value: referrals,
      icon: <Users className="w-5 h-5 text-white" />,
      trend: referralsTrend,
      variant: "pink" as const,
      delay: 0.3,
    },
    {
      title: "Nível",
      value: level,
      icon: <TrendingUp className="w-5 h-5 text-white" />,
      variant: "green" as const,
      delay: 0.4,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          trend={stat.trend}
          variant={stat.variant}
          delay={stat.delay}
        />
      ))}
    </div>
  );
};

export default DashboardStats;
