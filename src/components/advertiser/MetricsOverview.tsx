
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PieChart, BarChart2, Users, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MetricsOverview = () => {
  const [showNumbers, setShowNumbers] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNumbers(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const metrics = [
    {
      title: "Missões Completadas",
      value: 847,
      change: "+12.5%",
      trend: "up",
      icon: <BarChart2 className="w-6 h-6 text-neon-cyan" />,
    },
    {
      title: "Usuários Ativos",
      value: 324,
      change: "+8.2%",
      trend: "up",
      icon: <Users className="w-6 h-6 text-neon-pink" />,
    },
    {
      title: "ROI Médio",
      value: "3.7x",
      change: "+0.3x",
      trend: "up",
      icon: <TrendingUp className="w-6 h-6 text-neon-cyan" />,
    },
    {
      title: "Tempo Médio",
      value: "12min",
      change: "-2min",
      trend: "down",
      icon: <Clock className="w-6 h-6 text-neon-pink" />,
    },
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold font-heading">Visão Geral</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Últimos 30 dias</span>
          <PieChart className="w-4 h-4" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <Card 
            key={metric.title}
            className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(155,135,245,0.3)]"
          >
            <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              {metric.icon}
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="text-2xl font-bold">
                {showNumbers ? (
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    {metric.value}
                  </motion.span>
                ) : (
                  <span className="opacity-0">0</span>
                )}
              </div>
              <p className={`text-xs ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {metric.change} desde mês passado
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};

export default MetricsOverview;
