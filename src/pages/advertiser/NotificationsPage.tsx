import React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdvertiserSidebar from "@/components/advertiser/AdvertiserSidebar";
import AdvertiserHeader from "@/components/advertiser/AdvertiserHeader";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, AlertCircle, CheckCircle2, Info, Circle, X } from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { useNotifications } from "@/hooks/useNotifications";

const NotificationsPage = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { userName = "Desenvolvedor" } = useUser();
  const { 
    notifications, 
    loading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    stats 
  } = useNotifications();

  // Ícone com base no tipo de notificação
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info className="h-5 w-5 text-blue-400" />;
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-400" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-400" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      case "activity":
        return <Bell className="h-5 w-5 text-neon-cyan" />;
      default:
        return <Circle className="h-5 w-5" />;
    }
  };

  // Formatar data para o formato brasileiro
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Data indisponível';
    
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <AdvertiserSidebar />
        <SidebarInset className="overflow-y-auto pb-20">
          <AdvertiserHeader
            title="Notificações"
            userName={userName}
            description="Acompanhe suas notificações e alertas do sistema"
          />
          
          <div className="container px-4 pt-20 py-8 mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">Notificações</h1>
                <p className="text-muted-foreground">
                  Acompanhe suas notificações e alertas do sistema. 
                  {stats.unread > 0 && (
                    <span className="ml-2 text-neon-pink font-medium">
                      {stats.unread} não lidas
                    </span>
                  )}
                </p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <Button 
                  variant="outline" 
                  onClick={markAllAsRead} 
                  disabled={stats.unread === 0 || loading}
                >
                  Marcar todas como lidas
                </Button>
              </div>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <div className="w-10 h-10 border-4 border-t-neon-pink border-galaxy-purple rounded-full animate-spin"></div>
              </div>
            ) : notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className={`border ${notification.read ? 'border-galaxy-purple/30 bg-galaxy-darkPurple/50' : 'border-neon-cyan/30 bg-galaxy-darkPurple'}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="mt-1">
                            {getNotificationIcon(notification.type)}
                            {!notification.read && (
                              <span className="block w-2 h-2 bg-neon-pink rounded-full mt-1 mx-auto"></span>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                <h3 className={`font-medium ${notification.read ? 'text-gray-300' : 'text-white'}`}>
                                  {notification.title}
                                </h3>
                                  <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300 capitalize">
                                    {notification.category}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                  {formatDate(notification.created_at)}
                                </p>
                              </div>
                              
                              <div className="flex gap-2 ml-4">
                                {!notification.read && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => markAsRead(notification.id)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span className="sr-only">Marcar como lida</span>
                                  </Button>
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => deleteNotification(notification.id)}
                                  className="h-8 w-8 p-0 text-gray-400 hover:text-red-400"
                                >
                                  <X className="h-4 w-4" />
                                  <span className="sr-only">Excluir</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-galaxy-darkPurple/30 rounded-lg border border-galaxy-purple/20">
                <Bell className="w-12 h-12 mx-auto text-gray-500 mb-4" />
                <h3 className="text-xl font-medium mb-2">Sem notificações</h3>
                <p className="text-muted-foreground">
                  Você não possui notificações no momento.
                </p>
              </div>
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default NotificationsPage;
