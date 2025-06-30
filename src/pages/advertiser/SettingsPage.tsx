import React, { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdvertiserSidebar from "@/components/advertiser/AdvertiserSidebar";
import AdvertiserHeader from "@/components/advertiser/AdvertiserHeader";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSounds } from "@/hooks/use-sounds";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import useAdvertiserProfile from "@/hooks/useAdvertiserProfile";
import { 
  User, 
  Bell, 
  Shield, 
  Lock, 
  CreditCard, 
  Mail, 
  ChevronRight, 
  Check,
  Save,
  Smartphone,
  AlertCircle
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SettingsPage = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { playSound } = useSounds();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const { userName = "Desenvolvedor" } = useUser();
  
  // Hook para gerenciar dados do perfil
  const { 
    profileData, 
    isLoading, 
    error, 
    updateProfile, 
    isUpdating 
  } = useAdvertiserProfile();
  
  // Estados locais para edição
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    website: "",
    description: "",
    email_notifications: true,
    push_notifications: true
  });
  
  // Form states for various settings
  const [notificationsSettings, setNotificationsSettings] = useState({
    email: true,
    push: true,
    marketing: false,
    newSubmissions: true,
    systemUpdates: true
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: false,
    sessionTimeout: true,
    loginNotifications: true
  });

  // Atualizar formData quando profileData mudar
  useEffect(() => {
    if (profileData) {
      setFormData({
        full_name: profileData.full_name || "",
        phone: profileData.phone || "",
        website: profileData.website || "",
        description: profileData.description || "",
        email_notifications: profileData.email_notifications,
        push_notifications: profileData.push_notifications
      });
      
      setNotificationsSettings(prev => ({
        ...prev,
        email: profileData.email_notifications,
        push: profileData.push_notifications
      }));
    }
  }, [profileData]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    playSound("pop");
  };
  
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSaveProfile = async () => {
    try {
      const success = await updateProfile(formData);
      
      if (success) {
        toast({
          title: "Perfil atualizado",
          description: "Suas informações foram salvas com sucesso",
        });
        playSound("chime");
      } else {
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível atualizar o perfil. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  const handleSaveSettings = () => {
    // Simulação para outras configurações
    toast({
      title: "Configurações salvas",
      description: "Suas alterações foram salvas com sucesso",
    });
    playSound("chime");
  };
  
  const toggleNotificationSetting = (setting: keyof typeof notificationsSettings) => {
    setNotificationsSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    
    // Se for email ou push, atualizar também no formData
    if (setting === 'email') {
      handleInputChange('email_notifications', !notificationsSettings.email);
    } else if (setting === 'push') {
      handleInputChange('push_notifications', !notificationsSettings.push);
    }
    
    playSound("pop");
  };
  
  const toggleSecuritySetting = (setting: keyof typeof securitySettings) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    playSound("pop");
  };

  if (isLoading) {
    return (
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
          <AdvertiserSidebar />
          <SidebarInset className="overflow-y-auto pb-20">
            <AdvertiserHeader
              title="Configurações"
              userName={userName}
              description="Carregando..."
            />
            <div className="container px-4 pt-20 py-8 mx-auto">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-galaxy-purple/20 rounded w-1/4"></div>
                <div className="h-4 bg-galaxy-purple/20 rounded w-1/2"></div>
                <div className="h-64 bg-galaxy-purple/20 rounded"></div>
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }
  
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <AdvertiserSidebar />
        <SidebarInset className="overflow-y-auto pb-20">
          <AdvertiserHeader
            title="Configurações"
            userName={userName}
            description="Gerencie suas preferências e configurações da conta"
          />
          
          <div className="container px-4 pt-20 py-8 mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">Configurações</h1>
              <p className="text-muted-foreground">Gerencie suas preferências e configurações da conta</p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
              <TabsList className="grid grid-cols-4 sm:grid-cols-5 lg:w-auto">
                <TabsTrigger value="profile">
                  <User className="h-4 w-4 mr-2 hidden sm:block" />
                  Perfil
                </TabsTrigger>
                <TabsTrigger value="notifications">
                  <Bell className="h-4 w-4 mr-2 hidden sm:block" />
                  Notificações
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Shield className="h-4 w-4 mr-2 hidden sm:block" />
                  Segurança
                </TabsTrigger>
                <TabsTrigger value="payment">
                  <CreditCard className="h-4 w-4 mr-2 hidden sm:block" />
                  Pagamento
                </TabsTrigger>
                <TabsTrigger value="api" className="hidden sm:flex">
                  <Lock className="h-4 w-4 mr-2" />
                  API
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="mt-6">
                <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
                  <CardHeader>
                    <CardTitle>Informações do Perfil</CardTitle>
                    <CardDescription>Atualize suas informações pessoais e preferências</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome</Label>
                        <Input 
                          id="name" 
                          value={formData.full_name}
                          onChange={(e) => handleInputChange('full_name', e.target.value)}
                          placeholder="Seu nome completo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input 
                          id="email" 
                          value={profileData.email}
                          disabled
                          className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">O e-mail não pode ser alterado</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input 
                          id="phone" 
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input 
                          id="website" 
                          value={formData.website}
                          onChange={(e) => handleInputChange('website', e.target.value)}
                          placeholder="https://seusite.com"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Biografia</Label>
                      <Textarea
                        id="bio"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="min-h-[100px]"
                        placeholder="Conte um pouco sobre você ou sua empresa..."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Idioma do Sistema</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" className="justify-between">
                          Português (Brasil) <Check className="h-4 w-4 ml-2" />
                        </Button>
                        <Button variant="outline" className="justify-between">
                          English (US)
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end border-t border-galaxy-purple/20 pt-4">
                    <Button onClick={handleSaveProfile} disabled={isUpdating}>
                      {isUpdating ? (
                        <div className="flex items-center">
                          <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                          Salvando
                        </div>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Salvar Alterações
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications" className="mt-6">
                <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
                  <CardHeader>
                    <CardTitle>Preferências de Notificações</CardTitle>
                    <CardDescription>Gerencie como e quando você recebe notificações</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Canais de Notificação</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <Label>Notificações por E-mail</Label>
                              <p className="text-sm text-muted-foreground">Receba atualizações no seu e-mail</p>
                            </div>
                          </div>
                          <Switch 
                            checked={formData.email_notifications}
                            onCheckedChange={(checked) => handleInputChange('email_notifications', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Smartphone className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <Label>Notificações Push</Label>
                              <p className="text-sm text-muted-foreground">Receba notificações no navegador</p>
                            </div>
                          </div>
                          <Switch 
                            checked={formData.push_notifications}
                            onCheckedChange={(checked) => handleInputChange('push_notifications', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <Label>E-mails de Marketing</Label>
                              <p className="text-sm text-muted-foreground">Receba novidades e ofertas especiais</p>
                            </div>
                          </div>
                          <Switch 
                            checked={notificationsSettings.marketing}
                            onCheckedChange={() => toggleNotificationSetting('marketing')}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Tipos de Notificação</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Novas Submissões</Label>
                            <p className="text-sm text-muted-foreground">Quando participantes enviarem conteúdo</p>
                          </div>
                          <Switch 
                            checked={notificationsSettings.newSubmissions}
                            onCheckedChange={() => toggleNotificationSetting('newSubmissions')}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Atualizações do Sistema</Label>
                            <p className="text-sm text-muted-foreground">Sobre novas funcionalidades ou manutenção</p>
                          </div>
                          <Switch 
                            checked={notificationsSettings.systemUpdates}
                            onCheckedChange={() => toggleNotificationSetting('systemUpdates')}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end border-t border-galaxy-purple/20 pt-4">
                    <Button onClick={handleSaveProfile} disabled={isUpdating}>
                      {isUpdating ? (
                        <div className="flex items-center">
                          <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                          Salvando
                        </div>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Salvar Preferências
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="security" className="mt-6">
                <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
                  <CardHeader>
                    <CardTitle>Segurança</CardTitle>
                    <CardDescription>Proteja sua conta com configurações avançadas</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Autenticação</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Smartphone className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <Label>Autenticação de Dois Fatores</Label>
                              <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança</p>
                            </div>
                          </div>
                          <Switch 
                            checked={securitySettings.twoFactor}
                            onCheckedChange={() => toggleSecuritySetting('twoFactor')}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <Label>Notificações de Login</Label>
                              <p className="text-sm text-muted-foreground">Aviso quando houver login em novo dispositivo</p>
                            </div>
                          </div>
                          <Switch 
                            checked={securitySettings.loginNotifications}
                            onCheckedChange={() => toggleSecuritySetting('loginNotifications')}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Shield className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <Label>Timeout de Sessão</Label>
                              <p className="text-sm text-muted-foreground">Encerre a sessão após inatividade</p>
                            </div>
                          </div>
                          <Switch 
                            checked={securitySettings.sessionTimeout}
                            onCheckedChange={() => toggleSecuritySetting('sessionTimeout')}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Alterar Senha</h3>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Senha Atual</Label>
                          <Input id="current-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">Nova Senha</Label>
                          <Input id="new-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirmar Senha</Label>
                          <Input id="confirm-password" type="password" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end border-t border-galaxy-purple/20 pt-4">
                    <Button onClick={handleSaveSettings} disabled={isUpdating}>
                      {isUpdating ? (
                        <div className="flex items-center">
                          <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                          Salvando
                        </div>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Atualizar Configurações
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="payment" className="mt-6">
                <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
                  <CardHeader>
                    <CardTitle>Métodos de Pagamento</CardTitle>
                    <CardDescription>Gerencie seus cartões e configurações de pagamento</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Cartões Salvos</h3>
                      <div className="space-y-3">
                        <div className="p-4 border border-galaxy-purple/30 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <CreditCard className="h-5 w-5 text-neon-cyan" />
                              <div>
                                <p className="font-medium">•••• •••• •••• 4242</p>
                                <p className="text-sm text-muted-foreground">Expira em 12/2026</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              Remover
                            </Button>
                          </div>
                        </div>
                        
                        <Button variant="outline" className="w-full">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Adicionar Novo Cartão
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Faturamento</h3>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="company-name">Nome da Empresa</Label>
                          <Input id="company-name" defaultValue="PremiAds Tecnologia Ltda." />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tax-id">CNPJ / CPF</Label>
                          <Input id="tax-id" defaultValue="12.345.678/0001-90" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Endereço</Label>
                          <Input id="address" defaultValue="Av. Paulista, 1000" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="city">Cidade</Label>
                            <Input id="city" defaultValue="São Paulo" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">Estado</Label>
                            <Input id="state" defaultValue="SP" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="postal-code">CEP</Label>
                            <Input id="postal-code" defaultValue="01310-000" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end border-t border-galaxy-purple/20 pt-4">
                    <Button onClick={handleSaveSettings} disabled={isUpdating}>
                      {isUpdating ? (
                        <div className="flex items-center">
                          <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                          Salvando
                        </div>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Salvar Informações
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="api" className="mt-6">
                <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
                  <CardHeader>
                    <CardTitle>Chaves de API</CardTitle>
                    <CardDescription>Gerencie suas chaves de API para integração</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-galaxy-purple/10 rounded-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="mb-3 sm:mb-0">
                            <h3 className="font-medium">Chave de Produção</h3>
                            <p className="text-sm text-muted-foreground">Use em ambientes de produção</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input 
                              value="premi_prod_xxxx_xxxxxxxxxxxxxxxxxxxx" 
                              className="max-w-64 font-mono text-xs"
                              readOnly
                            />
                            <Button variant="outline" size="sm">
                              Copiar
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-galaxy-purple/10 rounded-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="mb-3 sm:mb-0">
                            <h3 className="font-medium">Chave de Teste</h3>
                            <p className="text-sm text-muted-foreground">Use em ambientes de desenvolvimento</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input 
                              value="premi_test_xxxx_xxxxxxxxxxxxxxxxxxxx" 
                              className="max-w-64 font-mono text-xs"
                              readOnly
                            />
                            <Button variant="outline" size="sm">
                              Copiar
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="outline" className="w-full">
                        <Lock className="h-4 w-4 mr-2" />
                        Gerar Nova Chave
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Webhooks</h3>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="webhook-url">URL do Webhook</Label>
                          <Input id="webhook-url" placeholder="https://sua-api.com/webhooks/premiads" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="webhook-secret">Segredo do Webhook</Label>
                          <Input id="webhook-secret" type="password" defaultValue="whsec_xxxxxxxxxxxxxxxxxxxx" />
                        </div>
                        <div className="space-y-1">
                          <Label>Eventos</Label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" id="event-1" className="rounded border-input" defaultChecked />
                              <Label htmlFor="event-1">Submissão criada</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" id="event-2" className="rounded border-input" defaultChecked />
                              <Label htmlFor="event-2">Campanha concluída</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" id="event-3" className="rounded border-input" defaultChecked />
                              <Label htmlFor="event-3">Pagamento processado</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" id="event-4" className="rounded border-input" />
                              <Label htmlFor="event-4">Usuário criado</Label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end border-t border-galaxy-purple/20 pt-4">
                    <Button onClick={handleSaveSettings} disabled={isUpdating}>
                      {isUpdating ? (
                        <div className="flex items-center">
                          <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                          Salvando
                        </div>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Salvar Configurações de API
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default SettingsPage;
