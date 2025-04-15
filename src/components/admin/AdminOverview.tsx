import React from "react";
import { motion } from "framer-motion";
import { 
  Users, Shield, Target, Ticket, FileCheck, AlertTriangle,
  Database, Server, HardDrive, ArrowDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

// Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100 }
  }
};

const AdminOverview = () => {
  // Mock data for KPIs
  const kpiData = {
    totalUsers: 3478,
    administrators: 12,
    activeMissions: 87,
    activeRaffles: 5,
    pendingModerations: 34,
    systemIssues: 3
  };

  // Mock data for system status
  const systemStatus = [
    { name: "API Status", status: "Operacional", performance: 98, icon: Server },
    { name: "Database Status", status: "Operacional", performance: 99, icon: Database },
    { name: "File Server Status", status: "Operacional", performance: 97, icon: HardDrive },
    { name: "Backup Service Status", status: "Alerta", performance: 85, icon: ArrowDown }
  ];

  // Mock data for recent activities
  const recentActivities = [
    { 
      id: 1, 
      event: "Novo administrador adicionado", 
      user: "Carlos Silva", 
      timestamp: "Há 10 minutos",
      type: "user"
    },
    { 
      id: 2, 
      event: "Alteração de permissões", 
      user: "Maria Oliveira", 
      timestamp: "Há 45 minutos",
      type: "permission"
    },
    { 
      id: 3, 
      event: "Novo sorteio criado", 
      user: "João Pereira", 
      timestamp: "Há 2 horas",
      type: "raffle"
    },
    { 
      id: 4, 
      event: "Submissão aprovada", 
      user: "Ana Santos", 
      timestamp: "Há 3 horas",
      type: "moderation"
    },
    { 
      id: 5, 
      event: "Alerta de sistema", 
      user: "Sistema", 
      timestamp: "Há 5 horas",
      type: "system"
    }
  ];

  // Get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch(type) {
      case "user":
        return <Users size={16} className="text-neon-cyan" />;
      case "permission":
        return <Shield size={16} className="text-neon-pink" />;
      case "raffle":
        return <Ticket size={16} className="text-neon-lime" />;
      case "moderation":
        return <FileCheck size={16} className="text-purple-400" />;
      case "system":
        return <AlertTriangle size={16} className="text-amber-400" />;
      default:
        return <Shield size={16} />;
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* KPI Dashboard */}
      <section>
        <h2 className="text-xl font-heading mb-4 neon-text-cyan">Métricas do Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <motion.div variants={itemVariants}>
            <Card className="border-galaxy-purple/30 bg-galaxy-deepPurple/40 backdrop-blur-sm hover:bg-galaxy-deepPurple/60 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                <Users className="h-5 w-5 text-neon-cyan" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpiData.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">+127 nos últimos 30 dias</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-galaxy-purple/30 bg-galaxy-deepPurple/40 backdrop-blur-sm hover:bg-galaxy-deepPurple/60 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Administradores</CardTitle>
                <Shield className="h-5 w-5 text-neon-pink" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpiData.administrators}</div>
                <p className="text-xs text-muted-foreground mt-1">+2 nos últimos 30 dias</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-galaxy-purple/30 bg-galaxy-deepPurple/40 backdrop-blur-sm hover:bg-galaxy-deepPurple/60 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Missões Ativas</CardTitle>
                <Target className="h-5 w-5 text-neon-lime" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpiData.activeMissions}</div>
                <p className="text-xs text-muted-foreground mt-1">+12 nos últimos 7 dias</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-galaxy-purple/30 bg-galaxy-deepPurple/40 backdrop-blur-sm hover:bg-galaxy-deepPurple/60 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Sorteios Ativos</CardTitle>
                <Ticket className="h-5 w-5 text-neon-cyan" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpiData.activeRaffles}</div>
                <p className="text-xs text-muted-foreground mt-1">+1 nos últimos 7 dias</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-galaxy-purple/30 bg-galaxy-deepPurple/40 backdrop-blur-sm hover:bg-galaxy-deepPurple/60 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Moderações Pendentes</CardTitle>
                <FileCheck className="h-5 w-5 text-neon-pink" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpiData.pendingModerations}</div>
                <p className="text-xs text-muted-foreground mt-1">+8 nas últimas 24 horas</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-galaxy-purple/30 bg-galaxy-deepPurple/40 backdrop-blur-sm hover:bg-galaxy-deepPurple/60 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Problemas no Sistema</CardTitle>
                <AlertTriangle className="h-5 w-5 text-amber-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpiData.systemIssues}</div>
                <p className="text-xs text-muted-foreground mt-1">-2 nas últimas 24 horas</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* System Status and Recent Activities Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* System Status */}
        <motion.section 
          variants={itemVariants}
          className="lg:col-span-2"
        >
          <h2 className="text-xl font-heading mb-4 neon-text-cyan">Status do Sistema</h2>
          <Card className="border-galaxy-purple/30 bg-galaxy-deepPurple/40 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="space-y-6">
                {systemStatus.map((service, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <service.icon className="h-4 w-4 mr-2 text-neon-cyan" />
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
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Recent Activities */}
        <motion.section 
          variants={itemVariants}
          className="lg:col-span-3"
        >
          <h2 className="text-xl font-heading mb-4 neon-text-cyan">Atividades Recentes</h2>
          <Card className="border-galaxy-purple/30 bg-galaxy-deepPurple/40 backdrop-blur-sm">
            <CardContent className="pt-6 relative">
              <div className="absolute top-0 left-7 bottom-0 w-px bg-galaxy-purple/30 z-0"></div>
              
              <div className="space-y-8 relative z-10">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex gap-4">
                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-galaxy-purple bg-galaxy-deepPurple">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <p className="text-sm font-medium">{activity.event}</p>
                        <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">por {activity.user}</p>
                    </div>
                  </div>
                ))}
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
      </div>
    </motion.div>
  );
};

export default AdminOverview;
