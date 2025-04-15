
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Headphones, Search, Filter, MessageSquare, CheckCircle2, Clock, 
  AlertCircle, PlusCircle, UserCircle, Send, ArrowUpRight, ClipboardCheck
} from 'lucide-react';
import { useSounds } from '@/hooks/use-sounds';
import { toast } from "@/hooks/use-toast";
import LoadingParticles from './LoadingParticles';

// Mock support tickets
const initialTickets = [
  { 
    id: 'TIC-1285', 
    title: 'Não consigo resgatar pontos', 
    requester: 'João Silva',
    requesterType: 'cliente',
    status: 'open', 
    priority: 'high',
    category: 'pontos',
    created: '2025-04-14 10:23:15',
    lastUpdate: '2025-04-14 14:45:22',
    assignedTo: 'Ana Souza',
    messages: [
      {
        id: 1,
        sender: 'João Silva',
        role: 'client',
        content: 'Estou tentando resgatar meus pontos há 3 dias e sempre recebo uma mensagem de erro que diz "Operação não permitida". Já tentei pelo aplicativo e pelo site.',
        timestamp: '2025-04-14 10:23:15'
      },
      {
        id: 2,
        sender: 'Sistema',
        role: 'system',
        content: 'Ticket aberto e categorizado como "Pontos". Prioridade definida como Alta.',
        timestamp: '2025-04-14 10:23:15'
      },
      {
        id: 3,
        sender: 'Ana Souza',
        role: 'support',
        content: 'Olá João, estou analisando seu caso. Poderia informar qual o valor em pontos que está tentando resgatar e para qual tipo de recompensa?',
        timestamp: '2025-04-14 14:45:22'
      }
    ]
  },
  { 
    id: 'TIC-1284', 
    title: 'Problemas com upload de imagens na campanha', 
    requester: 'Maria Oliveira',
    requesterType: 'anunciante',
    status: 'pending', 
    priority: 'medium',
    category: 'campanhas',
    created: '2025-04-14 09:12:33',
    lastUpdate: '2025-04-14 15:30:18',
    assignedTo: 'Pedro Santos',
    messages: [
      {
        id: 1,
        sender: 'Maria Oliveira',
        role: 'client',
        content: 'Não consigo fazer upload das imagens para minha nova campanha. O sistema trava no carregamento em 80%.',
        timestamp: '2025-04-14 09:12:33'
      },
      {
        id: 2,
        sender: 'Sistema',
        role: 'system',
        content: 'Ticket aberto e categorizado como "Campanhas". Prioridade definida como Média.',
        timestamp: '2025-04-14 09:12:33'
      },
      {
        id: 3,
        sender: 'Pedro Santos',
        role: 'support',
        content: 'Olá Maria, vamos verificar esse problema. Poderia informar qual o formato e tamanho das imagens que está tentando fazer upload?',
        timestamp: '2025-04-14 11:24:45'
      },
      {
        id: 4,
        sender: 'Maria Oliveira',
        role: 'client',
        content: 'São imagens JPG com tamanho entre 2MB e 4MB cada.',
        timestamp: '2025-04-14 13:10:02'
      },
      {
        id: 5,
        sender: 'Pedro Santos',
        role: 'support',
        content: 'Entendi. Estou verificando o sistema de upload. Aguarde mais alguns instantes enquanto identifico o problema.',
        timestamp: '2025-04-14 15:30:18'
      }
    ]
  },
  { 
    id: 'TIC-1280', 
    title: 'Missão não concluiu após realizar todas as etapas', 
    requester: 'Carlos Lima',
    requesterType: 'cliente',
    status: 'solved', 
    priority: 'medium',
    category: 'missões',
    created: '2025-04-13 16:45:10',
    lastUpdate: '2025-04-14 11:12:30',
    assignedTo: 'Ana Souza',
    messages: [
      {
        id: 1,
        sender: 'Carlos Lima',
        role: 'client',
        content: 'Completei todas as etapas da missão "Compartilhador Experiente" mas ela continua aparecendo como incompleta no meu painel.',
        timestamp: '2025-04-13 16:45:10'
      },
      {
        id: 2,
        sender: 'Ana Souza',
        role: 'support',
        content: 'Olá Carlos, vou verificar o status da sua missão no sistema. Um momento, por favor.',
        timestamp: '2025-04-13 17:30:22'
      },
      {
        id: 3,
        sender: 'Ana Souza',
        role: 'support',
        content: 'Identifiquei que a última etapa da missão não foi registrada corretamente. Já corrigi o problema e adicionei os pontos correspondentes à sua conta.',
        timestamp: '2025-04-14 09:15:45'
      },
      {
        id: 4,
        sender: 'Carlos Lima',
        role: 'client',
        content: 'Perfeito! Já consegui ver os pontos na minha conta. Muito obrigado pela ajuda!',
        timestamp: '2025-04-14 10:05:12'
      },
      {
        id: 5,
        sender: 'Ana Souza',
        role: 'support',
        content: 'Fico feliz que tenha sido resolvido! Estamos à disposição caso tenha mais alguma dúvida ou problema.',
        timestamp: '2025-04-14 11:12:30'
      }
    ]
  },
  { 
    id: 'TIC-1275', 
    title: 'Dúvida sobre integração com API', 
    requester: 'Rafael Costa',
    requesterType: 'anunciante',
    status: 'open', 
    priority: 'low',
    category: 'api',
    created: '2025-04-12 14:22:45',
    lastUpdate: '2025-04-13 16:40:10',
    assignedTo: 'Pedro Santos',
    messages: [
      {
        id: 1,
        sender: 'Rafael Costa',
        role: 'client',
        content: 'Gostaria de saber qual o procedimento para integrar meu sistema com a API de vocês para criação automática de campanhas.',
        timestamp: '2025-04-12 14:22:45'
      }
    ]
  },
  { 
    id: 'TIC-1268', 
    title: 'Problemas com pagamento', 
    requester: 'Juliana Mendes',
    requesterType: 'cliente',
    status: 'closed', 
    priority: 'high',
    category: 'pagamentos',
    created: '2025-04-10 09:30:15',
    lastUpdate: '2025-04-12 12:05:30',
    assignedTo: 'Ana Souza',
    messages: [
      {
        id: 1,
        sender: 'Juliana Mendes',
        role: 'client',
        content: 'Fui cobrada duas vezes pelo mesmo serviço. Gostaria de solicitar o estorno de uma das cobranças.',
        timestamp: '2025-04-10 09:30:15'
      }
    ]
  }
];

