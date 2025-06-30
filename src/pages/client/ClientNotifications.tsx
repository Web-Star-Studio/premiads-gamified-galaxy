import React, { useState } from 'react';
import { motion } from "framer-motion";
import ClientHeader from "@/components/client/ClientHeader";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useMediaQuery } from "@/hooks/use-mobile";
import ClientSidebar from "@/components/client/dashboard/ClientSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Gift, Target, AlertTriangle, Info, CheckCircle2, X, Filter, Circle } from "lucide-react";
import { useClientNotifications, type ClientNotificationFilters } from "@/hooks/useClientNotifications";
import { cn } from "@/lib/utils";

const ClientNotifications = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [activeFilter, setActiveFilter] = useState<ClientNotificationFilters>({});
  
  const { 
    notifications, 
    loading, 
    stats,
    error,
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    getRecentRewards,
    getMissionNotifications,
    getAchievementNotifications,
    hasUnread,
    hasRecentActivity
  } = useClientNotifications(activeFilter);

  // Função para obter ícone baseado na categoria
  const getNotificationIcon = (category: string, type: string) => {
    const iconMap = {
      campaign: <Target className="w-5 h-5 text-neon-lime" />,
      submission: type === 'success' ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <AlertTriangle className="w-5 h-5 text-amber-400" />,
      payment: <Gift className="w-5 h-5 text-neon-pink" />,
      achievement: <Circle className="w-5 h-5 text-neon-cyan" />,
      user: <Gift className="w-5 h-5 text-purple-400" />,
      system: <Info className="w-5 h-5 text-blue-400" />,
      security: <AlertTriangle className="w-5 h-5 text-red-400" />,
    };
    return iconMap[category as keyof typeof iconMap] || <Bell className="w-5 h-5 text-gray-400" />;
  };

  // Função para obter cor do badge baseado no tipo
  const getBadgeVariant = (type: string) => {
    const variants = {
      success: "bg-green-500/20 text-green-400 border-green-500/30",
      error: "bg-red-500/20 text-red-400 border-red-500/30", 
      warning: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      info: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    };
    return variants[type as keyof typeof variants] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  // Função para formatar data
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Data indisponível';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) {
      return 'Agora há pouco';
    } else if (diffHours < 24) {
      return `${diffHours}h atrás`;
    } else if (diffDays < 7) {
      return `${diffDays}d atrás`;
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  };

  // Filtros disponíveis
  const filterOptions = [
    { key: 'all', label: 'Todas', value: {} },
    { key: 'unread', label: 'Não lidas', value: { unreadOnly: true } },
    { key: 'campaign', label: 'Missões', value: { category: 'campaign' as const } },
    { key: 'payment', label: 'Recompensas', value: { category: 'payment' as const } },
    { key: 'achievement', label: 'Conquistas', value: { category: 'achievement' as const } },
  ];

  if (error) {
    return (
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
          <ClientSidebar />
          <SidebarInset className="overflow-y-auto pb-20">
            <ClientHeader />
            <main className="container mx-auto px-4 py-8">
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-6 text-center">
                <p className="text-red-400">Erro ao carregar notificações: {error}</p>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }
  
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <ClientSidebar />
        <SidebarInset className="overflow-y-auto pb-20">
          <ClientHeader />
          <main className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Header com estatísticas */}
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Notificações</h1>
                  <div className="flex gap-4 text-sm text-gray-400">
                    <span>Total: {stats.total}</span>
                    <span>Não lidas: {stats.unread}</span>
                    {hasRecentActivity && <span className="text-neon-lime">Atividade recente: {stats.recentActivity}</span>}
                  </div>
                </div>
                
                {hasUnread && (
                  <Button onClick={markAllAsRead} variant="outline" size="sm">
                    Marcar todas como lidas
                  </Button>
                )}
              </div>

              {/* Filtros */}
              <Card className="bg-galaxy-dark/50 border-galaxy-purple/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filtros
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.map((filter) => (
                      <Button
                        key={filter.key}
                        variant={JSON.stringify(activeFilter) === JSON.stringify(filter.value) ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveFilter(filter.value)}
                      >
                        {filter.label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Lista de notificações */}
              {loading ? (
                <Card className="bg-galaxy-dark/50 border-galaxy-purple/30">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-cyan"></div>
                      <span className="ml-2 text-gray-400">Carregando notificações...</span>
                    </div>
                  </CardContent>
                </Card>
              ) : notifications.length === 0 ? (
                <Card className="bg-galaxy-dark/50 border-galaxy-purple/30">
                  <CardContent className="p-6">
                    <div className="text-center py-8">
                      <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 text-lg">
                        {Object.keys(activeFilter).length > 0 
                          ? 'Nenhuma notificação encontrada com os filtros aplicados.' 
                          : 'Nenhuma notificação no momento.'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <Card 
                      key={notification.id} 
                      className={cn(
                        "bg-galaxy-dark/50 border-galaxy-purple/30 transition-all duration-200 hover:border-galaxy-purple/50",
                        !notification.read && "border-neon-cyan/50 bg-neon-cyan/5"
                      )}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="mt-1">
                            {getNotificationIcon(notification.category, notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-white">{notification.title}</h3>
                                  <Badge className={getBadgeVariant(notification.type)}>
                                    {notification.type}
                                  </Badge>
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></div>
                                  )}
                                </div>
                                <p className="text-gray-300 text-sm mb-2">{notification.message}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span>{formatDate(notification.created_at)}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {notification.category}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="flex gap-2">
                                {!notification.read && (
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => markAsRead(notification.id)}
                                    className="text-neon-cyan hover:text-neon-cyan/80"
                                  >
                                    Marcar como lida
                                  </Button>
                                )}
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => deleteNotification(notification.id)}
                                  className="text-gray-400 hover:text-red-400"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Resumo de atividades recentes */}
              {hasRecentActivity && (
                <Card className="bg-galaxy-dark/50 border-galaxy-purple/30">
                  <CardHeader>
                    <CardTitle className="text-neon-lime">Atividade Recente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-neon-pink">{getRecentRewards().length}</div>
                        <div className="text-sm text-gray-400">Recompensas esta semana</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-neon-lime">{getMissionNotifications().length}</div>
                        <div className="text-sm text-gray-400">Missões</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-neon-cyan">{getAchievementNotifications().length}</div>
                        <div className="text-sm text-gray-400">Conquistas</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ClientNotifications;
