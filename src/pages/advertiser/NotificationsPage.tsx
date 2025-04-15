
import React, { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdvertiserSidebar from "@/components/advertiser/AdvertiserSidebar";
import AdvertiserHeader from "@/components/advertiser/AdvertiserHeader";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, AlertCircle, CheckCircle2, Info, Circle, X } from "lucide-react";
import { useSounds } from "@/hooks/use-sounds";
import { motion } from "framer-motion";

// Interface para as notificações
interface Notification {
  id: number;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  date: string;
  read: boolean;
}

const NotificationsPage = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { playSound } = useSounds();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulação de carregamento de notificações
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications([
        {
          id: 1,
          title: "Aprovação de campanha",
          message: "Sua campanha 'Promoção de Primavera' foi aprovada e está ativa.",
          type: "success",
          date: "15/04/2025 14:30",
          read: false
        },
        {
          id: 2,
          title: "Créditos adicionados",
          message: "200 créditos foram adicionados à sua conta.",
          type: "info",
          date: "14/04/2025 11:20",
          read: false
        },
        {
          id: 3,
          title: "Campanha próxima de expirar",
          message: "Sua campanha 'Descontos Exclusivos' expira em 2 dias.",
          type: "warning",
          date: "13/04/2025 09:45",
          read: true
        },
        {
          id: 4,
          title: "Submissão rejeitada",
          message: "A submissão para a campanha 'Teste Beta' foi rejeitada. Verifique os detalhes.",
          type: "error",
          date: "10/04/2025 16:15",
          read: true
        },
        {
          id: 5,
          title: "Manutenção programada",
          message: "O sistema estará indisponível para manutenção em 20/04/2025 das 02:00 às 04:00.",
          type: "info",
          date: "09/04/2025 10:00",
          read: true
        }
      ]);
      setLoading(false);
      playSound("chime");
    }, 1000);

    return () => clearTimeout(timer);
  }, [playSound]);

  // Marcar notificação como lida
  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    playSound("pop");
  };

  // Excluir notificação
  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    playSound("error");
  };

  // Marcar todas como lidas
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    playSound("chime");
  };

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
      default:
        return <Circle className="h-5 w-5" />;
    }
  };

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <AdvertiserSidebar />
        <SidebarInset className="overflow-y-auto pb-20">
          <AdvertiserHeader />
          
          <div className="container px-4 pt-20 py-8 mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">Notificações</h1>
                <p className="text-muted-foreground">Acompanhe suas notificações e alertas do sistema.</p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <Button 
                  variant="outline" 
                  onClick={markAllAsRead} 
                  disabled={notifications.every(n => n.read) || loading}
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
                                <h3 className={`font-medium ${notification.read ? 'text-gray-300' : 'text-white'}`}>
                                  {notification.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                  {notification.date}
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
