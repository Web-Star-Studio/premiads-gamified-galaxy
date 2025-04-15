
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  RefreshCw, Server, Database, Cpu, Globe, ChevronDown, ChevronUp, 
  AlertTriangle, CheckCircle, Activity, Zap, Timer, BarChart
} from 'lucide-react';
import { useSounds } from '@/hooks/use-sounds';
import { toast } from "@/hooks/use-toast";
import LoadingParticles from './LoadingParticles';

// Mock data for services
const initialServices = [
  { 
    id: 1, 
    name: 'API Gateway', 
    status: 'operational', 
    uptime: 99.98, 
    responseTime: 78,
    lastIncident: '2025-03-15',
    metrics: {
      cpu: 23,
      memory: 45,
      diskSpace: 38,
      network: 32
    }
  },
  { 
    id: 2, 
    name: 'Database Cluster', 
    status: 'operational', 
    uptime: 99.95, 
    responseTime: 45,
    lastIncident: '2025-02-28',
    metrics: {
      cpu: 42,
      memory: 65,
      diskSpace: 72,
      network: 28
    }
  },
  { 
    id: 3, 
    name: 'Authentication Service', 
    status: 'degraded', 
    uptime: 98.75, 
    responseTime: 320,
    lastIncident: '2025-04-12',
    metrics: {
      cpu: 78,
      memory: 82,
      diskSpace: 45,
      network: 65
    }
  },
  { 
    id: 4, 
    name: 'Storage Service', 
    status: 'operational', 
    uptime: 99.99, 
    responseTime: 62,
    lastIncident: '2025-01-10',
    metrics: {
      cpu: 18,
      memory: 32,
      diskSpace: 76,
      network: 22
    }
  },
  { 
    id: 5, 
    name: 'Payment Processing', 
    status: 'operational', 
    uptime: 99.97, 
    responseTime: 135,
    lastIncident: '2025-03-22',
    metrics: {
      cpu: 35,
      memory: 48,
      diskSpace: 29,
      network: 40
    }
  },
];

// Mock data for recent incidents
const recentIncidents = [
  {
    id: 1,
    service: 'Authentication Service',
    type: 'Performance Degradation',
    startTime: '2025-04-12 14:28:15',
    endTime: '2025-04-12 16:45:32',
    impact: 'Medium',
    resolution: 'Scaled up server resources and optimized database queries'
  },
  {
    id: 2,
    service: 'API Gateway',
    type: 'Brief Outage',
    startTime: '2025-03-15 08:12:45',
    endTime: '2025-03-15 08:32:18',
    impact: 'High',
    resolution: 'Restarted services and applied configuration fix'
  },
  {
    id: 3,
    service: 'Database Cluster',
    type: 'High Latency',
    startTime: '2025-02-28 19:05:30',
    endTime: '2025-02-28 20:15:45',
    impact: 'Low',
    resolution: 'Optimized indexing and cleared query cache'
  }
];

