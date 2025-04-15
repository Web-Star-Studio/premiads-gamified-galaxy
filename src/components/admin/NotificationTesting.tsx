
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, Mail, MessageSquare, Send, CheckCircle, User, Users, UserCheck, 
  CheckCheck, Filter, Search, Calendar
} from 'lucide-react';
import LoadingParticles from './LoadingParticles';
import { useSounds } from '@/hooks/use-sounds';
import { toast } from '@/hooks/use-toast';

// Mock user profiles for targeting
const mockUserProfiles = [
  { id: 1, name: 'João Silva', email: 'joao@example.com', role: 'admin', avatar: '👨‍💼' },
  { id: 2, name: 'Maria Souza', email: 'maria@example.com', role: 'anunciante', avatar: '👩‍💼' },
  { id: 3, name: 'Pedro Santos', email: 'pedro@example.com', role: 'participante', avatar: '👨‍🦱' },
  { id: 4, name: 'Ana Costa', email: 'ana@example.com', role: 'moderator', avatar: '👩‍🦰' },
  { id: 5, name: 'Todos os Administradores', email: '', role: 'admin_group', avatar: '👥' },
  { id: 6, name: 'Todos os Anunciantes', email: '', role: 'advertiser_group', avatar: '👥' },
  { id: 7, name: 'Todos os Participantes', email: '', role: 'participant_group', avatar: '👥' },
];

// Mock notification templates
const mockTemplates = [
  { id: 1, name: 'Boas-vindas', subject: 'Bem-vindo ao sistema!', body: 'Olá {name}, seja bem-vindo à nossa plataforma.' },
  { id: 2, name: 'Nova campanha', subject: 'Nova campanha disponível', body: 'Uma nova campanha foi publicada e está disponível para participação.' },
  { id: 3, name: 'Alerta de segurança', subject: 'Alerta de segurança', body: 'Detectamos um acesso incomum à sua conta.' },
  { id: 4, name: 'Atualização do sistema', subject: 'Sistema atualizado', body: 'O sistema foi atualizado com novos recursos.' },
];

