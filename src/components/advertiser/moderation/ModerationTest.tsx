import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { missionService } from "@/services/supabase";
import { RotateCcw, ShieldAlert, Wrench, Info, AlertTriangle, CheckCircle, XCircle, RefreshCw, Bug, Database } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

interface ModerationTestProps {
  onRefresh: () => void;
}

const ModerationTest = ({ onRefresh }: ModerationTestProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [diagnosing, setDiagnosing] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState<any[]>([]);
  const [fixingIssues, setFixingIssues] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useAuth();
  
  // Cria uma submissão de teste para demonstrar o fluxo de moderação
  const createTestSubmission = async () => {
    if (!currentUser?.id) {
      toast({
        title: "Erro",
        description: "Você precisa estar autenticado para criar uma submissão de teste.",
        variant: "destructive"
      });
      return;
    }
    
    setIsCreating(true);
    
    try {
      // Busca as missões deste anunciante
      const { data: missions, error: missionsError } = await missionService.supabase
        .from('missions')
        .select('id')
        .eq('created_by', currentUser.id)
        .limit(1);
      
      if (missionsError) throw missionsError;
      
      if (!missions || missions.length === 0) {
        toast({
          title: "Sem missões",
          description: "Você precisa criar pelo menos uma campanha antes de testar a moderação.",
          variant: "destructive"
        });
        return;
      }
      
      // Cria uma submissão de teste
      const missionId = missions[0].id;
      const { data: submission, error: submissionError } = await missionService.supabase
        .from('mission_submissions')
        .insert({
          mission_id: missionId,
          user_id: currentUser.id, // Usa o próprio anunciante como usuário para teste
          status: 'pending',
          proof_text: 'Esta é uma submissão de teste para demonstrar o fluxo de moderação.',
          submission_data: { test_data: true, message: 'Submissão para demonstração do fluxo de moderação.' },
          submitted_at: new Date().toISOString(),
          review_stage: 'first_review'
        })
        .select()
        .single();
      
      if (submissionError) throw submissionError;
      
      toast({
        title: "Submissão de teste criada",
        description: "Uma nova submissão de teste foi criada para você moderar.",
      });
      
      // Notifica o componente pai para atualizar a lista
      onRefresh();
      
    } catch (error: any) {
      console.error('Erro ao criar submissão de teste:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível criar a submissão de teste.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  // Cria uma submissão em segunda instância para demonstração
  const createSecondInstanceTest = async () => {
    if (!currentUser?.id) {
      toast({
        title: "Erro",
        description: "Você precisa estar autenticado para criar uma submissão de teste.",
        variant: "destructive"
      });
      return;
    }
    
    setIsCreating(true);
    
    try {
      // Busca as missões deste anunciante
      const { data: missions, error: missionsError } = await missionService.supabase
        .from('missions')
        .select('id')
        .eq('created_by', currentUser.id)
        .limit(1);
      
      if (missionsError) throw missionsError;
      
      if (!missions || missions.length === 0) {
        toast({
          title: "Sem missões",
          description: "Você precisa criar pelo menos uma campanha antes de testar a moderação.",
          variant: "destructive"
        });
        return;
      }
      
      // Cria uma submissão já em segunda instância
      const missionId = missions[0].id;
      const { data: submission, error: submissionError } = await missionService.supabase
        .from('mission_submissions')
        .insert({
          mission_id: missionId,
          user_id: currentUser.id,
          status: 'second_instance_pending',
          proof_text: 'Esta é uma submissão em segunda instância para demonstração.',
          submission_data: { test_data: true, message: 'Demonstração de segunda instância.' },
          submitted_at: new Date().toISOString(),
          second_instance: true,
          review_stage: 'second_instance',
          feedback: 'Esta submissão foi rejeitada e enviada para segunda instância.'
        })
        .select()
        .single();
      
      if (submissionError) throw submissionError;
      
      toast({
        title: "Submissão em segunda instância criada",
        description: "Uma submissão em segunda instância foi criada para demonstração.",
      });
      
      // Notifica o componente pai para atualizar a lista
      onRefresh();
      
    } catch (error: any) {
      console.error('Erro ao criar submissão em segunda instância:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível criar a submissão de teste.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  // Cria uma submissão retornada do admin para o anunciante
  const createReturnedToAdvertiser = async () => {
    if (!currentUser?.id) {
      toast({
        title: "Erro",
        description: "Você precisa estar autenticado para criar uma submissão de teste.",
        variant: "destructive"
      });
      return;
    }
    
    setIsCreating(true);
    
    try {
      // Busca as missões deste anunciante
      const { data: missions, error: missionsError } = await missionService.supabase
        .from('missions')
        .select('id')
        .eq('created_by', currentUser.id)
        .limit(1);
      
      if (missionsError) throw missionsError;
      
      if (!missions || missions.length === 0) {
        toast({
          title: "Sem missões",
          description: "Você precisa criar pelo menos uma campanha antes de testar a moderação.",
          variant: "destructive"
        });
        return;
      }
      
      // Cria uma submissão retornada do admin para o anunciante
      const missionId = missions[0].id;
      const { data: submission, error: submissionError } = await missionService.supabase
        .from('mission_submissions')
        .insert({
          mission_id: missionId,
          user_id: currentUser.id,
          status: 'returned_to_advertiser',
          proof_text: 'Esta é uma submissão retornada do administrador para o anunciante.',
          submission_data: { test_data: true, message: 'Demonstração de retorno ao anunciante.' },
          submitted_at: new Date().toISOString(),
          second_instance: true,
          review_stage: 'advertiser',
          second_instance_status: 'approved',
          feedback: 'O administrador aprovou esta submissão em segunda instância e retornou para sua revisão final.'
        })
        .select()
        .single();
      
      if (submissionError) throw submissionError;
      
      toast({
        title: "Submissão retornada criada",
        description: "Uma submissão retornada do admin para você foi criada para demonstração.",
      });
      
      // Notifica o componente pai para atualizar a lista
      onRefresh();
      
    } catch (error: any) {
      console.error('Erro ao criar submissão retornada:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível criar a submissão de teste.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Diagnosticar problemas no fluxo de moderação
  const runDiagnostics = async () => {
    setDiagnosing(true);
    setDiagnosticResults([]);
    
    try {
      const results = [];
      
      // 1. Verificar se o usuário atual é um anunciante
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;
      
      if (!userId) {
        results.push({
          name: "Autenticação",
          status: "error",
          message: "Usuário não autenticado"
        });
        setDiagnosticResults(results);
        return;
      }
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', userId)
        .single();
      
      if (profileError || !profile) {
        results.push({
          name: "Perfil",
          status: "error",
          message: "Não foi possível obter o perfil do usuário"
        });
      } else if (profile.user_type !== 'anunciante') {
        results.push({
          name: "Tipo de usuário",
          status: "warning",
          message: `Usuário não é um anunciante (tipo: ${profile.user_type})`
        });
      } else {
        results.push({
          name: "Tipo de usuário",
          status: "success",
          message: "Usuário é um anunciante"
        });
      }
      
      // 2. Verificar se o anunciante tem missões
      const { data: missions, error: missionsError } = await supabase
        .from('missions')
        .select('id, title, advertiser_id')
        .eq('advertiser_id', userId);
      
      if (missionsError) {
        results.push({
          name: "Missões",
          status: "error",
          message: "Erro ao buscar missões"
        });
      } else if (!missions || missions.length === 0) {
        results.push({
          name: "Missões",
          status: "warning",
          message: "Anunciante não tem missões cadastradas"
        });
      } else {
        results.push({
          name: "Missões",
          status: "success",
          message: `Anunciante tem ${missions.length} missão(ões) cadastrada(s)`
        });
        
        // Verificar se o campo advertiser_id está preenchido corretamente
        const missionsWithoutAdvertiser = missions.filter(m => !m.advertiser_id);
        if (missionsWithoutAdvertiser.length > 0) {
          results.push({
            name: "Campo advertiser_id",
            status: "warning",
            message: `${missionsWithoutAdvertiser.length} missão(ões) sem advertiser_id definido`,
            fixable: true,
            fixType: "missing_advertiser_id",
            data: missionsWithoutAdvertiser
          });
        } else {
          results.push({
            name: "Campo advertiser_id",
            status: "success",
            message: "Todas as missões têm advertiser_id definido corretamente"
          });
        }
      }
      
      // 3. Verificar se há submissões pendentes
      const { data: pendingSubmissions, error: pendingError } = await supabase
        .from('mission_submissions')
        .select('id, mission_id, status')
        .eq('status', 'pending_approval');
      
      if (pendingError) {
        results.push({
          name: "Submissões pendentes",
          status: "error",
          message: "Erro ao buscar submissões pendentes"
        });
      } else {
        results.push({
          name: "Submissões pendentes",
          status: "success",
          message: `Existem ${pendingSubmissions?.length || 0} submissões pendentes no sistema`
        });
        
        if (pendingSubmissions && pendingSubmissions.length > 0 && missions && missions.length > 0) {
          // Verificar se alguma submissão pendente é para missões deste anunciante
          const missionIds = missions.map(m => m.id);
          const relevantSubmissions = pendingSubmissions.filter(sub => 
            missionIds.includes(sub.mission_id)
          );
          
          results.push({
            name: "Submissões para moderação",
            status: relevantSubmissions.length > 0 ? "success" : "warning",
            message: `${relevantSubmissions.length} submissão(ões) pendente(s) para missões deste anunciante`
          });
        }
      }
      
      // 4. Verificar políticas RLS verificando se conseguimos buscar submissões
      try {
        // Tentativa de buscar submissões - se funcionar, as políticas RLS estão corretas
        const { data: testSubmissions, error: testError } = await supabase
          .from('mission_submissions')
          .select('count')
          .limit(1);
        
        if (!testError) {
          results.push({
            name: "Políticas RLS",
            status: "success",
            message: "Acesso às submissões está funcionando corretamente"
          });
        } else {
          results.push({
            name: "Políticas RLS",
            status: "warning",
            message: `Erro ao acessar submissões: ${testError.message}`
          });
        }
      } catch (rlsError: any) {
        results.push({
          name: "Políticas RLS",
          status: "warning",
          message: `Erro ao verificar políticas RLS: ${rlsError.message}`
        });
      }
      
      setDiagnosticResults(results);
      
    } catch (error: any) {
      toast({
        title: "Erro no diagnóstico",
        description: error.message || "Ocorreu um erro durante o diagnóstico",
        variant: "destructive",
      });
    } finally {
      setDiagnosing(false);
    }
  };

  // Corrigir problemas identificados
  const fixIssues = async () => {
    setFixingIssues(true);
    
    try {
      const fixableIssues = diagnosticResults.filter(result => result.fixable);
      
      if (fixableIssues.length === 0) {
        toast({
          title: "Nenhum problema para corrigir",
          description: "Não foram encontrados problemas que possam ser corrigidos automaticamente",
        });
        return;
      }
      
      for (const issue of fixableIssues) {
        if (issue.fixType === "missing_advertiser_id") {
          // Obter o ID do anunciante atual
          const { data: session } = await supabase.auth.getSession();
          const advertiserId = session?.session?.user?.id;
          
          if (!advertiserId) continue;
          
          // Atualizar missões sem advertiser_id
          for (const mission of issue.data) {
            await supabase
              .from('missions')
              .update({ advertiser_id: advertiserId })
              .eq('id', mission.id);
          }
          
          toast({
            title: "Correção aplicada",
            description: `Campo advertiser_id atualizado em ${issue.data.length} missão(ões)`,
          });
        }
      }
      
      // Executar diagnóstico novamente para atualizar os resultados
      await runDiagnostics();
      
      // Atualizar a lista de submissões
      onRefresh();
      
    } catch (error: any) {
      toast({
        title: "Erro ao corrigir problemas",
        description: error.message || "Ocorreu um erro ao tentar corrigir os problemas",
        variant: "destructive",
      });
    } finally {
      setFixingIssues(false);
    }
  };

  return (
    <Card className="bg-galaxy-deepPurple/10 border-galaxy-purple/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-neon-pink" />
          Ferramentas de Teste da Moderação
        </CardTitle>
        <CardDescription>
          Crie submissões de teste para demonstrar o fluxo de moderação
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              onClick={createTestSubmission} 
              disabled={loading}
              className="bg-galaxy-dark hover:bg-galaxy-deepPurple"
            >
              {loading ? "Criando..." : "Criar Submissão Pendente"}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={createSecondInstanceTest} 
              disabled={isCreating}
              className="bg-galaxy-dark hover:bg-galaxy-deepPurple"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Criar Segunda Instância
              {isCreating && <div className="ml-2 animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={createReturnedToAdvertiser} 
              disabled={isCreating}
              className="bg-galaxy-dark hover:bg-galaxy-deepPurple"
            >
              Criar Retornada p/ Anunciante
              {isCreating && <div className="ml-2 animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={runDiagnostics} 
              disabled={diagnosing}
              className="bg-galaxy-dark hover:bg-galaxy-deepPurple"
            >
              <Bug className="mr-2 h-4 w-4" />
              {diagnosing ? "Diagnosticando..." : "Diagnosticar Problemas"}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onRefresh} 
              className="bg-galaxy-dark hover:bg-galaxy-deepPurple"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar Lista
            </Button>
          </div>
          
          {/* Resultados do diagnóstico */}
          {diagnosticResults.length > 0 && (
            <Accordion type="single" collapsible className="mt-4">
              <AccordionItem value="diagnostics">
                <AccordionTrigger className="text-sm font-medium">
                  Resultados do Diagnóstico ({diagnosticResults.length})
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    {diagnosticResults.map((result, index) => (
                      <div 
                        key={index} 
                        className={`p-3 rounded-md flex items-start gap-3 ${
                          result.status === "success" ? "bg-green-950/20 border border-green-800/30" :
                          result.status === "warning" ? "bg-amber-950/20 border border-amber-800/30" :
                          "bg-red-950/20 border border-red-800/30"
                        }`}
                      >
                        {result.status === "success" ? (
                          <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        ) : result.status === "warning" ? (
                          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <h4 className={`font-medium ${
                            result.status === "success" ? "text-green-400" :
                            result.status === "warning" ? "text-amber-400" :
                            "text-red-400"
                          }`}>
                            {result.name}
                          </h4>
                          <p className="text-sm text-gray-300">{result.message}</p>
                        </div>
                      </div>
                    ))}
                    
                    {/* Botão para corrigir problemas */}
                    {diagnosticResults.some(result => result.fixable) && (
                      <Button 
                        onClick={fixIssues} 
                        disabled={fixingIssues}
                        className="w-full mt-3"
                      >
                        <Database className="mr-2 h-4 w-4" />
                        {fixingIssues ? "Corrigindo problemas..." : "Corrigir Problemas Automaticamente"}
                      </Button>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModerationTest;