const PlatformMonitoring: React.FC = () => {
  const [services, setServices] = useState(initialServices);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedService, setExpandedService] = useState<number | null>(null);
  const { playSound } = useSounds();

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    playSound('pop');
    
    setTimeout(() => {
      // Simulate a small change in metrics
      const updatedServices = services.map(service => ({
        ...service,
        metrics: {
          cpu: Math.min(100, Math.max(5, service.metrics.cpu + (Math.random() * 10 - 5))),
          memory: Math.min(100, Math.max(5, service.metrics.memory + (Math.random() * 10 - 5))),
          diskSpace: Math.min(100, Math.max(5, service.metrics.diskSpace + (Math.random() * 5 - 2))),
          network: Math.min(100, Math.max(5, service.metrics.network + (Math.random() * 15 - 7))),
        },
        responseTime: Math.max(20, service.responseTime + (Math.random() * 40 - 20))
      }));
      
      setServices(updatedServices);
      setRefreshing(false);
      
      toast({
        title: "Dados atualizados",
        description: `Monitoramento atualizado: ${new Date().toLocaleTimeString()}`,
      });
    }, 1500);
  };

  const toggleServiceExpansion = (serviceId: number) => {
    setExpandedService(expandedService === serviceId ? null : serviceId);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'operational':
        return <Badge className="bg-emerald-600 hover:bg-emerald-700">Operacional</Badge>;
      case 'degraded':
        return <Badge className="bg-amber-500 hover:bg-amber-600">Degradado</Badge>;
      case 'outage':
        return <Badge className="bg-red-600 hover:bg-red-700">Fora do ar</Badge>;
      default:
        return <Badge className="bg-slate-600">Desconhecido</Badge>;
    }
  };

  const getMetricColor = (value: number) => {
    if (value < 50) return 'text-emerald-500';
    if (value < 80) return 'text-amber-500';
    return 'text-red-500';
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
                  <Server className="h-5 w-5 mr-2 text-neon-cyan" />
                  Monitoramento da Plataforma
                </CardTitle>
                <CardDescription>
                  Supervisione o funcionamento geral do sistema e seus componentes.
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-galaxy-purple/30 hover:bg-galaxy-purple/20"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-60 relative">
                <LoadingParticles />
                <div className="w-12 h-12 border-4 border-t-neon-pink border-galaxy-purple rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <Card className="bg-galaxy-dark border-galaxy-purple/30">
                    <CardContent className="pt-6 flex flex-col items-center">
                      <div className="w-12 h-12 bg-emerald-500/20 flex items-center justify-center rounded-full mb-3">
                        <CheckCircle className="h-6 w-6 text-emerald-500" />
                      </div>
                      <h3 className="text-lg font-bold">4 de 5</h3>
                      <p className="text-sm text-muted-foreground">Serviços operacionais</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-galaxy-dark border-galaxy-purple/30">
                    <CardContent className="pt-6 flex flex-col items-center">
                      <div className="w-12 h-12 bg-amber-500/20 flex items-center justify-center rounded-full mb-3">
                        <AlertTriangle className="h-6 w-6 text-amber-500" />
                      </div>
                      <h3 className="text-lg font-bold">1</h3>
                      <p className="text-sm text-muted-foreground">Serviços degradados</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-galaxy-dark border-galaxy-purple/30">
                    <CardContent className="pt-6 flex flex-col items-center">
                      <div className="w-12 h-12 bg-blue-500/20 flex items-center justify-center rounded-full mb-3">
                        <Activity className="h-6 w-6 text-blue-500" />
                      </div>
                      <h3 className="text-lg font-bold">99.73%</h3>
                      <p className="text-sm text-muted-foreground">Uptime médio</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-galaxy-dark border-galaxy-purple/30">
                    <CardContent className="pt-6 flex flex-col items-center">
                      <div className="w-12 h-12 bg-purple-500/20 flex items-center justify-center rounded-full mb-3">
                        <Zap className="h-6 w-6 text-purple-500" />
                      </div>
                      <h3 className="text-lg font-bold">128ms</h3>
                      <p className="text-sm text-muted-foreground">Tempo médio de resposta</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="rounded-md border border-galaxy-purple/30 overflow-hidden mb-6">
                  <Table>
                    <TableHeader className="bg-galaxy-dark">
                      <TableRow>
                        <TableHead>Serviço</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden md:table-cell">Uptime</TableHead>
                        <TableHead className="hidden md:table-cell">Tempo de Resposta</TableHead>
                        <TableHead>Detalhes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {services.map((service) => (
                        <React.Fragment key={service.id}>
                          <TableRow className="border-t border-galaxy-purple/30">
                            <TableCell className="font-medium">{service.name}</TableCell>
                            <TableCell>{getStatusBadge(service.status)}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="flex items-center gap-2">
                                <Progress value={service.uptime} className="h-2 w-16" />
                                <span>{service.uptime.toFixed(2)}%</span>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <span className={
                                service.responseTime < 100 ? 'text-emerald-500' : 
                                service.responseTime < 200 ? 'text-amber-500' : 'text-red-500'
                              }>
                                {Math.round(service.responseTime)}ms
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => toggleServiceExpansion(service.id)}
                                className="p-0 h-8 hover:bg-galaxy-purple/20"
                              >
                                {expandedService === service.id ? 
                                  <ChevronUp className="h-4 w-4" /> : 
                                  <ChevronDown className="h-4 w-4" />
                                }
                              </Button>
                            </TableCell>
                          </TableRow>
                          
                          {expandedService === service.id && (
                            <TableRow className="border-t border-galaxy-purple/10 bg-galaxy-deepPurple/30">
                              <TableCell colSpan={5} className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">CPU</p>
                                    <div className="flex items-center gap-2">
                                      <Progress value={service.metrics.cpu} className="h-2" />
                                      <span className={`text-sm ${getMetricColor(service.metrics.cpu)}`}>
                                        {Math.round(service.metrics.cpu)}%
                                      </span>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">Memória</p>
                                    <div className="flex items-center gap-2">
                                      <Progress value={service.metrics.memory} className="h-2" />
                                      <span className={`text-sm ${getMetricColor(service.metrics.memory)}`}>
                                        {Math.round(service.metrics.memory)}%
                                      </span>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">Espaço em Disco</p>
                                    <div className="flex items-center gap-2">
                                      <Progress value={service.metrics.diskSpace} className="h-2" />
                                      <span className={`text-sm ${getMetricColor(service.metrics.diskSpace)}`}>
                                        {Math.round(service.metrics.diskSpace)}%
                                      </span>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">Rede</p>
                                    <div className="flex items-center gap-2">
                                      <Progress value={service.metrics.network} className="h-2" />
                                      <span className={`text-sm ${getMetricColor(service.metrics.network)}`}>
                                        {Math.round(service.metrics.network)}%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="mt-4">
                                  <p className="text-sm text-muted-foreground mb-1">Último Incidente</p>
                                  <p className="text-sm">{service.lastIncident || "Nenhum incidente registrado"}</p>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <h3 className="text-lg font-semibold mb-4 mt-8">Incidentes Recentes</h3>
                <div className="rounded-md border border-galaxy-purple/30 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-galaxy-dark">
                      <TableRow>
                        <TableHead>Serviço</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead className="hidden md:table-cell">Início</TableHead>
                        <TableHead className="hidden md:table-cell">Fim</TableHead>
                        <TableHead>Impacto</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentIncidents.map((incident) => (
                        <TableRow key={incident.id} className="border-t border-galaxy-purple/30">
                          <TableCell className="font-medium">{incident.service}</TableCell>
                          <TableCell>{incident.type}</TableCell>
                          <TableCell className="hidden md:table-cell">{incident.startTime}</TableCell>
                          <TableCell className="hidden md:table-cell">{incident.endTime}</TableCell>
                          <TableCell>
                            <Badge 
                              className={
                                incident.impact === 'Low' ? 'bg-emerald-600' :
                                incident.impact === 'Medium' ? 'bg-amber-500' : 'bg-red-600'
                              }
                            >
                              {incident.impact}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default PlatformMonitoring;
