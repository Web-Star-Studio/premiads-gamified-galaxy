import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, DollarSign, TrendingUp, Users, AlertTriangle, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSounds } from "@/hooks/use-sounds";

const AlertsPanel = () => {
  const { playSound } = useSounds();
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "credit",
      title: "Saldo baixo",
      message: "Seus créditos estão abaixo do limite recomendado (500).",
      timestamp: "Agora",
      icon: <DollarSign className="w-4 h-4 text-yellow-400" />,
      color: "border-yellow-500/30 bg-yellow-500/10",
    },
    {
      id: 2,
      type: "engagement",
      title: "Pico de atividade",
      message: "Sua campanha 'Teste de Produto' teve 42 submissões nas últimas 2 horas.",
      timestamp: "3h atrás",
      icon: <TrendingUp className="w-4 h-4 text-green-400" />,
      color: "border-green-500/30 bg-green-500/10",
    },
    {
      id: 3,
      type: "retention",
      title: "Baixa conversão",
      message: "A missão 'Compartilhar nas Redes' tem taxa de conclusão de apenas 31%.",
      timestamp: "6h atrás",
      icon: <AlertTriangle className="w-4 h-4 text-red-400" />,
      color: "border-red-500/30 bg-red-500/10",
    },
    {
      id: 4,
      type: "users",
      title: "Novos usuários",
      message: "28 novos usuários se inscreveram para suas missões esta semana.",
      timestamp: "1d atrás",
      icon: <Users className="w-4 h-4 text-neon-cyan" />,
      color: "border-neon-cyan/30 bg-neon-cyan/10",
    },
  ]);
  
  const dismissAlert = (id: number) => {
    playSound?.("pop");
    setAlerts(alerts.filter(alert => alert.id !== id));
  };
  
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
            {alerts.length} {alerts.length === 1 ? 'alerta' : 'alertas'}
          </span>
        </CardHeader>
        <CardContent className="p-5 pt-1">
          {alerts.length > 0 ? (
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  tabIndex={0}
                  className={`relative p-4 pl-3 border rounded-lg flex items-stretch group ${alert.color} border-l-4 transition-shadow focus-within:shadow-[0_0_0_3px_#FF00C8] hover:shadow-[0_0_0_3px_#FF00C8] outline-none ` +
                    (alert.type === 'credit' ? 'border-l-yellow-400 ' : '') +
                    (alert.type === 'engagement' ? 'border-l-green-400 ' : '') +
                    (alert.type === 'retention' ? 'border-l-red-400 ' : '') +
                    (alert.type === 'users' ? 'border-l-cyan-400 ' : '')
                  }
                >
                  <div className="flex gap-3 w-full">
                    <div className="mt-0.5 bg-gray-800/50 p-2 rounded-md">{alert.icon}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium">{alert.title}</h4>
                        <span className="text-xs text-gray-400 bg-gray-800/30 px-2 py-0.5 rounded-full">{alert.timestamp}</span>
                      </div>
                      <p className="text-xs mt-1 leading-relaxed text-gray-300">{alert.message}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700/50 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
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
