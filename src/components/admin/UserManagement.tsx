
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { 
  UserPlus, Search, Filter, Trash2, Edit, CheckCircle, XCircle, RefreshCw 
} from 'lucide-react';
import { useSounds } from '@/hooks/use-sounds';
import { toast } from "@/hooks/use-toast";
import LoadingParticles from '@/components/admin/LoadingParticles';

// Mock user data
const mockUsers = [
  { id: 1, name: 'João Silva', email: 'joao@example.com', role: 'admin', status: 'active', lastLogin: '2025-04-14' },
  { id: 2, name: 'Maria Souza', email: 'maria@example.com', role: 'anunciante', status: 'active', lastLogin: '2025-04-13' },
  { id: 3, name: 'Pedro Santos', email: 'pedro@example.com', role: 'participante', status: 'inactive', lastLogin: '2025-04-10' },
  { id: 4, name: 'Ana Costa', email: 'ana@example.com', role: 'moderator', status: 'active', lastLogin: '2025-04-14' },
  { id: 5, name: 'Carlos Lima', email: 'carlos@example.com', role: 'anunciante', status: 'pending', lastLogin: '2025-04-11' },
];

const UserManagement = () => {
  const [users, setUsers] = useState(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const { playSound } = useSounds();

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter users based on search query and filters
  useEffect(() => {
    let result = users;
    
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query)
      );
    }
    
    if (selectedRole !== 'all') {
      result = result.filter(user => user.role === selectedRole);
    }
    
    if (selectedStatus !== 'all') {
      result = result.filter(user => user.status === selectedStatus);
    }
    
    setFilteredUsers(result);
  }, [searchQuery, selectedRole, selectedStatus, users]);

  const handleToggleStatus = (userId: number) => {
    setLoading(true);
    
    setTimeout(() => {
      setUsers(users.map(user => {
        if (user.id === userId) {
          const newStatus = user.status === 'active' ? 'inactive' : 'active';
          
          // Show toast notification
          toast({
            title: `Status alterado para ${newStatus === 'active' ? 'Ativo' : 'Inativo'}`,
            description: `O usuário ${user.name} foi ${newStatus === 'active' ? 'ativado' : 'desativado'}.`,
          });
          
          // Play sound effect
          playSound('pop');
          
          return { ...user, status: newStatus };
        }
        return user;
      }));
      
      setLoading(false);
    }, 800);
  };

  const handleDeleteUser = (userId: number) => {
    setLoading(true);
    
    setTimeout(() => {
      const userToDelete = users.find(user => user.id === userId);
      setUsers(users.filter(user => user.id !== userId));
      
      // Show toast notification
      if (userToDelete) {
        toast({
          title: "Usuário excluído",
          description: `O usuário ${userToDelete.name} foi removido do sistema.`,
          variant: "destructive",
        });
        
        // Play sound effect
        playSound('error');
      }
      
      setLoading(false);
    }, 800);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="grid grid-cols-1 gap-6">
          <Card className="bg-galaxy-deepPurple border-galaxy-purple/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-heading text-white">Gerenciamento de Usuários</CardTitle>
              <CardDescription>
                Gerencie todos os usuários da plataforma, altere permissões e status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                <div className="relative w-full md:w-auto flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar usuários..."
                    className="pl-10 bg-galaxy-dark border-galaxy-purple/30"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  <select
                    className="bg-galaxy-dark border border-galaxy-purple/30 rounded-md px-3 py-2 text-sm"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  >
                    <option value="all">Todos Papéis</option>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderador</option>
                    <option value="anunciante">Anunciante</option>
                    <option value="participante">Participante</option>
                  </select>
                  
                  <select
                    className="bg-galaxy-dark border border-galaxy-purple/30 rounded-md px-3 py-2 text-sm"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="all">Todos Status</option>
                    <option value="active">Ativos</option>
                    <option value="inactive">Inativos</option>
                    <option value="pending">Pendentes</option>
                  </select>
                  
                  <Button variant="outline" size="sm" className="border-galaxy-purple/30">
                    <Filter className="h-4 w-4 mr-1" />
                    Filtrar
                  </Button>
                </div>
                
                <Button className="bg-neon-pink hover:bg-neon-pink/80 text-white w-full md:w-auto">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Novo Usuário
                </Button>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center h-60 relative">
                  <LoadingParticles />
                  <div className="w-12 h-12 border-4 border-t-neon-pink border-galaxy-purple rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="rounded-md border border-galaxy-purple/30 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-galaxy-dark">
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Papel</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Último Login</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id} className="border-t border-galaxy-purple/30">
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={user.role === 'admin' ? 'default' : 'secondary'} 
                                className={
                                  user.role === 'admin' 
                                    ? 'bg-neon-pink text-white' 
                                    : user.role === 'moderator'
                                      ? 'bg-neon-cyan text-galaxy-dark'
                                      : 'bg-neon-lime/80 text-galaxy-dark'
                                }
                              >
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Switch 
                                  checked={user.status === 'active'} 
                                  onCheckedChange={() => handleToggleStatus(user.id)}
                                  className="data-[state=checked]:bg-neon-lime"
                                />
                                <span className={
                                  user.status === 'active'
                                    ? 'text-neon-lime'
                                    : user.status === 'inactive'
                                      ? 'text-red-500'
                                      : 'text-yellow-500'
                                }>
                                  {user.status === 'active' 
                                    ? 'Ativo' 
                                    : user.status === 'inactive'
                                      ? 'Inativo'
                                      : 'Pendente'
                                  }
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>{user.lastLogin}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-500"
                                  onClick={() => handleDeleteUser(user.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            Nenhum usuário encontrado com os filtros selecionados.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserManagement;
