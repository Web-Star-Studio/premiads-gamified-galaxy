
import { motion } from "framer-motion";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardHeader from "@/components/admin/DashboardHeader";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Settings, Database, Globe, Shield, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const SettingsPage = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <AdminSidebar />
        <SidebarInset className="overflow-y-auto pb-20 fancy-scrollbar">
          <div className="container px-4 py-6 sm:py-8 mx-auto max-w-7xl">
            <DashboardHeader 
              title="Configurações do Sistema" 
              subtitle="Gerenciamento de configurações globais do sistema" 
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 sm:mt-8"
            >
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="general">Geral</TabsTrigger>
                  <TabsTrigger value="appearance">Aparência</TabsTrigger>
                  <TabsTrigger value="security">Segurança</TabsTrigger>
                  <TabsTrigger value="database">Banco de Dados</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general" className="space-y-6">
                  <Card className="bg-galaxy-deepPurple/10 border-galaxy-purple/30">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-neon-pink" />
                        Configurações Gerais
                      </CardTitle>
                      <CardDescription>
                        Configurações básicas do sistema
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <h4 className="font-medium">Modo de Manutenção</h4>
                            <p className="text-sm text-muted-foreground">
                              Coloca o sistema em modo de manutenção
                            </p>
                          </div>
                          <Switch 
                            checked={maintenanceMode}
                            onCheckedChange={setMaintenanceMode}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <h4 className="font-medium">Modo de Depuração</h4>
                            <p className="text-sm text-muted-foreground">
                              Ativa logs detalhados para depuração
                            </p>
                          </div>
                          <Switch 
                            checked={debugMode}
                            onCheckedChange={setDebugMode}
                          />
                        </div>
                        
                        <div className="grid gap-2 pt-2">
                          <label htmlFor="siteTitle" className="text-sm font-medium">Título do Site</label>
                          <input 
                            id="siteTitle"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            defaultValue="PremiAds Admin"
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <label htmlFor="contactEmail" className="text-sm font-medium">Email de Contato</label>
                          <input 
                            id="contactEmail"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            defaultValue="admin@premiads.com"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-galaxy-deepPurple/10 border-galaxy-purple/30">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-neon-pink" />
                        Configurações Regionais
                      </CardTitle>
                      <CardDescription>
                        Ajuste configurações de região e idioma
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <label htmlFor="language" className="text-sm font-medium">Idioma Padrão</label>
                          <select 
                            id="language"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            defaultValue="pt-BR"
                          >
                            <option value="pt-BR">Português (Brasil)</option>
                            <option value="en-US">English (United States)</option>
                            <option value="es">Español</option>
                          </select>
                        </div>
                        
                        <div className="grid gap-2">
                          <label htmlFor="timezone" className="text-sm font-medium">Fuso Horário</label>
                          <select 
                            id="timezone"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            defaultValue="America/Sao_Paulo"
                          >
                            <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                            <option value="America/New_York">New York (GMT-4)</option>
                            <option value="Europe/London">London (GMT+1)</option>
                          </select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="appearance" className="space-y-6">
                  <Card className="bg-galaxy-deepPurple/10 border-galaxy-purple/30">
                    <CardHeader>
                      <CardTitle>Aparência</CardTitle>
                      <CardDescription>
                        Configurações de aparência do sistema
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <h4 className="font-medium">Modo Escuro</h4>
                            <p className="text-sm text-muted-foreground">
                              Ativar ou desativar o modo escuro
                            </p>
                          </div>
                          <Switch 
                            checked={darkMode}
                            onCheckedChange={setDarkMode}
                          />
                        </div>
                        
                        <div className="grid gap-2 pt-2">
                          <label htmlFor="primaryColor" className="text-sm font-medium">Cor Primária</label>
                          <div className="flex items-center gap-2">
                            <input 
                              type="color"
                              id="primaryColor"
                              className="h-10 w-10 border rounded-md cursor-pointer"
                              defaultValue="#FF00C7"
                            />
                            <input 
                              type="text"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              defaultValue="#FF00C7"
                            />
                          </div>
                        </div>
                        
                        <div className="grid gap-2">
                          <label htmlFor="secondaryColor" className="text-sm font-medium">Cor Secundária</label>
                          <div className="flex items-center gap-2">
                            <input 
                              type="color"
                              id="secondaryColor"
                              className="h-10 w-10 border rounded-md cursor-pointer"
                              defaultValue="#00EAFF"
                            />
                            <input 
                              type="text"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              defaultValue="#00EAFF"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="security" className="space-y-6">
                  <Card className="bg-galaxy-deepPurple/10 border-galaxy-purple/30">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-neon-pink" />
                        Segurança
                      </CardTitle>
                      <CardDescription>
                        Configurações de segurança do sistema
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <h4 className="font-medium">Autenticação em Dois Fatores</h4>
                            <p className="text-sm text-muted-foreground">
                              Exigir 2FA para todos os usuários administradores
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <h4 className="font-medium">Bloqueio após tentativas</h4>
                            <p className="text-sm text-muted-foreground">
                              Bloquear conta após 5 tentativas de login
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="grid gap-2 pt-2">
                          <label htmlFor="sessionTimeout" className="text-sm font-medium">Tempo de Sessão (minutos)</label>
                          <input 
                            id="sessionTimeout"
                            type="number"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            defaultValue="60"
                            min="5"
                            max="1440"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="database" className="space-y-6">
                  <Card className="bg-galaxy-deepPurple/10 border-galaxy-purple/30">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5 text-neon-pink" />
                        Banco de Dados
                      </CardTitle>
                      <CardDescription>
                        Configurações do banco de dados
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <label htmlFor="dbHost" className="text-sm font-medium">Host</label>
                          <input 
                            id="dbHost"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            defaultValue="db.supabase.co"
                            disabled
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <label htmlFor="dbName" className="text-sm font-medium">Nome do Banco</label>
                          <input 
                            id="dbName"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            defaultValue="premiads_production"
                            disabled
                          />
                        </div>
                        
                        <div className="flex justify-between gap-4">
                          <Button variant="outline" className="w-full">Backup Manual</Button>
                          <Button variant="outline" className="w-full">Verificar Conexão</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end mt-6">
                <Button variant="outline" className="mr-2">Cancelar</Button>
                <Button>Salvar Configurações</Button>
              </div>
            </motion.div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default SettingsPage;
