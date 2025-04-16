
import React, { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdvertiserSidebar from "@/components/advertiser/AdvertiserSidebar";
import AdvertiserHeader from "@/components/advertiser/AdvertiserHeader";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSounds } from "@/hooks/use-sounds";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  Calendar
} from "lucide-react";
import { useUser } from "@/context/UserContext";

const ProfilePage = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { playSound } = useSounds();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const { userName = "Desenvolvedor PremiAds" } = useUser();
  
  // User profile data
  const user = {
    name: userName,
    role: "Marketing Manager",
    company: "PremiAds Tecnologia",
    email: "desenvolvedor@premiads.com",
    phone: "+55 (11) 98765-4321",
    location: "São Paulo, SP",
    joined: "Janeiro 2025",
    bio: "Especialista em marketing digital com mais de 5 anos de experiência em campanhas digitais e estratégias de engajamento.",
    stats: {
      campaigns: 12,
      activeUsers: 845,
      monthlySpend: "R$ 3.250,00",
      avgReward: "R$ 45,20"
    }
  };
  
  // Recent campaign activities
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
  
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <AdvertiserSidebar />
        <SidebarInset className="overflow-y-auto pb-20">
          <AdvertiserHeader
            title="Perfil do Anunciante"
            userName={userName}
            description="Visualize e gerencie suas informações"
          />
          
          <div className="container px-4 pt-20 py-8 mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">Perfil do Anunciante</h1>
              <p className="text-muted-foreground">Visualize e gerencie suas informações</p>
            </div>
            
            <Card className="bg-galaxy-darkPurple border-galaxy-purple/30 mb-8">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 border-4 border-neon-cyan/30">
                      <AvatarFallback className="bg-galaxy-purple text-2xl">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="mt-4 text-xl font-bold">{user.name}</h2>
                    <p className="text-sm text-muted-foreground">{user.role}</p>
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
                      <div className="flex items-center gap-3">
                        <Building className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Empresa</p>
                          <p>{user.company}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">E-mail</p>
                          <p>{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Telefone</p>
                          <p>{user.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Localização</p>
                          <p>{user.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Membro desde</p>
                          <p>{user.joined}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Star className="h-5 w-5 text-yellow-400" />
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <p className="text-neon-cyan">Premium</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Biografia</p>
                      <p>{user.bio}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Campanhas</h3>
                    <FileText className="h-5 w-5 text-neon-cyan" />
                  </div>
                  <div className="flex items-end">
                    <span className="text-3xl font-bold">{user.stats.campaigns}</span>
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
                    <span className="text-3xl font-bold">{user.stats.activeUsers}</span>
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
                    <span className="text-3xl font-bold">{user.stats.monthlySpend}</span>
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
                    <span className="text-3xl font-bold">{user.stats.avgReward}</span>
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
