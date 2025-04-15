
import { motion } from "framer-motion";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardHeader from "@/components/admin/DashboardHeader";
import { useMediaQuery } from "@/hooks/use-mobile";
import { FileText, Plus, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface Rule {
  id: number;
  name: string;
  description: string;
  active: boolean;
  type: 'system' | 'user' | 'mission' | 'lottery';
  lastUpdated: string;
}

const RulesPage = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const [rules, setRules] = useState<Rule[]>([
    {
      id: 1,
      name: "Limite de Missões Diárias",
      description: "Usuários podem completar no máximo 5 missões por dia",
      active: true,
      type: 'user',
      lastUpdated: "2025-03-15"
    },
    {
      id: 2,
      name: "Pontos por Indicação",
      description: "Usuários ganham 100 pontos por cada indicação confirmada",
      active: true,
      type: 'user',
      lastUpdated: "2025-03-10"
    },
    {
      id: 3,
      name: "Regra de Conversão de Tickets",
      description: "Cada 500 pontos podem ser convertidos em 1 ticket para sorteios",
      active: true,
      type: 'lottery',
      lastUpdated: "2025-03-05"
    },
    {
      id: 4,
      name: "Autorização de Missões",
      description: "Missões enviadas por usuários precisam ser aprovadas por um moderador",
      active: false,
      type: 'mission',
      lastUpdated: "2025-02-28"
    },
  ]);
  
  const toggleRuleStatus = (id: number) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, active: !rule.active } : rule
    ));
  };
  
  const getRuleTypeColor = (type: string) => {
    switch(type) {
      case 'system': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'user': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'mission': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'lottery': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <AdminSidebar />
        <SidebarInset className="overflow-y-auto pb-20 fancy-scrollbar">
          <div className="container px-4 py-6 sm:py-8 mx-auto max-w-7xl">
            <DashboardHeader 
              title="Regras do Sistema" 
              subtitle="Gerenciamento das regras e políticas do sistema" 
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 sm:mt-8"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="relative w-64">
                    <input
                      type="text"
                      placeholder="Buscar regras..."
                      className="w-full pl-10 pr-4 py-2 rounded-md border border-galaxy-purple/30 bg-galaxy-deepPurple/20 text-white"
                    />
                    <svg
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                  </div>
                  
                  <select className="px-4 py-2 rounded-md border border-galaxy-purple/30 bg-galaxy-deepPurple/20 text-white">
                    <option value="all">Todos os tipos</option>
                    <option value="system">Sistema</option>
                    <option value="user">Usuário</option>
                    <option value="mission">Missão</option>
                    <option value="lottery">Sorteio</option>
                  </select>
                </div>
                
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Nova Regra
                </Button>
              </div>
              
              <Card className="bg-galaxy-deepPurple/10 border-galaxy-purple/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-neon-pink" />
                    Regras do Sistema
                  </CardTitle>
                  <CardDescription>
                    Gerencie as regras que controlam o comportamento do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-galaxy-purple/20">
                          <th className="px-4 py-3 text-left">Nome</th>
                          <th className="px-4 py-3 text-left">Descrição</th>
                          <th className="px-4 py-3 text-left">Tipo</th>
                          <th className="px-4 py-3 text-left">Última Atualização</th>
                          <th className="px-4 py-3 text-left">Status</th>
                          <th className="px-4 py-3 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rules.map((rule) => (
                          <tr key={rule.id} className="border-b border-galaxy-purple/10 hover:bg-galaxy-purple/5">
                            <td className="px-4 py-3 font-medium">{rule.name}</td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">{rule.description}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${getRuleTypeColor(rule.type)}`}>
                                {rule.type.charAt(0).toUpperCase() + rule.type.slice(1)}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">{rule.lastUpdated}</td>
                            <td className="px-4 py-3">
                              <Switch 
                                checked={rule.active} 
                                onCheckedChange={() => toggleRuleStatus(rule.id)}
                              />
                            </td>
                            <td className="px-4 py-3 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem className="flex items-center gap-2">
                                    <Edit className="h-4 w-4" /> Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="flex items-center gap-2 text-red-500">
                                    <Trash2 className="h-4 w-4" /> Excluir
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6 bg-galaxy-deepPurple/10 border-galaxy-purple/30">
                <CardHeader>
                  <CardTitle>Configurações de Regras</CardTitle>
                  <CardDescription>
                    Configurações globais para o sistema de regras
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="font-medium">Modo de Manutenção de Regras</h4>
                        <p className="text-sm text-muted-foreground">
                          Desativa temporariamente todas as regras durante manutenções
                        </p>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="font-medium">Notificações de Alterações</h4>
                        <p className="text-sm text-muted-foreground">
                          Notificar usuários quando regras são alteradas
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="font-medium">Registro de Auditoria</h4>
                        <p className="text-sm text-muted-foreground">
                          Registrar todas as alterações nas regras para auditoria
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default RulesPage;
