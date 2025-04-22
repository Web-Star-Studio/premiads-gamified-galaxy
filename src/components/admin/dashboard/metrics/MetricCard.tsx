
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { LucideIcon, TrendingUp } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: number | null;
  icon: LucideIcon;
  colorClass: string;
  index: number;
}

export const MetricCard = ({ 
  title, 
  value, 
  trend, 
  icon: Icon, 
  colorClass, 
  index 
}: MetricCardProps) => {
  return (
    <motion.div
      key={title}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(155,135,245,0.3)]">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            <Icon className={`h-4 w-4 ${colorClass}`} />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold">{value}</p>
            {trend !== null && (
              <p className={`text-sm ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                <TrendingUp 
                  className={`inline-block h-4 w-4 mr-1 ${trend < 0 ? 'transform rotate-180' : ''}`} 
                />
                {Math.abs(trend)}% em relação ao mês anterior
              </p>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
