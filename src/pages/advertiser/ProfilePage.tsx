import React, { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdvertiserSidebar from "@/components/advertiser/AdvertiserSidebar";
import AdvertiserHeader from "@/components/advertiser/AdvertiserHeader";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSounds } from "@/hooks/use-sounds";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BarChart3, 
  Edit2, 
  FileText, 
  Wallet, 
  Star, 
  Mail, 
  MapPin,
  Phone,
  Building,
  Calendar,
  RefreshCw,
  AlertCircle,
  Globe,
  User
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import useAdvertiserKPIs from "@/hooks/useAdvertiserKPIs";
import useAdvertiserProfile from "@/hooks/useAdvertiserProfile";
import { DownloadButton } from "@/components/ui/download-button";

const ProfilePage = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { playSound } = useSounds();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const { userName = "Usuário" } = useUser();
  
  // Hook para buscar KPIs dinâmicos
  const { kpis, isLoading: kpisLoading, error: kpisError, refetch: refetchKPIs } = useAdvertiserKPIs();
  
  // Hook para buscar dados do perfil dinâmico
  const { profileData, isLoading: profileLoading, error: profileError, refetch: refetchProfile } = useAdvertiserProfile();
  
  // Recent campaign activities (mantendo mockado por enquanto)
  const recentActivities = [
    { id: 1, campaign: "Verão 2025", action: "Submissão aprovada", date: "15/04/2025", user: "Maria S.", reward: 75 },
    { id: 2, campaign: "Promoção Relâmpago", action: "Campanha concluída", date: "14/04/2025", user: "Sistema", reward: null },
    { id: 3, campaign: "Verão 2025", action: "Submissão recusada", date: "13/04/2025", user: "João P.", reward: null },
    { id: 4, campaign: "Desafio Mensal", action: "Nova submissão", date: "12/04/2025", user: "Carlos M.", reward: null },
    { id: 5, campaign: "Desafio Mensal", action: "Submissão aprovada", date: "11/04/2025", user: "Ana B.", reward: 50 },
  ];
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    playSound("pop");
  };
  
  const handleEditProfile = () => {
    toast({
      title: "Edição de perfil",
      description: "Você pode editar seu perfil na página de configurações",
    });
    
    playSound("pop");
  };

  const handleRefreshKPIs = async () => {
    playSound("pop");
    await refetchKPIs();
    toast({
      title: "KPIs atualizados",
      description: "Os dados foram atualizados com sucesso",
    });
  };

  const handleRefreshProfile = async () => {
    playSound("pop");
    await refetchProfile();
    toast({
      title: "Perfil atualizado",
      description: "Os dados do perfil foram atualizados",
    });
  };

  // Função para formatar data de criação
  const formatMemberSince = (dateString: string) => {
    if (!dateString) return "Data não disponível";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', { 
        month: 'long', 
        year: 'numeric' 
      });
    } catch {
      return "Data não disponível";
    }
  };

  // Função para obter status do usuário baseado no user_type
  const getUserStatus = (userType: string) => {
    switch (userType) {
      case 'admin':
        return { label: 'Administrador', color: 'text-red-400' };
      case 'anunciante':
        return { label: 'Premium', color: 'text-neon-cyan' };
      default:
        return { label: 'Padrão', color: 'text-muted-foreground' };
    }
  };

  const userStatus = getUserStatus(profileData.user_type);
  
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <AdvertiserSidebar />
        <SidebarInset className="overflow-y-auto pb-20">
          <AdvertiserHeader
            title="Perfil do Anunciante"
            userName={profileData.full_name || userName}
            description="Visualize e gerencie suas informações"
          />
          
          <div className="container px-4 pt-20 py-8 mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">Perfil do Anunciante</h1>
                <p className="text-muted-foreground">Visualize e gerencie suas informações</p>
              </div>
              
              {/* Botões para atualizar dados */}
              <div className="flex gap-2">
                <DownloadButton 
                  variant="ghost" 
                  size="sm" 
                  className="mr-2"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefreshProfile}
                  disabled={profileLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${profileLoading ? 'animate-spin' : ''}`} />
                  Perfil
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefreshKPIs}
                  disabled={kpisLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${kpisLoading ? 'animate-spin' : ''}`} />
                  KPIs
                </Button>
              </div>
            </div>
            
            {/* Error alerts */}
            {(kpisError || profileError) && (
              <div className="space-y-2 mb-6">
                {kpisError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Erro ao carregar KPIs: {kpisError}
                    </AlertDescription>
                  </Alert>
                )}
                {profileError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Erro ao carregar perfil: {profileError}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
            
            {/* Card do Perfil - Dados Dinâmicos */}
            <Card className="bg-galaxy-darkPurple border-galaxy-purple/30 mb-8">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center text-center">
                    {profileLoading ? (
                      <Skeleton className="h-24 w-24 rounded-full" />
                    ) : (
                      <Avatar className="h-24 w-24 border-4 border-neon-cyan/30">
                        {profileData.avatar_url ? (
                          <AvatarImage src={profileData.avatar_url} alt={profileData.full_name} />
                        ) : (
                          <AvatarFallback className="bg-galaxy-purple text-2xl">
                            {profileData.full_name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    )}
                    
                    {profileLoading ? (
                      <div className="mt-4 space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    ) : (
                      <>
                        <h2 className="mt-4 text-xl font-bold">{profileData.full_name}</h2>
                        <p className="text-sm text-muted-foreground">
                          {profileData.user_type === 'anunciante' ? 'Marketing Manager' : 'Usuário'}
                        </p>
                      </>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={handleEditProfile}
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Editar Perfil
                    </Button>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Empresa/Nome */}
                      <div className="flex items-center gap-3">
                        <Building className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {profileData.user_type === 'anunciante' ? 'Empresa' : 'Nome'}
                          </p>
                          {profileLoading ? (
                            <Skeleton className="h-5 w-32" />
                          ) : (
                            <p>{profileData.full_name || 'Não informado'}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* E-mail */}
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">E-mail</p>
                          {profileLoading ? (
                            <Skeleton className="h-5 w-40" />
                          ) : (
                            <p>{profileData.email}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Telefone */}
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Telefone</p>
                          {profileLoading ? (
                            <Skeleton className="h-5 w-32" />
                          ) : (
                            <p>{profileData.phone || 'Não informado'}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Website */}
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Website</p>
                          {profileLoading ? (
                            <Skeleton className="h-5 w-36" />
                          ) : (
                            <p>{profileData.website || 'Não informado'}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Membro desde */}
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Membro desde</p>
                          {profileLoading ? (
                            <Skeleton className="h-5 w-28" />
                          ) : (
                            <p>{formatMemberSince(profileData.created_at)}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Status */}
                      <div className="flex items-center gap-3">
                        <Star className="h-5 w-5 text-yellow-400" />
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          {profileLoading ? (
                            <Skeleton className="h-5 w-20" />
                          ) : (
                            <p className={userStatus.color}>{userStatus.label}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Biografia */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Biografia</p>
                      {profileLoading ? (
                        <Skeleton className="h-12 w-full" />
                      ) : (
                        <p>{profileData.description || 'Nenhuma biografia adicionada.'}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* KPIs Dinâmicos */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Campanhas</h3>
                    <FileText className="h-5 w-5 text-neon-cyan" />
                  </div>
                  <div className="flex items-end">
                    {kpisLoading ? (
                      <div className="text-3xl font-bold animate-pulse">--</div>
                    ) : (
                      <span className="text-3xl font-bold">{kpis.totalCampaigns}</span>
                    )}
                    <span className="text-sm ml-2 mb-1 text-muted-foreground">total</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Usuários Ativos</h3>
                    <BarChart3 className="h-5 w-5 text-neon-pink" />
                  </div>
                  <div className="flex items-end">
                    {kpisLoading ? (
                      <div className="text-3xl font-bold animate-pulse">--</div>
                    ) : (
                      <span className="text-3xl font-bold">{kpis.activeUsers}</span>
                    )}
                    <span className="text-sm ml-2 mb-1 text-muted-foreground">pessoas</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Gastos Mensais</h3>
                    <Wallet className="h-5 w-5 text-neon-pink" />
                  </div>
                  <div className="flex items-end">
                    {kpisLoading ? (
                      <div className="text-3xl font-bold animate-pulse">--</div>
                    ) : (
                      <span className="text-3xl font-bold">{kpis.monthlySpend}</span>
                    )}
                    <span className="text-sm ml-2 mb-1 text-muted-foreground">média</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Recompensa Média</h3>
                    <Star className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="flex items-end">
                    {kpisLoading ? (
                      <div className="text-3xl font-bold animate-pulse">--</div>
                    ) : (
                      <span className="text-3xl font-bold">{kpis.avgReward}</span>
                    )}
                    <span className="text-sm ml-2 mb-1 text-muted-foreground">por missão</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="activity">Atividade Recente</TabsTrigger>
                <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
                  <CardHeader>
                    <CardTitle>Resumo da Conta</CardTitle>
                    <CardDescription>Visão geral das suas métricas de anunciante</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      Gráfico de atividade da conta ao longo do tempo
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="activity">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
                    <CardHeader>
                      <CardTitle>Atividade Recente</CardTitle>
                      <CardDescription>Últimas atualizações nas suas campanhas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Campanha</TableHead>
                            <TableHead>Ação</TableHead>
                            <TableHead>Usuário</TableHead>
                            <TableHead className="text-right">Recompensa</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentActivities.map((activity) => (
                            <TableRow key={activity.id}>
                              <TableCell>{activity.date}</TableCell>
                              <TableCell>{activity.campaign}</TableCell>
                              <TableCell>
                                <span className={
                                  activity.action.includes("aprovada") ? "text-green-400" :
                                  activity.action.includes("recusada") ? "text-red-400" :
                                  activity.action.includes("concluída") ? "text-neon-cyan" :
                                  ""
                                }>
                                  {activity.action}
                                </span>
                              </TableCell>
                              <TableCell>{activity.user}</TableCell>
                              <TableCell className="text-right">
                                {activity.reward ? `${activity.reward} pontos` : "-"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardFooter className="flex justify-center border-t border-galaxy-purple/20 pt-4">
                      <Button variant="outline">Ver Todas as Atividades</Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="campaigns">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
                    <CardHeader>
                      <CardTitle>Minhas Campanhas</CardTitle>
                      <CardDescription>Lista de todas as suas campanhas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
                        <p>Veja todas as suas campanhas na seção de Campanhas</p>
                        <Button 
                          className="mt-4"
                          onClick={() => {
                            window.location.href = "/anunciante/campanhas";
                          }}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Ir para Campanhas
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ProfilePage;