const TechnicalSupport: React.FC = () => {
  const [tickets, setTickets] = useState(initialTickets);
  const [filteredTickets, setFilteredTickets] = useState(initialTickets);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const { playSound } = useSounds();

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      if (tickets.length > 0) {
        setSelectedTicket(tickets[0]);
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Filter tickets when tab or search changes
  useEffect(() => {
    let result = tickets;
    
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(ticket => 
        ticket.id.toLowerCase().includes(query) || 
        ticket.title.toLowerCase().includes(query) ||
        ticket.requester.toLowerCase().includes(query)
      );
    }
    
    if (activeTab !== 'all') {
      result = result.filter(ticket => ticket.status === activeTab);
    }
    
    setFilteredTickets(result);
  }, [activeTab, searchQuery, tickets]);

  // Scroll to bottom of message list when a new message is added
  useEffect(() => {
    if (messageContainerRef.current && selectedTicket) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [selectedTicket?.messages]);

  const handleTicketSelect = (ticketId: string) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
      setSelectedTicket(ticket);
      playSound('pop');
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedTicket) return;
    
    setSendingMessage(true);
    
    setTimeout(() => {
      const updatedTickets = tickets.map(ticket => {
        if (ticket.id === selectedTicket.id) {
          const updatedTicket = { ...ticket };
          updatedTicket.messages.push({
            id: ticket.messages.length + 1,
            sender: 'Admin',
            role: 'support',
            content: newMessage,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
          });
          updatedTicket.lastUpdate = new Date().toISOString().replace('T', ' ').substring(0, 19);
          
          if (ticket.status === 'pending') {
            updatedTicket.status = 'open';
          }
          
          setSelectedTicket(updatedTicket);
          return updatedTicket;
        }
        return ticket;
      });
      
      setTickets(updatedTickets);
      setNewMessage('');
      setSendingMessage(false);
      
      playSound('message');
      
      toast({
        title: "Mensagem enviada",
        description: `Resposta enviada para o ticket ${selectedTicket.id}.`,
      });
    }, 800);
  };

  const handleUpdateTicketStatus = (ticketId: string, newStatus: string) => {
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        const updatedTicket = { 
          ...ticket, 
          status: newStatus,
          lastUpdate: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
        
        if (selectedTicket?.id === ticketId) {
          setSelectedTicket(updatedTicket);
        }
        
        return updatedTicket;
      }
      return ticket;
    });
    
    setTickets(updatedTickets);
    playSound('success');
    
    toast({
      title: "Status atualizado",
      description: `O ticket ${ticketId} foi marcado como ${
        newStatus === 'open' ? 'Em aberto' : 
        newStatus === 'pending' ? 'Pendente' : 
        newStatus === 'solved' ? 'Resolvido' : 'Fechado'
      }.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'open':
        return <Badge className="bg-blue-500">Em aberto</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500">Pendente</Badge>;
      case 'solved':
        return <Badge className="bg-emerald-600">Resolvido</Badge>;
      case 'closed':
        return <Badge className="bg-slate-500">Fechado</Badge>;
      default:
        return <Badge className="bg-slate-600">Desconhecido</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'high':
        return <Badge className="bg-red-600">Alta</Badge>;
      case 'medium':
        return <Badge className="bg-amber-500">Média</Badge>;
      case 'low':
        return <Badge className="bg-green-600">Baixa</Badge>;
      default:
        return <Badge className="bg-slate-600">Normal</Badge>;
    }
  };

  const getRequesterBadge = (type: string) => {
    switch(type) {
      case 'cliente':
        return <Badge className="bg-neon-lime text-black">Cliente</Badge>;
      case 'anunciante':
        return <Badge className="bg-neon-pink">Anunciante</Badge>;
      default:
        return <Badge className="bg-slate-600">Usuário</Badge>;
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
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl font-heading text-white flex items-center">
                  <Headphones className="h-5 w-5 mr-2 text-neon-pink" />
                  Suporte Técnico
                </CardTitle>
                <CardDescription>
                  Gerencie tickets de suporte e auxilie clientes e anunciantes com problemas técnicos.
                </CardDescription>
              </div>
              <Button 
                className="bg-neon-pink hover:bg-neon-pink/80"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Novo Ticket
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Buscar tickets..."
                        className="pl-10 bg-galaxy-dark border-galaxy-purple/30"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full mb-4">
                    <TabsList className="grid grid-cols-4 w-full">
                      <TabsTrigger value="all">Todos</TabsTrigger>
                      <TabsTrigger value="open">Abertos</TabsTrigger>
                      <TabsTrigger value="pending">Pendentes</TabsTrigger>
                      <TabsTrigger value="solved">Resolvidos</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  
                  <div className="rounded-md border border-galaxy-purple/30 overflow-hidden max-h-[65vh] overflow-y-auto">
                    {filteredTickets.length > 0 ? (
                      <div className="divide-y divide-galaxy-purple/20">
                        {filteredTickets.map(ticket => (
                          <div 
                            key={ticket.id}
                            className={`
                              p-3 hover:bg-galaxy-purple/10 cursor-pointer transition-colors
                              ${selectedTicket?.id === ticket.id ? 'bg-galaxy-purple/20' : ''}
                            `}
                            onClick={() => handleTicketSelect(ticket.id)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <h4 className="font-medium flex items-center gap-1">
                                  {ticket.id} 
                                  <span className="text-muted-foreground mx-1">·</span>
                                  {getRequesterBadge(ticket.requesterType)}
                                </h4>
                                <p className="text-sm line-clamp-1">{ticket.title}</p>
                              </div>
                              {getStatusBadge(ticket.status)}
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <div className="flex items-center gap-1">
                                <UserCircle className="h-3 w-3 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground">{ticket.requester}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground">{ticket.messages.length}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center">
                        <p className="text-muted-foreground">Nenhum ticket encontrado</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  {selectedTicket ? (
                    <Card className="border-galaxy-purple/30 bg-galaxy-dark h-full flex flex-col">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center gap-2 text-lg">
                              {selectedTicket.title}
                            </CardTitle>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <Badge variant="outline" className="border-muted-foreground">
                                {selectedTicket.id}
                              </Badge>
                              {getStatusBadge(selectedTicket.status)}
                              {getPriorityBadge(selectedTicket.priority)}
                              <Badge className="bg-purple-600">
                                {selectedTicket.category}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {selectedTicket.status !== 'solved' && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-neon-lime border-neon-lime/50 hover:bg-neon-lime/10"
                                onClick={() => handleUpdateTicketStatus(selectedTicket.id, 'solved')}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Resolver
                              </Button>
                            )}
                            {selectedTicket.status === 'solved' && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-slate-400 border-slate-400/50 hover:bg-slate-400/10"
                                onClick={() => handleUpdateTicketStatus(selectedTicket.id, 'closed')}
                              >
                                <ClipboardCheck className="h-4 w-4 mr-1" />
                                Fechar
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-neon-cyan border-neon-cyan/50 hover:bg-neon-cyan/10"
                            >
                              <ArrowUpRight className="h-4 w-4 mr-1" />
                              Escalar
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-col sm:flex-row justify-between text-xs text-muted-foreground">
                          <div>
                            <span className="font-medium">Solicitante:</span> {selectedTicket.requester}
                          </div>
                          <div>
                            <span className="font-medium">Atribuído para:</span> {selectedTicket.assignedTo}
                          </div>
                          <div>
                            <span className="font-medium">Criado em:</span> {selectedTicket.created}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 overflow-hidden p-0">
                        <div 
                          ref={messageContainerRef}
                          className="px-4 py-2 h-[calc(65vh-13rem)] overflow-y-auto space-y-4"
                        >
                          {selectedTicket.messages.map((message: any) => (
                            <div 
                              key={message.id} 
                              className={`flex flex-col ${
                                message.role === 'client' ? 'items-start' : 
                                message.role === 'support' ? 'items-end' : 'items-center'
                              }`}
                            >
                              <div 
                                className={`max-w-[80%] rounded-lg p-3 ${
                                  message.role === 'client' 
                                    ? 'bg-galaxy-purple/20 text-white' 
                                    : message.role === 'support'
                                      ? 'bg-neon-pink/20 text-white' 
                                      : 'bg-slate-700/30 text-slate-300 text-xs max-w-[90%]'
                                }`}
                              >
                                <div className="flex justify-between items-center mb-1">
                                  <span className="font-medium text-sm">
                                    {message.sender}
                                  </span>
                                  <span className="text-xs text-muted-foreground ml-2">
                                    {message.timestamp.split(' ')[1]}
                                  </span>
                                </div>
                                <p className="text-sm whitespace-pre-wrap">
                                  {message.content}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="border-t border-galaxy-purple/30 p-4">
                        {selectedTicket.status !== 'closed' ? (
                          <div className="w-full flex gap-2">
                            <Textarea 
                              placeholder="Digite sua mensagem..."
                              className="flex-1 bg-galaxy-deepPurple border-galaxy-purple/30 min-h-[60px]"
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleSendMessage();
                                }
                              }}
                            />
                            <Button 
                              className="bg-neon-pink hover:bg-neon-pink/80 self-end"
                              onClick={handleSendMessage}
                              disabled={sendingMessage || !newMessage.trim()}
                            >
                              <Send className={`h-4 w-4 ${sendingMessage ? 'animate-pulse' : ''}`} />
                            </Button>
                          </div>
                        ) : (
                          <div className="w-full text-center py-2 bg-slate-800/50 rounded-md">
                            <p className="text-sm text-muted-foreground">
                              Este ticket está fechado. Reabra-o para enviar mensagens.
                            </p>
                          </div>
                        )}
                      </CardFooter>
                    </Card>
                  ) : (
                    <Card className="h-full flex items-center justify-center border-galaxy-purple/30 bg-galaxy-dark">
                      <div className="text-center p-6">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Nenhum ticket selecionado</h3>
                        <p className="text-muted-foreground">
                          Selecione um ticket da lista para visualizar os detalhes e interagir.
                        </p>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default TechnicalSupport;
