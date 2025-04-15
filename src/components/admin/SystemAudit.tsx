
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ClipboardList, Search, Filter, Calendar, RefreshCw, User, Clock, AlertTriangle 
} from 'lucide-react';
import LoadingParticles from './LoadingParticles';

// Mock audit log data
const initialLogs = [
  { 
    id: 1, 
    action: 'login', 
    user: 'admin@example.com', 
    timestamp: '2025-04-15T09:32:15', 
    details: 'Login bem-sucedido', 
    severity: 'info' 
  },
  { 
    id: 2, 
    action: 'create', 
    user: 'maria@example.com', 
    timestamp: '2025-04-15T09:30:05', 
    details: 'Usuário criado: carlos@example.com', 
    severity: 'info' 
  },
  { 
    id: 3, 
    action: 'update', 
    user: 'admin@example.com', 
    timestamp: '2025-04-15T09:28:30', 
    details: 'Permissões atualizadas para maria@example.com', 
    severity: 'info' 
  },
  { 
    id: 4, 
    action: 'error', 
    user: 'pedro@example.com', 
    timestamp: '2025-04-15T09:25:10', 
    details: 'Tentativa de acesso não autorizado: módulo de Administração', 
    severity: 'error' 
  },
  { 
    id: 5, 
    action: 'delete', 
    user: 'admin@example.com', 
    timestamp: '2025-04-15T09:20:45', 
    details: 'Usuário removido: teste@example.com', 
    severity: 'warning' 
  },
];

// Continuous mock log generation
const generateRandomLog = (id: number) => {
  const actions = ['login', 'logout', 'create', 'update', 'delete', 'error', 'access'];
  const users = ['admin@example.com', 'maria@example.com', 'pedro@example.com', 'carlos@example.com', 'ana@example.com'];
  const severities = ['info', 'warning', 'error'];
  const details = [
    'Login bem-sucedido',
    'Logout realizado',
    'Usuário criado',
    'Permissões atualizadas',
    'Perfil editado',
    'Usuário removido',
    'Senha alterada',
    'Tentativa de acesso não autorizado',
    'Erro no sistema: falha de conexão',
    'Arquivo enviado',
    'Notificação enviada'
  ];
  
  const action = actions[Math.floor(Math.random() * actions.length)];
  const user = users[Math.floor(Math.random() * users.length)];
  const detail = details[Math.floor(Math.random() * details.length)];
  let severity;
  
  if (action === 'error') {
    severity = 'error';
  } else if (action === 'delete') {
    severity = 'warning';
  } else {
    severity = severities[Math.floor(Math.random() * (severities.length - 1))];
  }
  
  const now = new Date();
  
  return {
    id,
    action,
    user,
    timestamp: now.toISOString(),
    details: `${detail}${action === 'create' || action === 'delete' ? ': ' + users[Math.floor(Math.random() * users.length)] : ''}`,
    severity
  };
};

