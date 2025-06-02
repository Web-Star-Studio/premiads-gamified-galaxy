
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Clock, CheckCircle, AlertTriangle, Gift, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSounds } from "@/hooks/use-sounds";

type NotificationType = "mission" | "reward" | "alert" | "system";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string; // ISO string
  read: boolean;
}

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "mission",
    title: "Nova Missão Disponível",
    message: "Pesquisa de satisfação da marca XYZ disponível! Complete e ganhe 50 tickets.",
    time: "2025-04-15T10:30:00Z",
    read: false
  },
  {
    id: "2",
    type: "reward",
    title: "Pontos Adicionados",
    message: "Parabéns! Você ganhou 150 tickets pela missão completada.",
    time: "2025-04-14T15:45:00Z",
    read: false
  },
  {
    id: "3",
    type: "alert",
    title: "Ticket Expirando",
    message: "Seu ticket para o sorteio irá expirar em 2 dias. Não perca a chance!",
    time: "2025-04-14T09:20:00Z",
    read: true
  },
  {
    id: "4",
    type: "system",
    title: "Manutenção Programada",
    message: "Haverá uma breve manutenção no sistema em 18/04 às 03:00.",
    time: "2025-04-13T11:15:00Z",
    read: true
  },
  {
    id: "5",
    type: "reward",
    title: "Novo Sorteio Disponível",
    message: "Um novo sorteio foi aberto! Use seus tickets para participar.",
    time: "2025-04-12T14:30:00Z",
    read: true
  }
];

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const { playSound } = useSounds();
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const toggleNotifications = () => {
    setIsOpen(!isOpen);
    playSound("pop");
    if (!isOpen && unreadCount > 0) {
      // Mark all as read when opening
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    }
  };
  
  const formatTimeAgo = (dateString: string) => {
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
  
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "mission":
        return <CheckCircle className="w-5 h-5 text-neon-lime" />;
      case "reward":
        return <Gift className="w-5 h-5 text-neon-pink" />;
      case "alert":
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case "system":
        return <Star className="w-5 h-5 text-neon-cyan" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative rounded-full"
        onClick={toggleNotifications}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-neon-pink rounded-full"></span>
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
                <span className="text-xs text-gray-400 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  Atualizadas agora
                </span>
              </div>
            </div>
            
            <div className="overflow-y-auto max-h-[50vh]">
              {notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-400">Sem notificações no momento.</p>
                </div>
              ) : (
                <div>
                  {notifications.map(notification => (
                    <div 
                      key={notification.id}
                      className={`p-4 border-b border-galaxy-purple/10 hover:bg-galaxy-deepPurple/30 transition-colors ${!notification.read ? 'bg-galaxy-deepPurple/20' : ''}`}
                    >
                      <div className="flex gap-3">
                        <div className="mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{notification.title}</h4>
                            <span className="text-xs text-gray-400">{formatTimeAgo(notification.time)}</span>
                          </div>
                          <p className="text-sm text-gray-300 mt-1">{notification.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-3 border-t border-galaxy-purple/20">
              <Button variant="ghost" size="sm" className="w-full text-neon-cyan text-sm">
                Ver todas notificações
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
