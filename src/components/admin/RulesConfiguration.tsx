
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Save, FileText, PenSquare, AlertTriangle, CheckCircle2, 
  RefreshCw, LucideSparkles, Gift, BarChart3, Trophy, Ticket, Target
} from 'lucide-react';
import { useSounds } from '@/hooks/use-sounds';
import { toast } from "@/hooks/use-toast";
import LoadingParticles from './LoadingParticles';
import { useForm } from "react-hook-form";

// Mock rules categories
const ruleCategories = [
  { id: 'points', label: 'Sistema de Pontos', icon: BarChart3 },
  { id: 'missions', label: 'Missões', icon: Target },
  { id: 'rewards', label: 'Recompensas', icon: Trophy },
  { id: 'raffles', label: 'Sorteios', icon: Ticket },
];

// Mock rules data
const initialRules = {
  points: [
    { 
      id: 'dailyLoginPoints', 
      name: 'Pontos por Login Diário', 
      value: 50, 
      enabled: true,
      description: 'Pontos concedidos ao usuário por fazer login diariamente',
      lastModified: '2025-04-01'
    },
    { 
      id: 'missionCompletionPoints', 
      name: 'Multiplicador de Pontos por Missão', 
      value: 2, 
      enabled: true,
      description: 'Multiplicador aplicado aos pontos ganhos por completar missões',
      lastModified: '2025-04-05'
    },
    { 
      id: 'referralPoints', 
      name: 'Pontos por Indicação', 
      value: 500, 
      enabled: true,
      description: 'Pontos concedidos ao usuário que indicar um novo usuário',
      lastModified: '2025-03-22'
    },
    { 
      id: 'purchasePointsRate', 
      name: 'Taxa de Pontos por Compra', 
      value: 10, 
      enabled: true,
      description: 'Pontos concedidos a cada R$ 1,00 em compras realizadas',
      lastModified: '2025-04-10'
    },
    { 
      id: 'socialSharePoints', 
      name: 'Pontos por Compartilhamento', 
      value: 25, 
      enabled: false,
      description: 'Pontos concedidos ao compartilhar conteúdo nas redes sociais',
      lastModified: '2025-03-18'
    }
  ],
  missions: [
    { 
      id: 'dailyMissionResetTime', 
      name: 'Horário de Reset das Missões Diárias', 
      value: '00:00', 
      enabled: true,
      description: 'Horário em que as missões diárias são resetadas',
      lastModified: '2025-04-02'
    },
    { 
      id: 'maxActiveMissions', 
      name: 'Máximo de Missões Ativas', 
      value: 5, 
      enabled: true,
      description: 'Número máximo de missões que um usuário pode ter ativas simultaneamente',
      lastModified: '2025-04-08'
    },
    { 
      id: 'missionExpirationDays', 
      name: 'Dias para Expiração de Missões', 
      value: 7, 
      enabled: true,
      description: 'Número de dias até uma missão expirar se não for completada',
      lastModified: '2025-03-25'
    }
  ],
  rewards: [
    { 
      id: 'minPointsForReward', 
      name: 'Mínimo de Pontos para Recompensa', 
      value: 1000, 
      enabled: true,
      description: 'Mínimo de pontos necessários para resgatar qualquer recompensa',
      lastModified: '2025-04-03'
    },
    { 
      id: 'rewardProcessingTime', 
      name: 'Tempo de Processamento de Recompensas (horas)', 
      value: 24, 
      enabled: true,
      description: 'Tempo máximo para processar o resgate de uma recompensa',
      lastModified: '2025-04-09'
    },
    { 
      id: 'maxMonthlyRewards', 
      name: 'Máximo de Recompensas Mensais', 
      value: 5, 
      enabled: true,
      description: 'Número máximo de recompensas que um usuário pode resgatar por mês',
      lastModified: '2025-03-30'
    }
  ],
  raffles: [
    { 
      id: 'ticketPointsRate', 
      name: 'Pontos por Ticket de Sorteio', 
      value: 100, 
      enabled: true,
      description: 'Quantidade de pontos necessários para gerar um ticket de sorteio',
      lastModified: '2025-04-04'
    },
    { 
      id: 'maxTicketsPerUser', 
      name: 'Máximo de Tickets por Usuário', 
      value: 50, 
      enabled: true,
      description: 'Número máximo de tickets que um usuário pode ter em um único sorteio',
      lastModified: '2025-04-07'
    },
    { 
      id: 'weeklyRaffleDay', 
      name: 'Dia do Sorteio Semanal', 
      value: 'Sexta-feira', 
      enabled: true,
      description: 'Dia da semana em que o sorteio semanal é realizado',
      lastModified: '2025-03-20'
    }
  ]
};

