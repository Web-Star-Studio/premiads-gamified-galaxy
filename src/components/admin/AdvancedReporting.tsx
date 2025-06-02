
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  ArrowUpRight, ArrowDownRight, Download, Calendar, RefreshCw, 
  BarChart3, PieChart as PieChartIcon, TrendingUp, UsersRound, 
  ShoppingBag, Target, Award, Smartphone, Monitor
} from 'lucide-react';
import { useSounds } from '@/hooks/use-sounds';
import { toast } from "@/hooks/use-toast";
import LoadingParticles from './LoadingParticles';

// Mock data for charts
const userActivityData = [
  { name: 'Jan', usuarios: 4000, missoes: 2400, tickets: 2400 },
  { name: 'Fev', usuarios: 3000, missoes: 1398, tickets: 2210 },
  { name: 'Mar', usuarios: 2000, missoes: 9800, tickets: 2290 },
  { name: 'Abr', usuarios: 2780, missoes: 3908, tickets: 2000 },
  { name: 'Mai', usuarios: 1890, missoes: 4800, tickets: 2181 },
  { name: 'Jun', usuarios: 2390, missoes: 3800, tickets: 2500 },
  { name: 'Jul', usuarios: 3490, missoes: 4300, tickets: 2100 },
];

const revenueData = [
  { name: 'Jan', vendas: 5000, anuncios: 3400, assinaturas: 1400 },
  { name: 'Fev', vendas: 4000, anuncios: 2398, assinaturas: 2210 },
  { name: 'Mar', vendas: 3000, anuncios: 10800, assinaturas: 2290 },
  { name: 'Abr', vendas: 3780, anuncios: 4908, assinaturas: 2000 },
  { name: 'Mai', vendas: 2890, anuncios: 5800, assinaturas: 2181 },
  { name: 'Jun', vendas: 3390, anuncios: 4800, assinaturas: 2500 },
  { name: 'Jul', vendas: 4490, anuncios: 5300, assinaturas: 2100 },
];

const userTypeData = [
  { name: 'Participantes', value: 60 },
  { name: 'Anunciantes', value: 15 },
  { name: 'Premium', value: 25 },
];

const deviceData = [
  { name: 'Mobile', value: 70 },
  { name: 'Desktop', value: 25 },
  { name: 'Tablet', value: 5 },
];

const COLORS = ['#8884d8', '#FF6B8B', '#82ca9d', '#ffc658'];

