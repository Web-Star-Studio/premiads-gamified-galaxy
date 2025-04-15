
import React from "react";
import { motion } from "framer-motion";
import { Users, Shield, Target, Ticket, FileCheck, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSystemMetrics } from "@/hooks/admin/useSystemMetrics";

// Animation variants
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100 }
  }
};

const SystemMetrics = () => {
  const { metrics, loading } = useSystemMetrics();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="border-galaxy-purple/30 bg-galaxy-deepPurple/40 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="h-5 w-24 bg-galaxy-purple/20 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-galaxy-purple/30 rounded animate-pulse mb-2" />
              <div className="h-4 w-32 bg-galaxy-purple/20 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const metricCards = [
    { 
      title: "Total de Usuários", 
      value: metrics.totalUsers, 
      change: "+127 nos últimos 30 dias", 
      icon: Users, 
      iconColor: "text-neon-cyan" 
    },
    { 
      title: "Administradores", 
      value: metrics.administrators, 
      change: "+2 nos últimos 30 dias", 
      icon: Shield, 
      iconColor: "text-neon-pink" 
    },
    { 
      title: "Missões Ativas", 
      value: metrics.activeMissions, 
      change: "+12 nos últimos 7 dias", 
      icon: Target, 
      iconColor: "text-neon-lime" 
    },
    { 
      title: "Sorteios Ativos", 
      value: metrics.activeRaffles, 
      change: "+1 nos últimos 7 dias", 
      icon: Ticket, 
      iconColor: "text-neon-cyan" 
    },
    { 
      title: "Moderações Pendentes", 
      value: metrics.pendingModerations, 
      change: "+8 nas últimas 24 horas", 
      icon: FileCheck, 
      iconColor: "text-neon-pink" 
    },
    { 
      title: "Problemas no Sistema", 
      value: metrics.systemIssues, 
      change: "-2 nas últimas 24 horas", 
      icon: AlertTriangle, 
      iconColor: "text-amber-400" 
    }
  ];

  return (
    <section>
      <h2 className="text-xl font-heading mb-4 neon-text-cyan">Métricas do Sistema</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metricCards.map((card, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="border-galaxy-purple/30 bg-galaxy-deepPurple/40 backdrop-blur-sm hover:bg-galaxy-deepPurple/60 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <card.icon className={`h-5 w-5 ${card.iconColor}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">{card.change}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SystemMetrics;
