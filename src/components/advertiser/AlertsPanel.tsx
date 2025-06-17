import { motion } from "framer-motion";
import { Bell, DollarSign, TrendingUp, Users, AlertTriangle, X, Activity, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotifications } from "@/hooks/useNotifications";

const AlertsPanel = () => {
  const { notifications, stats, loading, markAsRead, deleteNotification } = useNotifications();

  // Filtrar apenas notificações não lidas para alertas
  const alertNotifications = notifications.filter(notification => !notification.read);

  // Mapear tipos de notificação para ícones e cores
  const getNotificationStyle = (type: string, category: string) => {
    const iconMap = {
      success: <TrendingUp className="w-4 h-4 text-green-400" />,
      error: <AlertTriangle className="w-4 h-4 text-red-400" />,
      warning: <DollarSign className="w-4 h-4 text-yellow-400" />,
      info: <Info className="w-4 h-4 text-blue-400" />,
      activity: <Activity className="w-4 h-4 text-neon-cyan" />
    };

    const colorMap = {
      success: "border-green-500/30 bg-green-500/10 border-l-green-400",
      error: "border-red-500/30 bg-red-500/10 border-l-red-400",
      warning: "border-yellow-500/30 bg-yellow-500/10 border-l-yellow-400",
      info: "border-blue-500/30 bg-blue-500/10 border-l-blue-400",
      activity: "border-neon-cyan/30 bg-neon-cyan/10 border-l-cyan-400"
    };

    // Mapear categorias para ícones específicos se necessário
    if (category === 'payment') {
      return {
        icon: <DollarSign className="w-4 h-4 text-yellow-400" />,
        color: colorMap.warning
      };
    }

    if (category === 'user') {
      return {
        icon: <Users className="w-4 h-4 text-neon-cyan" />,
        color: colorMap.activity
      };
    }

    return {
      icon: iconMap[type as keyof typeof iconMap] || iconMap.info,
      color: colorMap[type as keyof typeof colorMap] || colorMap.info
    };
  };

  // Formatar timestamp relativo
  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return 'Agora';

    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    return `${diffDays}d atrás`;
  };

  const handleDismissAlert = async (notificationId: string) => {
    await markAsRead(notificationId);
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,0,200,0.2)]">
          <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <Bell className="w-5 h-5 text-neon-pink" />
              Alertas Inteligentes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-1">
            <div className="py-10 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-neon-pink border-t-transparent rounded-full mx-auto"></div>
              <p className="text-sm text-gray-400 mt-4">Carregando alertas...</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,0,200,0.2)]">
        <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <Bell className="w-5 h-5 text-neon-pink" />
            Alertas Inteligentes
          </CardTitle>
          <span className="text-sm font-medium px-2 py-1 rounded-full bg-neon-pink/10 text-neon-pink">
            {stats.unread} {stats.unread === 1 ? 'alerta' : 'alertas'}
          </span>
        </CardHeader>
        <CardContent className="p-5 pt-1">
          {alertNotifications.length > 0 ? (
            <div className="space-y-3">
              {alertNotifications.slice(0, 5).map((notification, index) => {
                const style = getNotificationStyle(notification.type, notification.category);
                
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    tabIndex={0}
                    className={`relative p-4 pl-3 border rounded-lg flex items-stretch group ${style.color} border-l-4 transition-shadow focus-within:shadow-[0_0_0_3px_#FF00C8] hover:shadow-[0_0_0_3px_#FF00C8] outline-none`}
                  >
                    <div className="flex gap-3 w-full">
                      <div className="mt-0.5 bg-gray-800/50 p-2 rounded-md">{style.icon}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-medium">{notification.title}</h4>
                          <span className="text-xs text-gray-400 bg-gray-800/30 px-2 py-0.5 rounded-full">
                            {formatTimestamp(notification.created_at)}
                          </span>
                        </div>
                        <p className="text-xs mt-1 leading-relaxed text-gray-300">{notification.message}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDismissAlert(notification.id)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700/50 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                );
              })}
              {alertNotifications.length > 5 && (
                <div className="text-center py-2">
                  <p className="text-xs text-gray-400">
                    +{alertNotifications.length - 5} alertas adicionais
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="py-10 text-center">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-500 opacity-50" />
              <p className="text-sm font-medium text-gray-400">Nenhum alerta ativo no momento</p>
              <p className="text-xs text-gray-500 mt-1">Você será notificado quando houver novidades importantes</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AlertsPanel;