const AdvancedReporting: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeframe, setTimeframe] = useState('30d');
  const { playSound } = useSounds();

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleDownloadReport = (reportType: string) => {
    playSound('reward'); // Changed from 'success' to 'reward'
    
    toast({
      title: "Relatório gerado",
      description: `O relatório de ${reportType} foi gerado e está pronto para download.`,
    });
  };

  const handleRefreshData = () => {
    setRefreshing(true);
    playSound('pop');
    
    setTimeout(() => {
      setRefreshing(false);
      
      toast({
        title: "Dados atualizados",
        description: `Os dados foram atualizados com sucesso.`,
      });
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-galaxy-deepPurple border-galaxy-purple/30">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl font-heading text-white flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-neon-cyan" />
                  Relatórios Avançados
                </CardTitle>
                <CardDescription>
                  Gere análises detalhadas sobre o uso da plataforma e o engajamento dos usuários.
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Select defaultValue={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger className="w-[140px] bg-galaxy-dark border-galaxy-purple/30">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent className="bg-galaxy-deepPurple border-galaxy-purple/30">
                    <SelectItem value="7d">Últimos 7 dias</SelectItem>
                    <SelectItem value="30d">Últimos 30 dias</SelectItem>
                    <SelectItem value="90d">Últimos 90 dias</SelectItem>
                    <SelectItem value="365d">Último ano</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-galaxy-purple/30 hover:bg-galaxy-purple/20"
                  onClick={handleRefreshData}
                  disabled={refreshing}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Atualizar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-60 relative">
                <LoadingParticles />
                <div className="w-12 h-12 border-4 border-t-neon-pink border-galaxy-purple rounded-full animate-spin"></div>
              </div>
            ) : (
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6 w-full">
                  <TabsTrigger 
                    value="overview"
                    className="data-[state=active]:text-neon-cyan"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Visão Geral
                  </TabsTrigger>
                  <TabsTrigger 
                    value="users"
                    className="data-[state=active]:text-neon-cyan"
                  >
                    <UsersRound className="h-4 w-4 mr-2" />
                    Usuários
                  </TabsTrigger>
                  <TabsTrigger 
                    value="engagement"
                    className="data-[state=active]:text-neon-cyan"
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Engajamento
                  </TabsTrigger>
                  <TabsTrigger 
                    value="revenue"
                    className="data-[state=active]:text-neon-cyan"
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Receita
                  </TabsTrigger>
                </TabsList>
                
                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card className="bg-galaxy-dark border-galaxy-purple/30">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-muted-foreground">Usuários Ativos</p>
                            <h3 className="text-2xl font-bold">8,249</h3>
                            <div className="flex items-center mt-1 text-neon-lime">
                              <ArrowUpRight className="h-4 w-4 mr-1" />
                              <span className="text-xs">+12.5%</span>
                            </div>
                          </div>
                          <div className="p-2 rounded-full bg-blue-500/20">
                            <UsersRound className="h-5 w-5 text-blue-500" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-galaxy-dark border-galaxy-purple/30">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-muted-foreground">Missões Completadas</p>
                            <h3 className="text-2xl font-bold">12,832</h3>
                            <div className="flex items-center mt-1 text-neon-lime">
                              <ArrowUpRight className="h-4 w-4 mr-1" />
                              <span className="text-xs">+8.2%</span>
                            </div>
                          </div>
                          <div className="p-2 rounded-full bg-purple-500/20">
                            <Award className="h-5 w-5 text-purple-500" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-galaxy-dark border-galaxy-purple/30">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-muted-foreground">Pontos Distribuídos</p>
                            <h3 className="text-2xl font-bold">1.4M</h3>
                            <div className="flex items-center mt-1 text-neon-lime">
                              <ArrowUpRight className="h-4 w-4 mr-1" />
                              <span className="text-xs">+15.8%</span>
                            </div>
                          </div>
                          <div className="p-2 rounded-full bg-neon-pink/20">
                            <svg 
                              width="20" 
                              height="20" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              className="text-neon-pink"
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="12" r="10"/>
                              <line x1="12" y1="8" x2="12" y2="12"/>
                              <line x1="12" y1="16" x2="12" y2="16"/>
                            </svg>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-galaxy-dark border-galaxy-purple/30">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-muted-foreground">Receita Total</p>
                            <h3 className="text-2xl font-bold">R$ 124K</h3>
                            <div className="flex items-center mt-1 text-red-500">
                              <ArrowDownRight className="h-4 w-4 mr-1" />
                              <span className="text-xs">-3.2%</span>
                            </div>
                          </div>
                          <div className="p-2 rounded-full bg-green-500/20">
                            <ShoppingBag className="h-5 w-5 text-green-500" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="bg-galaxy-dark border-galaxy-purple/30 lg:col-span-2">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Atividade de Usuários</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={userActivityData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                              <XAxis dataKey="name" stroke="#94a3b8" />
                              <YAxis stroke="#94a3b8" />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: '#1e1b4b', 
                                  borderColor: '#818cf8',
                                  borderRadius: '4px' 
                                }} 
                              />
                              <Legend />
                              <Line 
                                type="monotone" 
                                dataKey="usuarios" 
                                stroke="#8884d8" 
                                activeDot={{ r: 8 }} 
                              />
                              <Line type="monotone" dataKey="missoes" stroke="#FF6B8B" />
                              <Line type="monotone" dataKey="tickets" stroke="#82ca9d" />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-galaxy-dark border-galaxy-purple/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Distribuição de Usuários</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80 flex flex-col justify-center">
                          <ResponsiveContainer width="100%" height="80%">
                            <PieChart>
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: '#1e1b4b', 
                                  borderColor: '#818cf8',
                                  borderRadius: '4px' 
                                }} 
                              />
                              <Pie
                                data={userTypeData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                                label
                              >
                                {userTypeData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      className="border-galaxy-purple/30 hover:bg-galaxy-purple/20"
                      onClick={() => handleDownloadReport('visão geral')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Exportar Relatório
                    </Button>
                    
                    <Select defaultValue="pdf">
                      <SelectTrigger className="w-[120px] bg-galaxy-dark border-galaxy-purple/30">
                        <SelectValue placeholder="Formato" />
                      </SelectTrigger>
                      <SelectContent className="bg-galaxy-deepPurple border-galaxy-purple/30">
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
                
                {/* Users Tab */}
                <TabsContent value="users" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card className="bg-galaxy-dark border-galaxy-purple/30">
                      <CardContent className="pt-6 text-center">
                        <UsersRound className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                        <h3 className="text-2xl font-bold">8,249</h3>
                        <p className="text-sm text-muted-foreground">Usuários Ativos</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-galaxy-dark border-galaxy-purple/30">
                      <CardContent className="pt-6 text-center">
                        <UsersRound className="h-8 w-8 mx-auto mb-2 text-green-500" />
                        <h3 className="text-2xl font-bold">357</h3>
                        <p className="text-sm text-muted-foreground">Novos Usuários</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-galaxy-dark border-galaxy-purple/30">
                      <CardContent className="pt-6 text-center">
                        <UsersRound className="h-8 w-8 mx-auto mb-2 text-red-500" />
                        <h3 className="text-2xl font-bold">124</h3>
                        <p className="text-sm text-muted-foreground">Usuários Perdidos</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-galaxy-dark border-galaxy-purple/30">
                      <CardContent className="pt-6 text-center">
                        <UsersRound className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                        <h3 className="text-2xl font-bold">12.8%</h3>
                        <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-galaxy-dark border-galaxy-purple/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Tipos de Usuários</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80 flex flex-col justify-center">
                          <ResponsiveContainer width="100%" height="80%">
                            <PieChart>
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: '#1e1b4b', 
                                  borderColor: '#818cf8',
                                  borderRadius: '4px' 
                                }} 
                              />
                              <Pie
                                data={userTypeData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                                label
                              >
                                {userTypeData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-galaxy-dark border-galaxy-purple/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Dispositivos Utilizados</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80 flex flex-col justify-center">
                          <ResponsiveContainer width="100%" height="80%">
                            <PieChart>
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: '#1e1b4b', 
                                  borderColor: '#818cf8',
                                  borderRadius: '4px' 
                                }} 
                              />
                              <Pie
                                data={deviceData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                                label
                              >
                                {deviceData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <Card className="bg-galaxy-dark border-galaxy-purple/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Dispositivos por Tipo de Usuário</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={userActivityData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                              <XAxis dataKey="name" stroke="#94a3b8" />
                              <YAxis stroke="#94a3b8" />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: '#1e1b4b', 
                                  borderColor: '#818cf8',
                                  borderRadius: '4px' 
                                }} 
                              />
                              <Legend />
                              <Bar dataKey="usuarios" name="Mobile" fill="#8884d8" />
                              <Bar dataKey="missoes" name="Desktop" fill="#FF6B8B" />
                              <Bar dataKey="tickets" name="Tablet" fill="#82ca9d" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      className="border-galaxy-purple/30 hover:bg-galaxy-purple/20"
                      onClick={() => handleDownloadReport('usuários')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Exportar Relatório
                    </Button>
                    
                    <Select defaultValue="pdf">
                      <SelectTrigger className="w-[120px] bg-galaxy-dark border-galaxy-purple/30">
                        <SelectValue placeholder="Formato" />
                      </SelectTrigger>
                      <SelectContent className="bg-galaxy-deepPurple border-galaxy-purple/30">
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
                
                {/* Engagement Tab */}
                <TabsContent value="engagement" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="bg-galaxy-dark border-galaxy-purple/30">
                      <CardContent className="pt-6 text-center">
                        <Target className="h-8 w-8 mx-auto mb-2 text-neon-pink" />
                        <h3 className="text-2xl font-bold">87.2%</h3>
                        <p className="text-sm text-muted-foreground">Taxa de Engajamento</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-galaxy-dark border-galaxy-purple/30">
                      <CardContent className="pt-6 text-center">
                        <Award className="h-8 w-8 mx-auto mb-2 text-neon-lime" />
                        <h3 className="text-2xl font-bold">24.5</h3>
                        <p className="text-sm text-muted-foreground">Missões por Usuário</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-galaxy-dark border-galaxy-purple/30">
                      <CardContent className="pt-6 text-center">
                        <svg 
                          width="32" 
                          height="32" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          className="mx-auto mb-2 text-neon-cyan"
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="12" y1="8" x2="12" y2="12"/>
                          <line x1="12" y1="16" x2="12" y2="16"/>
                        </svg>
                        <h3 className="text-2xl font-bold">48,372</h3>
                        <p className="text-sm text-muted-foreground">Pontos por Usuário</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card className="bg-galaxy-dark border-galaxy-purple/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Engajamento por Missão</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={userActivityData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#1e1b4b', 
                                borderColor: '#818cf8',
                                borderRadius: '4px' 
                              }} 
                            />
                            <Legend />
                            <Bar dataKey="missoes" name="Missões Completadas" fill="#FF6B8B" />
                            <Bar dataKey="tickets" name="Pontos Ganhos" fill="#82ca9d" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      className="border-galaxy-purple/30 hover:bg-galaxy-purple/20"
                      onClick={() => handleDownloadReport('engajamento')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Exportar Relatório
                    </Button>
                    
                    <Select defaultValue="pdf">
                      <SelectTrigger className="w-[120px] bg-galaxy-dark border-galaxy-purple/30">
                        <SelectValue placeholder="Formato" />
                      </SelectTrigger>
                      <SelectContent className="bg-galaxy-deepPurple border-galaxy-purple/30">
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
                
                {/* Revenue Tab */}
                <TabsContent value="revenue" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="bg-galaxy-dark border-galaxy-purple/30">
                      <CardContent className="pt-6 text-center">
                        <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-green-500" />
                        <h3 className="text-2xl font-bold">R$ 124K</h3>
                        <p className="text-sm text-muted-foreground">Receita Total</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-galaxy-dark border-galaxy-purple/30">
                      <CardContent className="pt-6 text-center">
                        <UsersRound className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                        <h3 className="text-2xl font-bold">R$ 42</h3>
                        <p className="text-sm text-muted-foreground">ARPU (Média por Usuário)</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-galaxy-dark border-galaxy-purple/30">
                      <CardContent className="pt-6 text-center">
                        <TrendingUp className="h-8 w-8 mx-auto mb-2 text-neon-pink" />
                        <h3 className="text-2xl font-bold">18.5%</h3>
                        <p className="text-sm text-muted-foreground">Crescimento MoM</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card className="bg-galaxy-dark border-galaxy-purple/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Receita por Fonte</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#1e1b4b', 
                                borderColor: '#818cf8',
                                borderRadius: '4px' 
                              }} 
                            />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="vendas" 
                              name="Vendas Diretas"
                              stroke="#82ca9d" 
                              activeDot={{ r: 8 }} 
                            />
                            <Line 
                              type="monotone" 
                              dataKey="anuncios" 
                              name="Anúncios"
                              stroke="#FF6B8B"
                            />
                            <Line 
                              type="monotone" 
                              dataKey="assinaturas" 
                              name="Assinaturas"
                              stroke="#8884d8" 
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      className="border-galaxy-purple/30 hover:bg-galaxy-purple/20"
                      onClick={() => handleDownloadReport('receita')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Exportar Relatório
                    </Button>
                    
                    <Select defaultValue="pdf">
                      <SelectTrigger className="w-[120px] bg-galaxy-dark border-galaxy-purple/30">
                        <SelectValue placeholder="Formato" />
                      </SelectTrigger>
                      <SelectContent className="bg-galaxy-deepPurple border-galaxy-purple/30">
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default AdvancedReporting;