const RulesConfiguration: React.FC = () => {
  const [rules, setRules] = useState(initialRules);
  const [currentCategory, setCurrentCategory] = useState('points');
  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { playSound } = useSounds();
  const form = useForm();

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleRule = (category: string, ruleId: string) => {
    setRules(prevRules => {
      const updatedRules = { ...prevRules };
      const ruleIndex = updatedRules[category].findIndex(rule => rule.id === ruleId);
      
      if (ruleIndex !== -1) {
        updatedRules[category][ruleIndex].enabled = !updatedRules[category][ruleIndex].enabled;
      }
      
      return updatedRules;
    });
    
    playSound('pop');
    
    toast({
      title: "Regra atualizada",
      description: `Status da regra alterado com sucesso.`,
    });
  };

  const handleEditRule = (category: string, ruleId: string) => {
    setEditingRule(ruleId);
    // In a real app, you might populate a form with the rule's values
  };

  const handleSaveRule = (category: string, ruleId: string, newValue: any) => {
    // Simulate saving
    setSaving(true);
    
    setTimeout(() => {
      setRules(prevRules => {
        const updatedRules = { ...prevRules };
        const ruleIndex = updatedRules[category].findIndex(rule => rule.id === ruleId);
        
        if (ruleIndex !== -1) {
          updatedRules[category][ruleIndex].value = newValue;
          updatedRules[category][ruleIndex].lastModified = new Date().toISOString().split('T')[0];
        }
        
        return updatedRules;
      });
      
      setEditingRule(null);
      setSaving(false);
      playSound('success');
      
      toast({
        title: "Alterações salvas",
        description: `As configurações de regras foram atualizadas com sucesso.`,
      });
    }, 1000);
  };

  const handleSaveAllRules = () => {
    // Simulate saving all rules
    setSaving(true);
    
    setTimeout(() => {
      setSaving(false);
      playSound('success');
      
      toast({
        title: "Configurações salvas",
        description: `Todas as configurações de regras foram atualizadas e aplicadas ao sistema.`,
      });
    }, 1500);
  };

  const getRuleValueInput = (rule) => {
    if (typeof rule.value === 'number') {
      return (
        <Input 
          type="number" 
          value={rule.value} 
          onChange={(e) => handleSaveRule(currentCategory, rule.id, parseInt(e.target.value))} 
          className="w-24 bg-galaxy-dark border-galaxy-purple/30"
        />
      );
    } else if (rule.value === 'true' || rule.value === 'false' || typeof rule.value === 'boolean') {
      return (
        <Switch 
          checked={typeof rule.value === 'boolean' ? rule.value : rule.value === 'true'} 
          onCheckedChange={(checked) => handleSaveRule(currentCategory, rule.id, checked)} 
        />
      );
    } else {
      return (
        <Input 
          type="text" 
          value={rule.value} 
          onChange={(e) => handleSaveRule(currentCategory, rule.id, e.target.value)} 
          className="w-32 lg:w-48 bg-galaxy-dark border-galaxy-purple/30"
        />
      );
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
                  <FileText className="h-5 w-5 mr-2 text-neon-lime" />
                  Configuração de Regras
                </CardTitle>
                <CardDescription>
                  Defina parâmetros para missões, recompensas, sorteios e sistema de pontos.
                </CardDescription>
              </div>
              <Button 
                variant="default" 
                size="sm" 
                className="bg-neon-lime text-galaxy-dark hover:bg-neon-lime/80"
                onClick={handleSaveAllRules}
                disabled={saving}
              >
                <Save className={`h-4 w-4 mr-2 ${saving ? 'animate-spin' : ''}`} />
                Salvar Alterações
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
              <Tabs defaultValue={currentCategory} onValueChange={setCurrentCategory} className="w-full">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
                  {ruleCategories.map(category => (
                    <TabsTrigger 
                      key={category.id} 
                      value={category.id}
                      className="data-[state=active]:text-neon-cyan"
                    >
                      <category.icon className="h-4 w-4 mr-2" />
                      {category.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {Object.keys(rules).map(category => (
                  <TabsContent key={category} value={category} className="space-y-4">
                    <Card className="bg-galaxy-dark border-galaxy-purple/30">
                      <CardContent className="p-0">
                        <div className="divide-y divide-galaxy-purple/20">
                          {rules[category].map(rule => (
                            <div 
                              key={rule.id} 
                              className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                            >
                              <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">{rule.name}</h4>
                                  <Badge 
                                    variant="outline" 
                                    className={`ml-2 ${rule.enabled ? 'border-neon-lime text-neon-lime' : 'border-red-500 text-red-500'}`}
                                  >
                                    {rule.enabled ? 'Ativo' : 'Inativo'}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{rule.description}</p>
                                <p className="text-xs text-muted-foreground">
                                  Última modificação: {rule.lastModified}
                                </p>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm">Valor:</span>
                                  {editingRule === rule.id ? 
                                    getRuleValueInput(rule) : 
                                    <span className="font-medium text-neon-cyan">{rule.value}</span>
                                  }
                                </div>
                                
                                <div className="flex gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="h-8 w-8 p-0 border-galaxy-purple/30"
                                    onClick={() => handleEditRule(category, rule.id)}
                                  >
                                    <PenSquare className="h-4 w-4" />
                                  </Button>
                                  
                                  <Switch 
                                    checked={rule.enabled} 
                                    onCheckedChange={() => handleToggleRule(category, rule.id)}
                                    className="data-[state=checked]:bg-neon-lime"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-galaxy-dark border-galaxy-purple/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                          Considerações Importantes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Alterações nas regras desta categoria podem afetar diretamente a experiência do usuário e o equilíbrio do sistema.
                          É recomendado testar as mudanças em um ambiente controlado antes de aplicá-las ao sistema de produção.
                        </p>
                        <div className="flex items-center gap-2 mt-4">
                          <CheckCircle2 className="h-4 w-4 text-neon-lime" />
                          <p className="text-sm">Alterações são aplicadas em tempo real para todos os usuários</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </CardContent>
          <CardFooter className="border-t border-galaxy-purple/30 mt-4 pt-4 flex justify-between">
            <Button variant="outline" className="border-galaxy-purple/30">
              <RefreshCw className="h-4 w-4 mr-2" />
              Restaurar Padrões
            </Button>
            <Button 
              onClick={handleSaveAllRules}
              disabled={saving}
              className="bg-neon-lime text-galaxy-dark hover:bg-neon-lime/80"
            >
              <Save className={`h-4 w-4 mr-2 ${saving ? 'animate-spin' : ''}`} />
              Aplicar Configurações
            </Button>
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
};

export default RulesConfiguration;
