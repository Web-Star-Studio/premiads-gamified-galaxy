import React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Gift, Target, AlertTriangle, Info, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClientNotifications } from "@/hooks/useClientNotifications";
import { Link } from "react-router-dom";

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const { 
    notifications, 
    loading,
    hasUnread,
    markAsRead,
    markAllAsRead 
  } = useClientNotifications({ limit: 5 }); // Apenas as 5 mais recentes para o dropdown
  
  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };
  
  const formatTimeAgo = (dateString: string | null) => {
    if (!dateString) return 'Data indisponível';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) {
      return `${diffMins}m atrás`;
    } else if (diffHours < 24) {
      return `${diffHours}h atrás`;
    } else {
      return `${diffDays}d atrás`;
    }
  };
  
  const getNotificationIcon = (category: string, type: string) => {
    const iconMap = {
      campaign: <Target className="w-5 h-5 text-neon-lime" />,
      submission: type === 'success' ? <CheckCircle className="w-5 h-5 text-green-400" /> : <AlertTriangle className="w-5 h-5 text-amber-400" />,
      payment: <Gift className="w-5 h-5 text-neon-pink" />,
      achievement: <Gift className="w-5 h-5 text-neon-cyan" />,
      user: <Gift className="w-5 h-5 text-purple-400" />,
      system: <Info className="w-5 h-5 text-blue-400" />,
      security: <AlertTriangle className="w-5 h-5 text-red-400" />,
    };
    return iconMap[category as keyof typeof iconMap] || <Bell className="w-5 h-5 text-gray-400" />;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative rounded-full"
        onClick={toggleNotifications}
      >
        <Bell className="w-5 h-5" />
        {hasUnread && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-neon-pink rounded-full animate-pulse"></span>
        )}
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 z-50 w-80 max-h-[70vh] glass-panel rounded-lg shadow-glow mt-2 overflow-hidden"
          >
            <div className="p-4 border-b border-galaxy-purple/20">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-lg">Notificações</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={markAllAsRead}
                      className="text-xs text-neon-cyan hover:text-neon-cyan/80"
                    >
                      Marcar todas
                    </Button>
                  )}
                <span className="text-xs text-gray-400 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                    Tempo real
                </span>
                </div>
              </div>
            </div>
            
            <div className="overflow-y-auto max-h-[50vh]">
              {loading ? (
                <div className="p-6 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-neon-cyan mx-auto mb-2"></div>
                  <p className="text-gray-400 text-sm">Carregando...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <Bell className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400">Sem notificações no momento.</p>
                </div>
              ) : (
                <div>
                  {notifications.map(notification => (
                    <div 
                      key={notification.id}
                      className={`p-4 border-b border-galaxy-purple/10 hover:bg-galaxy-deepPurple/30 transition-colors cursor-pointer ${!notification.read ? 'bg-galaxy-deepPurple/20' : ''}`}
                      onClick={() => !notification.read && markAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        <div className="mt-0.5">
                          {getNotificationIcon(notification.category, notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{notification.title}</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400">{formatTimeAgo(notification.created_at)}</span>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-neon-cyan rounded-full"></div>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-300 mt-1 line-clamp-2">{notification.message}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs px-2 py-1 bg-galaxy-purple/30 rounded-full text-galaxy-purple-light">
                              {notification.category}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              notification.type === 'success' ? 'bg-green-500/20 text-green-400' :
                              notification.type === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                              notification.type === 'error' ? 'bg-red-500/20 text-red-400' :
                              'bg-blue-500/20 text-blue-400'
                            }`}>
                              {notification.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-3 border-t border-galaxy-purple/20">
              <Link to="/cliente/notificacoes">
                <Button variant="ghost" size="sm" className="w-full text-neon-cyan text-sm hover:text-neon-cyan/80">
                Ver todas notificações
              </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
