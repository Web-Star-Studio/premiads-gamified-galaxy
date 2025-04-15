
import { motion } from "framer-motion";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardHeader from "@/components/admin/DashboardHeader";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Bell, Settings, BellRing, BellOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

const NotificationsPage = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [globalNotifications, setGlobalNotifications] = useState(true);
  const [userNotifications, setUserNotifications] = useState(true);
  const [systemNotifications, setSystemNotifications] = useState(true);
  
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <AdminSidebar />
        <SidebarInset className="overflow-y-auto pb-20 fancy-scrollbar">
          <div className="container px-4 py-6 sm:py-8 mx-auto max-w-7xl">
            <DashboardHeader 
              title="Notificações" 
              subtitle="Gerenciamento de notificações do sistema" 
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 sm:mt-8"
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card className="bg-galaxy-deepPurple/10 border-galaxy-purple/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-neon-pink" />
                      Configuração Global
                    </CardTitle>
                    <CardDescription>
                      Configurações de notificações para todo o sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h4 className="font-medium">Notificações Globais</h4>
                          <p className="text-sm text-muted-foreground">
                            Ativar ou desativar todas as notificações
                          </p>
                        </div>
                        <Switch 
                          checked={globalNotifications}
                          onCheckedChange={setGlobalNotifications}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h4 className="font-medium">Notificações de Usuários</h4>
                          <p className="text-sm text-muted-foreground">
                            Ativar ou desativar notificações para usuários
                          </p>
                        </div>
                        <Switch 
                          checked={userNotifications}
                          onCheckedChange={setUserNotifications}
                          disabled={!globalNotifications}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h4 className="font-medium">Notificações de Sistema</h4>
                          <p className="text-sm text-muted-foreground">
                            Ativar ou desativar notificações de sistema
                          </p>
                        </div>
                        <Switch 
                          checked={systemNotifications}
                          onCheckedChange={setSystemNotifications}
                          disabled={!globalNotifications}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Salvar Configurações
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="bg-galaxy-deepPurple/10 border-galaxy-purple/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BellRing className="h-5 w-5 text-neon-pink" />
                      Histórico de Notificações
                    </CardTitle>
                    <CardDescription>
                      Notificações recentes enviadas pelo sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 rounded-md bg-galaxy-purple/10 border border-galaxy-purple/20">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-medium">Manutenção Programada</h4>
                          <span className="text-xs text-muted-foreground">2h atrás</span>
                        </div>
                        <p className="text-sm">Sistema será atualizado às 02:00. Tempo estimado: 30 min.</p>
                      </div>
                      
                      <div className="p-3 rounded-md bg-galaxy-purple/10 border border-galaxy-purple/20">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-medium">Novo Sorteio Criado</h4>
                          <span className="text-xs text-muted-foreground">5h atrás</span>
                        </div>
                        <p className="text-sm">Sorteio "Prêmio Especial" foi criado com sucesso.</p>
                      </div>
                      
                      <div className="p-3 rounded-md bg-galaxy-purple/10 border border-galaxy-purple/20">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-medium">Alerta de Segurança</h4>
                          <span className="text-xs text-muted-foreground">1d atrás</span>
                        </div>
                        <p className="text-sm">Múltiplas tentativas de login detectadas para usuário #4321.</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Ver Todas as Notificações
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <Card className="mt-6 bg-galaxy-deepPurple/10 border-galaxy-purple/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-neon-pink" />
                    Enviar Notificação
                  </CardTitle>
                  <CardDescription>
                    Envie uma notificação para usuários específicos ou para todo o sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <label htmlFor="title" className="text-sm font-medium">Título</label>
                      <input 
                        id="title"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Título da notificação"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <label htmlFor="message" className="text-sm font-medium">Mensagem</label>
                      <textarea 
                        id="message"
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Mensagem da notificação"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <label htmlFor="type" className="text-sm font-medium">Tipo</label>
                      <select 
                        id="type"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="all">Todos os usuários</option>
                        <option value="clients">Apenas clientes</option>
                        <option value="advertisers">Apenas anunciantes</option>
                        <option value="admins">Apenas administradores</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Cancelar</Button>
                  <Button>Enviar Notificação</Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default NotificationsPage;
