
import React from "react";
import { motion } from "framer-motion";
import { Server, Database, HardDrive, ArrowDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useSystemStatus } from "@/hooks/admin/useSystemStatus";

// Animation variants
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100 }
  }
};

const iconMap: Record<string, any> = {
  Server,
  Database,
  HardDrive,
  ArrowDown
};

const SystemStatus = () => {
  const { systemStatus, loading } = useSystemStatus();

  if (loading) {
    return (
      <Card className="border-galaxy-purple/30 bg-galaxy-deepPurple/40 backdrop-blur-sm h-full">
        <CardContent className="pt-6">
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-32 bg-galaxy-purple/20 rounded animate-pulse" />
                  <div className="h-6 w-24 bg-galaxy-purple/30 rounded-full animate-pulse" />
                </div>
                <div className="h-2 bg-galaxy-purple/20 rounded animate-pulse" />
                {i < 3 && <Separator className="my-2 bg-galaxy-purple/20" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.section variants={itemVariants}>
      <h2 className="text-xl font-heading mb-4 neon-text-cyan">Status do Sistema</h2>
      <Card className="border-galaxy-purple/30 bg-galaxy-deepPurple/40 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="space-y-6">
            {systemStatus.map((service, index) => {
              const IconComponent = iconMap[service.icon] || Server;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <IconComponent className="h-4 w-4 mr-2 text-neon-cyan" />
                      <span className="text-sm font-medium">{service.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      service.status === "Operacional" 
                        ? "bg-green-500/20 text-green-400" 
                        : "bg-amber-500/20 text-amber-400"
                    }`}>
                      {service.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={service.performance} className="h-2" />
                    <span className="text-xs text-muted-foreground w-8 text-right">
                      {service.performance}%
                    </span>
                  </div>
                  {index < systemStatus.length - 1 && <Separator className="my-2 bg-galaxy-purple/20" />}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <Card className="border-galaxy-purple/30 bg-galaxy-deepPurple/40 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <p className="text-2xl font-bold neon-text-cyan">97.8%</p>
              <p className="text-sm mt-1">Taxa de sucesso do sistema</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-galaxy-purple/30 bg-galaxy-deepPurple/40 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <p className="text-2xl font-bold neon-text-pink">15m</p>
              <p className="text-sm mt-1">Tempo médio de resposta</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-galaxy-purple/30 bg-galaxy-deepPurple/40 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <p className="text-2xl font-bold neon-text-lime">215</p>
              <p className="text-sm mt-1">Ações administrativas hoje</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.section>
  );
};

export default SystemStatus;
