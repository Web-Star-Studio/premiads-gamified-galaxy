
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, ShieldCheck, ShieldAlert, Users, Settings, FileText, BarChart4, AlertCircle } from 'lucide-react';
import LoadingParticles from './LoadingParticles';
import { useSounds } from '@/hooks/use-sounds';
import { toast } from '@/hooks/use-toast';

// Mock roles and permissions
const initialRoles = [
  { id: 1, name: 'Administrador', color: 'pink', description: 'Acesso completo ao sistema' },
  { id: 2, name: 'Moderador', color: 'cyan', description: 'Gerencia conteúdos e usuários' },
  { id: 3, name: 'Anunciante', color: 'lime', description: 'Cria e gerencia campanhas' },
  { id: 4, name: 'Participante', color: 'purple', description: 'Acesso básico à plataforma' },
];

const initialModules = [
  { id: 1, name: 'Usuários', icon: Users, description: 'Gerenciamento de usuários' },
  { id: 2, name: 'Configurações', icon: Settings, description: 'Configurações do sistema' },
  { id: 3, name: 'Relatórios', icon: FileText, description: 'Relatórios e estatísticas' },
  { id: 4, name: 'Dashboard', icon: BarChart4, description: 'Painéis de controle' },
  { id: 5, name: 'Permissões', icon: Shield, description: 'Controle de acesso' },
  { id: 6, name: 'Auditoria', icon: AlertCircle, description: 'Logs do sistema' },
];

// Initial role-module assignments
const initialAssignments = [
  { roleId: 1, moduleIds: [1, 2, 3, 4, 5, 6] }, // Admin has all
  { roleId: 2, moduleIds: [1, 3, 4] }, // Moderator
  { roleId: 3, moduleIds: [3, 4] }, // Advertiser
  { roleId: 4, moduleIds: [4] }, // Participant
];

const AccessControl = () => {
  const [roles, setRoles] = useState(initialRoles);
  const [modules, setModules] = useState(initialModules);
  const [assignments, setAssignments] = useState(initialAssignments);
  const [selectedRole, setSelectedRole] = useState<number | null>(1); // Default to first role
  const [loading, setLoading] = useState(true);
  const [pulsingBadges, setPulsingBadges] = useState<number[]>([]);
  const { playSound } = useSounds();

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const getModulesByRole = (roleId: number) => {
    const roleAssignment = assignments.find(a => a.roleId === roleId);
    return roleAssignment ? roleAssignment.moduleIds : [];
  };

  const handleToggleModule = (roleId: number, moduleId: number) => {
    setLoading(true);
    
    setTimeout(() => {
      setAssignments(prevAssignments => {
        const newAssignments = [...prevAssignments];
        const roleIndex = newAssignments.findIndex(a => a.roleId === roleId);
        
        if (roleIndex !== -1) {
          const moduleIds = [...newAssignments[roleIndex].moduleIds];
          const moduleIndex = moduleIds.indexOf(moduleId);
          
          if (moduleIndex !== -1) {
            // Remove module
            moduleIds.splice(moduleIndex, 1);
          } else {
            // Add module
            moduleIds.push(moduleId);
            // Add to pulsing badges
            setPulsingBadges(prev => [...prev, moduleId]);
            // Remove after animation
            setTimeout(() => {
              setPulsingBadges(prev => prev.filter(id => id !== moduleId));
            }, 1500);
            // Play sound
            playSound('pop');
          }
          
          newAssignments[roleIndex].moduleIds = moduleIds;
        }
        
        return newAssignments;
      });
      
      // Show toast
      const moduleName = modules.find(m => m.id === moduleId)?.name;
      const roleName = roles.find(r => r.id === roleId)?.name;
      
      toast({
        title: "Permissão atualizada",
        description: `Módulo ${moduleName} ${getModulesByRole(roleId).includes(moduleId) ? 'removido de' : 'adicionado ao'} papel ${roleName}`,
      });
      
      setLoading(false);
    }, 800);
  };

  const getRoleColor = (color: string) => {
    switch (color) {
      case 'pink': return 'bg-neon-pink text-white';
      case 'cyan': return 'bg-neon-cyan text-galaxy-dark';
      case 'lime': return 'bg-neon-lime text-galaxy-dark';
      case 'purple': return 'bg-galaxy-purple text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getModuleIcon = (moduleId: number) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return null;
    
    const Icon = module.icon;
    return <Icon className="h-4 w-4 mr-2" />;
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
            <CardTitle className="text-xl font-heading text-white">Controle de Acesso</CardTitle>
            <CardDescription>
              Gerencie papéis e permissões do sistema, definindo acesso a módulos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-60 relative">
                <LoadingParticles />
                <div className="w-12 h-12 border-4 border-t-neon-pink border-galaxy-purple rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <ShieldCheck className="h-5 w-5 mr-2 text-neon-cyan" /> 
                    Papéis
                  </h3>
                  <div className="space-y-2">
                    {roles.map(role => (
                      <div
                        key={role.id}
                        className={`p-3 rounded-md border cursor-pointer transition-all duration-200 ${
                          selectedRole === role.id 
                            ? 'border-neon-cyan bg-galaxy-dark/50 shadow-[0_0_10px_rgba(0,255,231,0.3)]' 
                            : 'border-galaxy-purple/30 hover:border-galaxy-purple/60'
                        }`}
                        onClick={() => setSelectedRole(role.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Badge className={`mr-2 ${getRoleColor(role.color)}`}>
                              {role.name}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {getModulesByRole(role.id).length} módulos
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          {role.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <ShieldAlert className="h-5 w-5 mr-2 text-neon-pink" /> 
                    Módulos e Permissões
                  </h3>
                  
                  {selectedRole !== null && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {modules.map(module => {
                        const isAssigned = getModulesByRole(selectedRole).includes(module.id);
                        const isPulsing = pulsingBadges.includes(module.id);
                        
                        return (
                          <div
                            key={module.id}
                            className={`p-3 rounded-md border border-galaxy-purple/30 relative transition-all duration-200 ${
                              isAssigned 
                                ? 'bg-galaxy-dark/50' 
                                : 'bg-transparent opacity-60'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center">
                                  <module.icon className={`h-5 w-5 mr-2 ${isAssigned ? 'text-neon-cyan' : 'text-muted-foreground'}`} />
                                  <span className="font-medium">{module.name}</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {module.description}
                                </p>
                              </div>
                              
                              <div>
                                <Badge 
                                  className={`
                                    ${isAssigned ? 'bg-neon-cyan text-galaxy-dark' : 'bg-muted text-muted-foreground'}
                                    ${isPulsing ? 'animate-pulse shadow-[0_0_10px_rgba(0,255,231,0.8)]' : ''}
                                  `}
                                >
                                  {isAssigned ? 'Ativo' : 'Inativo'}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <Button
                                variant={isAssigned ? "outline" : "default"}
                                size="sm"
                                className={`w-full ${
                                  isAssigned 
                                    ? 'border-red-500/50 text-red-500 hover:bg-red-500/20' 
                                    : 'bg-neon-cyan text-galaxy-dark hover:bg-neon-cyan/80'
                                }`}
                                onClick={() => handleToggleModule(selectedRole, module.id)}
                              >
                                {isAssigned ? 'Remover Acesso' : 'Conceder Acesso'}
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
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

export default AccessControl;