const NotificationTesting = () => {
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const [notificationType, setNotificationType] = useState('all');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(mockUserProfiles);
  const { playSound } = useSounds();
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);
  
  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(mockUserProfiles);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(mockUserProfiles.filter(user => 
        user.name.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
      ));
    }
  }, [searchQuery]);
  
  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    
    if (selectedTemplate) {
      // Replace template variables with user data
      let newMessage = selectedTemplate.body;
      if (user.name) {
        newMessage = newMessage.replace('{name}', user.name);
      }
      setMessage(newMessage);
    }
  };
  
  const handleSelectTemplate = (template: any) => {
    setSelectedTemplate(template);
    setSubject(template.subject);
    
    let newMessage = template.body;
    if (selectedUser && selectedUser.name) {
      newMessage = newMessage.replace('{name}', selectedUser.name);
    }
    setMessage(newMessage);
  };
  
  const handleSendNotification = () => {
    if (!selectedUser) {
      toast({
        title: "Erro",
        description: "Selecione um destinatário para a notificação.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    setTimeout(() => {
      // Show success toast
      toast({
        title: "Notificação Enviada",
        description: `A notificação foi enviada com sucesso para ${selectedUser.name}.`,
      });
      
      // Play notification sound
      playSound('chime');
      
      // Display a simulated notification toast if type includes in-app
      if (notificationType === 'all' || notificationType === 'in-app') {
        setTimeout(() => {
          toast({
            title: subject || "Nova notificação",
            description: message || "Você recebeu uma nova notificação.",
          });
          
          playSound('pop');
        }, 1000);
      }
      
      // Show email preview for email notifications
      if (notificationType === 'all' || notificationType === 'email') {
        setShowPreview(true);
      }
      
      setLoading(false);
    }, 1500);
  };
  
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
      case 'admin_group':
        return <Badge className="bg-neon-pink text-white">Admin</Badge>;
      case 'moderator':
        return <Badge className="bg-neon-cyan text-galaxy-dark">Moderador</Badge>;
      case 'anunciante':
      case 'advertiser_group':
        return <Badge className="bg-neon-lime text-galaxy-dark">Anunciante</Badge>;
      case 'participante':
      case 'participant_group':
        return <Badge className="bg-galaxy-purple text-white">Participante</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
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
            <CardTitle className="text-xl font-heading text-white flex items-center">
              <Bell className="h-5 w-5 mr-2 text-neon-pink" />
              Teste de Notificações
            </CardTitle>
            <CardDescription>
              Envie notificações de teste para qualquer usuário ou grupo de usuários.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-60 relative">
                <LoadingParticles />
                <div className="w-12 h-12 border-4 border-t-neon-pink border-galaxy-purple rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <div className="bg-galaxy-dark rounded-md border border-galaxy-purple/30 p-4 mb-6">
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <User className="h-4 w-4 mr-2 text-neon-cyan" />
                      Destinatários
                    </h3>
                    
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Buscar usuários..."
                        className="pl-10 bg-galaxy-deepPurple border-galaxy-purple/30"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2 max-h-[300px] overflow-y-auto fancy-scrollbar pr-2 pb-2">
                      {filteredUsers.map(user => (
                        <div
                          key={user.id}
                          className={`p-3 rounded-md border cursor-pointer transition-all duration-200 ${
                            selectedUser?.id === user.id 
                              ? 'border-neon-cyan bg-galaxy-deepPurple/70 shadow-[0_0_10px_rgba(0,255,231,0.3)]' 
                              : 'border-galaxy-purple/30 hover:border-galaxy-purple/60 bg-galaxy-deepPurple/30'
                          }`}
                          onClick={() => handleSelectUser(user)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="text-2xl mr-3">{user.avatar}</div>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                {user.email && (
                                  <div className="text-xs text-muted-foreground">
                                    {user.email}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>{getRoleBadge(user.role)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-galaxy-dark rounded-md border border-galaxy-purple/30 p-4">
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2 text-neon-lime" />
                      Templates
                    </h3>
                    
                    <div className="space-y-2 max-h-[200px] overflow-y-auto fancy-scrollbar pr-2 pb-2">
                      {mockTemplates.map(template => (
                        <div
                          key={template.id}
                          className={`p-3 rounded-md border cursor-pointer transition-all duration-200 ${
                            selectedTemplate?.id === template.id 
                              ? 'border-neon-lime bg-galaxy-deepPurple/70 shadow-[0_0_10px_rgba(180,241,10,0.3)]' 
                              : 'border-galaxy-purple/30 hover:border-galaxy-purple/60 bg-galaxy-deepPurple/30'
                          }`}
                          onClick={() => handleSelectTemplate(template)}
                        >
                          <div className="font-medium">{template.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {template.subject}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-2">
                  <div className="bg-galaxy-dark rounded-md border border-galaxy-purple/30 p-4 mb-6">
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <Bell className="h-4 w-4 mr-2 text-neon-pink" />
                      Compor Notificação
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="col-span-2">
                          <Label htmlFor="subject" className="text-sm text-muted-foreground mb-1 block">
                            Tipo de Notificação
                          </Label>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              type="button"
                              variant={notificationType === 'all' ? 'default' : 'outline'}
                              size="sm"
                              className={notificationType === 'all' ? 'bg-neon-pink hover:bg-neon-pink/80' : 'border-galaxy-purple/30'}
                              onClick={() => setNotificationType('all')}
                            >
                              <Bell className="h-4 w-4 mr-1" />
                              Todos
                            </Button>
                            <Button
                              type="button"
                              variant={notificationType === 'in-app' ? 'default' : 'outline'}
                              size="sm"
                              className={notificationType === 'in-app' ? 'bg-neon-lime hover:bg-neon-lime/80 text-galaxy-dark' : 'border-galaxy-purple/30'}
                              onClick={() => setNotificationType('in-app')}
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              App
                            </Button>
                            <Button
                              type="button"
                              variant={notificationType === 'email' ? 'default' : 'outline'}
                              size="sm"
                              className={notificationType === 'email' ? 'bg-neon-cyan hover:bg-neon-cyan/80 text-galaxy-dark' : 'border-galaxy-purple/30'}
                              onClick={() => setNotificationType('email')}
                            >
                              <Mail className="h-4 w-4 mr-1" />
                              Email
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="recipient" className="text-sm text-muted-foreground mb-1 block">
                            Destinatário
                          </Label>
                          <div className="h-9 px-3 py-1 rounded-md bg-galaxy-deepPurple border border-galaxy-purple/30 flex items-center">
                            {selectedUser ? (
                              <div className="flex items-center">
                                <span className="mr-1">{selectedUser.avatar}</span>
                                <span className="font-medium">{selectedUser.name}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Selecione um destinatário</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="subject" className="text-sm text-muted-foreground mb-1 block">
                            Assunto
                          </Label>
                          <Input
                            id="subject"
                            placeholder="Digite o assunto da notificação"
                            className="bg-galaxy-deepPurple border-galaxy-purple/30"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="message" className="text-sm text-muted-foreground mb-1 block">
                            Mensagem
                          </Label>
                          <textarea
                            id="message"
                            placeholder="Digite o conteúdo da notificação"
                            className="w-full min-h-[150px] p-3 rounded-md bg-galaxy-deepPurple border border-galaxy-purple/30 text-white"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                          />
                        </div>
                        
                        <div className="flex justify-end">
                          <Button
                            className="bg-neon-pink hover:bg-neon-pink/80 text-white"
                            onClick={handleSendNotification}
                            disabled={!selectedUser || (!subject && !message)}
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Enviar Notificação de Teste
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {showPreview && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white text-black rounded-md border border-galaxy-purple/30 overflow-hidden"
                    >
                      <div className="bg-galaxy-purple/20 p-3 flex justify-between items-center">
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 mr-2 text-galaxy-purple" />
                          <span className="font-medium">Simulação de Email</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-500"
                          onClick={() => setShowPreview(false)}
                        >
                          ✕
                        </Button>
                      </div>
                      <div className="p-4">
                        <div className="border-b pb-2 mb-3">
                          <div><strong>Para:</strong> {selectedUser?.email || 'grupo@example.com'}</div>
                          <div><strong>Assunto:</strong> {subject}</div>
                          <div className="text-gray-500 text-xs mt-1 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date().toLocaleString()}
                          </div>
                        </div>
                        <div className="py-4 whitespace-pre-wrap">
                          {message || 'Conteúdo da notificação...'}
                          
                          <div className="mt-4 text-gray-600 text-sm">
                            <p>Atenciosamente,</p>
                            <p>Equipe de Notificações</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
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

export default NotificationTesting;