const SystemAudit = () => {
  const [logs, setLogs] = useState(initialLogs);
  const [filteredLogs, setFilteredLogs] = useState(initialLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedAction, setSelectedAction] = useState('all');
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const logContainerRef = useRef<HTMLDivElement>(null);
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);
  
  // Filter logs based on search query and filters
  useEffect(() => {
    let result = logs;
    
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(log => 
        log.user.toLowerCase().includes(query) || 
        log.details.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query)
      );
    }
    
    if (selectedSeverity !== 'all') {
      result = result.filter(log => log.severity === selectedSeverity);
    }
    
    if (selectedAction !== 'all') {
      result = result.filter(log => log.action === selectedAction);
    }
    
    setFilteredLogs(result);
  }, [searchQuery, selectedSeverity, selectedAction, logs]);
  
  // Continuously generate new logs if autoRefresh is enabled
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      const newLog = generateRandomLog(logs.length + 1);
      setLogs(prev => [newLog, ...prev].slice(0, 100)); // Keep only the last 100 logs for performance
    }, 3000); // Generate a new log every 3 seconds
    
    return () => clearInterval(interval);
  }, [logs, autoRefresh]);
  
  // Scroll to the top when new logs are added if at the top
  useEffect(() => {
    if (logContainerRef.current && logContainerRef.current.scrollTop < 50) {
      logContainerRef.current.scrollTop = 0;
    }
  }, [logs]);
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  
  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'error': return 'bg-red-500 text-white';
      case 'warning': return 'bg-yellow-500 text-galaxy-dark';
      default: return 'bg-neon-cyan text-galaxy-dark';
    }
  };
  
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login': return <User className="h-4 w-4" />;
      case 'logout': return <User className="h-4 w-4" />;
      case 'create': return <User className="h-4 w-4 text-neon-lime" />;
      case 'update': return <RefreshCw className="h-4 w-4 text-neon-cyan" />;
      case 'delete': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <ClipboardList className="h-4 w-4" />;
    }
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
            <CardTitle className="text-xl font-heading text-white">Auditoria do Sistema</CardTitle>
            <CardDescription>
              Visualize logs e eventos do sistema em tempo real.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
              <div className="relative w-full md:w-auto flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar logs..."
                  className="pl-10 bg-galaxy-dark border-galaxy-purple/30"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <select
                  className="bg-galaxy-dark border border-galaxy-purple/30 rounded-md px-3 py-2 text-sm"
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                >
                  <option value="all">Todas Severidades</option>
                  <option value="info">Informações</option>
                  <option value="warning">Alertas</option>
                  <option value="error">Erros</option>
                </select>
                
                <select
                  className="bg-galaxy-dark border border-galaxy-purple/30 rounded-md px-3 py-2 text-sm"
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                >
                  <option value="all">Todas Ações</option>
                  <option value="login">Login</option>
                  <option value="logout">Logout</option>
                  <option value="create">Criação</option>
                  <option value="update">Atualização</option>
                  <option value="delete">Remoção</option>
                  <option value="error">Erro</option>
                  <option value="access">Acesso</option>
                </select>
                
                <Button 
                  variant={autoRefresh ? "default" : "outline"} 
                  size="sm" 
                  className={autoRefresh ? "bg-neon-pink hover:bg-neon-pink/80" : "border-galaxy-purple/30"}
                  onClick={() => setAutoRefresh(!autoRefresh)}
                >
                  <RefreshCw className={`h-4 w-4 mr-1 ${autoRefresh ? 'animate-spin' : ''}`} />
                  {autoRefresh ? 'Ao Vivo' : 'Atualizar'}
                </Button>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-60 relative">
                <LoadingParticles />
                <div className="w-12 h-12 border-4 border-t-neon-pink border-galaxy-purple rounded-full animate-spin"></div>
              </div>
            ) : (
              <div 
                ref={logContainerRef}
                className="rounded-md border border-galaxy-purple/30 bg-galaxy-dark h-[500px] overflow-y-auto fancy-scrollbar"
              >
                <AnimatePresence>
                  {filteredLogs.length > 0 ? (
                    <div className="py-2">
                      {filteredLogs.map((log, index) => (
                        <motion.div
                          key={log.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                          className={`px-4 py-3 border-b border-galaxy-purple/20 hover:bg-galaxy-deepPurple/50 transition-colors ${
                            log.severity === 'error' ? 'bg-red-500/10' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start">
                              <div className="mr-3 pt-0.5">
                                {getActionIcon(log.action)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">{log.user}</span>
                                  <Badge className={getSeverityClass(log.severity)}>
                                    {log.severity === 'error' ? 'Erro' : log.severity === 'warning' ? 'Alerta' : 'Info'}
                                  </Badge>
                                </div>
                                <p className={`text-sm ${log.severity === 'error' ? 'text-red-300' : 'text-muted-foreground'}`}>
                                  {log.details}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatTimestamp(log.timestamp)}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-full text-muted-foreground">
                      Nenhum log encontrado com os filtros selecionados.
                    </div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default SystemAudit;
