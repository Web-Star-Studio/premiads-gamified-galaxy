
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSounds } from "@/hooks/use-sounds";
import { useToast } from "@/hooks/use-toast";

// Admin components
import DashboardHeader from "@/components/admin/DashboardHeader";
import UserManagement from "@/components/admin/UserManagement";
import AccessControl from "@/components/admin/AccessControl";
import SystemAudit from "@/components/admin/SystemAudit";
import LotteryManagement from "@/components/admin/LotteryManagement";
import NotificationTesting from "@/components/admin/NotificationTesting";
import { Loader } from "lucide-react";

const AdminPanel = () => {
  const [loading, setLoading] = useState(true);
  const { playSound } = useSounds();
  const { toast } = useToast();
  
  useEffect(() => {
    const loadTimer = setTimeout(() => {
      setLoading(false);
      playSound("chime");
      toast({
        title: "Painel Admin",
        description: "Acesso administrativo concedido.",
      });
    }, 1500);

    return () => clearTimeout(loadTimer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-galaxy-dark">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-t-neon-pink border-galaxy-purple rounded-full animate-spin"></div>
          <h2 className="text-xl font-heading neon-text-pink">Carregando painel master...</h2>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-galaxy-dark pb-20">
      <div className="container px-4 py-8 mx-auto">
        <DashboardHeader title="Painel Master" subtitle="Controle completo do sistema" />
        
        <Tabs defaultValue="users" className="mt-8">
          <TabsList className="w-full md:w-auto grid grid-cols-3 md:flex md:gap-4 mb-8">
            <TabsTrigger className="data-[state=active]:neon-text-pink" value="users">
              👥 Usuários
            </TabsTrigger>
            <TabsTrigger className="data-[state=active]:neon-text-pink" value="access">
              🔐 Controle de Acesso
            </TabsTrigger>
            <TabsTrigger className="data-[state=active]:neon-text-pink" value="audit">
              📋 Auditoria
            </TabsTrigger>
            <TabsTrigger className="data-[state=active]:neon-text-pink" value="lottery">
              🎟️ Sorteios
            </TabsTrigger>
            <TabsTrigger className="data-[state=active]:neon-text-pink" value="notifications">
              🔔 Notificações
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="access" className="space-y-6">
            <AccessControl />
          </TabsContent>
          
          <TabsContent value="audit" className="space-y-6">
            <SystemAudit />
          </TabsContent>
          
          <TabsContent value="lottery" className="space-y-6">
            <LotteryManagement />
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <NotificationTesting />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
